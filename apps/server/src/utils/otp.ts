import bcrypt from 'bcryptjs';
import { prisma } from '../config/database.js';
import { sendEmail } from './email.js';
import { logger } from './logger.js';

const OTP_EXPIRY_MINUTES = 5;

function generateSixDigitOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}${local[1]}${'*'.repeat(Math.min(local.length - 2, 5))}@${domain}`;
}

export async function generateOtp(
  userId: string,
  type: 'EMAIL_VERIFY' | 'PASSWORD_RESET',
): Promise<string> {
  // Invalidate any existing unused OTPs of this type
  await prisma.otpCode.updateMany({
    where: { userId, type, used: false },
    data: { used: true },
  });

  const plainOtp = generateSixDigitOtp();
  const hashedOtp = await bcrypt.hash(plainOtp, 10);

  await prisma.otpCode.create({
    data: {
      userId,
      code: hashedOtp,
      type,
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    },
  });

  logger.info(`[otp] Generated ${type} OTP for user ${userId}: ${plainOtp}`);
  return plainOtp;
}

export async function verifyOtp(
  userId: string,
  plainOtp: string,
  type: 'EMAIL_VERIFY' | 'PASSWORD_RESET',
): Promise<boolean> {
  const otpRecords = await prisma.otpCode.findMany({
    where: { userId, type, used: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  for (const record of otpRecords) {
    const isMatch = await bcrypt.compare(plainOtp, record.code);
    if (isMatch) {
      await prisma.otpCode.update({
        where: { id: record.id },
        data: { used: true },
      });
      return true;
    }
  }
  return false;
}

export async function sendOtpEmail(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, username: true },
  });
  if (!user) return;

  const plainOtp = await generateOtp(userId, 'EMAIL_VERIFY');
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #f8f8f8;">Email Verification</h2>
      <p style="color: #ccc;">Hi ${user.username}, your verification code is:</p>
      <div style="text-align: center; padding: 20px;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #01adf1;">${plainOtp}</span>
      </div>
      <p style="color: #999; font-size: 13px;">This code expires in ${OTP_EXPIRY_MINUTES} minutes. Do not share it with anyone.</p>
    </div>
  `;
  sendEmail(user.email, 'Fansbook - Email Verification Code', html);
}
