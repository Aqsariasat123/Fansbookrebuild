import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { sendEmail } from '../utils/email.js';
import crypto from 'crypto';

function isDiditConfigured(): boolean {
  return Boolean(env.DIDIT_CLIENT_ID && env.DIDIT_CLIENT_SECRET);
}

export async function createVerificationSession(
  userId: string,
  firstName: string,
  lastName: string,
  _dob: string,
) {
  const existing = await prisma.identityVerification.findUnique({ where: { userId } });
  if (existing && existing.retryCount >= 3) {
    throw new Error('MAX_RETRIES');
  }

  if (!isDiditConfigured()) {
    await prisma.identityVerification.upsert({
      where: { userId },
      create: { userId, status: 'PENDING', diditSessionId: 'PLACEHOLDER' },
      update: { status: 'PENDING', retryCount: { increment: 1 } },
    });
    logger.info(
      { userId, firstName, lastName },
      'Didit not configured — placeholder verification session created',
    );
    return { sdkToken: 'PLACEHOLDER_TOKEN', sessionId: 'PLACEHOLDER' };
  }

  try {
    const tokenRes = await fetch('https://api.didit.me/v1/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: env.DIDIT_CLIENT_ID,
        client_secret: env.DIDIT_CLIENT_SECRET,
        grant_type: 'client_credentials',
      }),
    });
    const { access_token } = (await tokenRes.json()) as { access_token: string };

    const sessionRes = await fetch('https://api.didit.me/v1/session/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${access_token}` },
      body: JSON.stringify({
        vendor_data: userId,
        callback: `${env.CLIENT_URL}/verify-identity?done=1`,
        features: 'OCR + FACE',
      }),
    });
    const session = (await sessionRes.json()) as { session_id: string; url: string };

    await prisma.identityVerification.upsert({
      where: { userId },
      create: { userId, status: 'PENDING', diditSessionId: session.session_id },
      update: {
        status: 'PENDING',
        diditSessionId: session.session_id,
        retryCount: { increment: 1 },
      },
    });

    return { sdkToken: session.url, sessionId: session.session_id };
  } catch (err) {
    logger.error({ err, userId }, 'Didit API call failed');
    throw new Error('DIDIT_ERROR');
  }
}

export async function getVerificationStatus(userId: string) {
  const record = await prisma.identityVerification.findUnique({ where: { userId } });
  if (!record) return { status: 'UNVERIFIED', retryCount: 0 };
  return { status: record.status, retryCount: record.retryCount };
}

function verifyWebhookSignature(rawBody: Buffer, signature: string) {
  if (!env.DIDIT_WEBHOOK_SECRET) return;
  const expected = crypto
    .createHmac('sha256', env.DIDIT_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');
  if (signature !== `sha256=${expected}`) throw new Error('Invalid webhook signature');
}

function mapDiditStatus(status: string): 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW' {
  if (status === 'Approved') return 'APPROVED';
  if (status === 'Declined') return 'REJECTED';
  return 'MANUAL_REVIEW';
}

function mapDocumentType(raw?: string): 'PASSPORT' | 'DRIVING_LICENCE' | 'NATIONAL_ID' | undefined {
  const t = raw?.toUpperCase();
  if (t === 'PASSPORT') return 'PASSPORT';
  if (t === 'DRIVING_LICENCE') return 'DRIVING_LICENCE';
  if (t === 'NATIONAL_ID') return 'NATIONAL_ID';
  return undefined;
}

export async function handleDiditWebhook(rawBody: Buffer, signature: string, payload: unknown) {
  if (!isDiditConfigured()) return;
  verifyWebhookSignature(rawBody, signature);

  const event = payload as {
    session_id: string;
    status: string;
    vendor_data: string;
    kyc_document?: { type: string };
  };

  const userId = event.vendor_data;
  if (!userId) return;

  const newStatus = mapDiditStatus(event.status);
  const documentType = mapDocumentType(event.kyc_document?.type);

  await prisma.identityVerification.updateMany({
    where: { diditSessionId: event.session_id },
    data: {
      status: newStatus,
      reviewedAt: new Date(),
      rawResult: event as object,
      ...(documentType ? { documentType } : {}),
    },
  });

  const userStatus = newStatus === 'MANUAL_REVIEW' ? 'PENDING' : newStatus;
  await prisma.user.update({ where: { id: userId }, data: { verificationStatus: userStatus } });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, username: true },
  });
  if (user) await sendVerificationResultEmail(user.email, user.username, newStatus);
}

export async function adminApprove(verificationId: string, adminId: string) {
  const v = await prisma.identityVerification.update({
    where: { id: verificationId },
    data: { status: 'APPROVED', reviewedAt: new Date(), reviewedByAdminId: adminId },
    include: { user: { select: { id: true, email: true, username: true } } },
  });
  await prisma.user.update({ where: { id: v.userId }, data: { verificationStatus: 'APPROVED' } });
  await sendVerificationResultEmail(v.user.email, v.user.username, 'APPROVED');
}

export async function adminReject(verificationId: string, adminId: string, reason: string) {
  const v = await prisma.identityVerification.update({
    where: { id: verificationId },
    data: {
      status: 'REJECTED',
      reviewedAt: new Date(),
      reviewedByAdminId: adminId,
      rejectionReason: reason,
    },
    include: { user: { select: { id: true, email: true, username: true } } },
  });
  await prisma.user.update({ where: { id: v.userId }, data: { verificationStatus: 'REJECTED' } });
  await sendVerificationResultEmail(v.user.email, v.user.username, 'REJECTED');
}

export async function adminRequestResubmit(verificationId: string, adminId: string) {
  const v = await prisma.identityVerification.update({
    where: { id: verificationId },
    data: { status: 'PENDING', reviewedByAdminId: adminId, retryCount: 0 },
    include: { user: { select: { id: true, email: true, username: true } } },
  });
  await prisma.user.update({ where: { id: v.userId }, data: { verificationStatus: 'PENDING' } });
}

async function sendVerificationResultEmail(email: string, username: string, status: string) {
  const messages: Record<string, string> = {
    APPROVED: 'Your identity has been verified. You now have full access to Inscrio.',
    REJECTED:
      'We were unable to verify your identity. Please try again with a clear photo of your ID.',
    MANUAL_REVIEW:
      'Your verification is being reviewed by our team. We will notify you within 24 hours.',
  };
  const body = messages[status] ?? 'Verification update.';
  await sendEmail(
    email,
    'Inscrio Identity Verification Result',
    `<p>Hi @${username},</p><p>${body}</p>`,
  );
}
