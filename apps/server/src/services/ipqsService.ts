import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const BASE = 'https://www.ipqualityscore.com/api/json';
const BLOCK_SCORE = 85;
const FLAG_SCORE = 70;

interface IpResult {
  fraud_score: number;
  proxy: boolean;
  vpn: boolean;
  success: boolean;
}

interface EmailResult {
  fraud_score: number;
  disposable: boolean;
  valid: boolean;
  success: boolean;
}

async function fetchIp(ip: string): Promise<IpResult | null> {
  try {
    const res = await fetch(`${BASE}/ip/${env.IPQS_API_KEY}/${ip}?strictness=1`);
    return (await res.json()) as IpResult;
  } catch {
    return null;
  }
}

async function fetchEmail(email: string): Promise<EmailResult | null> {
  try {
    const res = await fetch(
      `${BASE}/email/${env.IPQS_API_KEY}/${encodeURIComponent(email)}?strictness=1`,
    );
    return (await res.json()) as EmailResult;
  } catch {
    return null;
  }
}

function determineOutcome(
  ipScore: number,
  emailScore: number,
  isProxy: boolean,
  isVpn: boolean,
  isDisposable: boolean,
): { outcome: 'BLOCKED' | 'FLAGGED' | 'ALLOWED'; reason?: string } {
  // VPN/Proxy always flagged only — never blocked (legitimate users use VPNs)
  if (isProxy) return { outcome: 'FLAGGED', reason: 'Proxy detected' };
  if (isVpn) return { outcome: 'FLAGGED', reason: 'VPN detected' };
  if (ipScore >= BLOCK_SCORE)
    return { outcome: 'BLOCKED', reason: `High-risk IP (score: ${ipScore})` };
  if (isDisposable) return { outcome: 'BLOCKED', reason: 'Disposable email address' };
  if (emailScore >= BLOCK_SCORE)
    return { outcome: 'BLOCKED', reason: `High-risk email (score: ${emailScore})` };
  if (ipScore >= FLAG_SCORE || emailScore >= FLAG_SCORE) {
    return {
      outcome: 'FLAGGED',
      reason: `Elevated risk score (IP: ${ipScore}, Email: ${emailScore})`,
    };
  }
  return { outcome: 'ALLOWED' };
}

function ipScores(d: IpResult | null) {
  return { ipScore: d?.fraud_score ?? 0, isProxy: d?.proxy ?? false, isVpn: d?.vpn ?? false };
}

function emailScores(d: EmailResult | null) {
  return { emailScore: d?.fraud_score ?? 0, isDisposable: d?.disposable ?? false };
}

export async function runRegistrationFraudCheck(
  ip: string,
  email: string,
  userId?: string,
): Promise<'BLOCKED' | 'FLAGGED' | 'ALLOWED'> {
  if (!env.IPQS_API_KEY) return 'ALLOWED';

  const [ipData, emailData] = await Promise.all([fetchIp(ip), fetchEmail(email)]);
  const { ipScore, isProxy, isVpn } = ipScores(ipData);
  const { emailScore, isDisposable } = emailScores(emailData);
  const { outcome, reason } = determineOutcome(ipScore, emailScore, isProxy, isVpn, isDisposable);

  await prisma.fraudEvent.create({
    data: {
      userId: userId ?? null,
      type: 'REGISTRATION',
      ip,
      email,
      ipScore,
      emailScore,
      isProxy,
      isVpn,
      outcome,
      reason: reason ?? null,
      metadata: { ipData: ipData as object, emailData: emailData as object },
    },
  });

  if (outcome !== 'ALLOWED') logger.warn({ ip, email, outcome, reason }, 'Fraud check triggered');
  return outcome;
}
