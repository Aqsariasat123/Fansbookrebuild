import { wrapInLayout } from './email-layout.js';
import { env } from '../config/env.js';

const baseUrl = env.CLIENT_URL;
const textStyle = 'font-size:16px; color:#f8f8f8; line-height:1.6;';
const btnStyle =
  'display:inline-block; padding:14px 32px; background:linear-gradient(90deg,#01adf1,#a61651); color:#ffffff; text-decoration:none; border-radius:80px; font-size:16px; font-weight:600;';

export function emailVerificationTemplate(
  username: string,
  token: string,
): { subject: string; html: string } {
  const verifyUrl = `${baseUrl}/verify-email?token=${token}`;
  const body = `
    <h2 style="margin:0 0 20px; font-size:22px; color:#f8f8f8;">Verify Your Email</h2>
    <p style="${textStyle}">Hi ${username},</p>
    <p style="${textStyle}">Welcome to Fansbook! Please verify your email address to get started.</p>
    <p style="text-align:center; margin:30px 0;">
      <a href="${verifyUrl}" style="${btnStyle}">Verify Email</a>
    </p>
    <p style="${textStyle}">Or copy this link: <a href="${verifyUrl}" style="color:#01adf1;">${verifyUrl}</a></p>
    <p style="font-size:13px; color:#5d5d5d;">If you didn't create an account, please ignore this email.</p>
  `;
  return { subject: 'Verify your Fansbook email', html: wrapInLayout('Verify Email', body) };
}

export function passwordResetTemplate(
  username: string,
  token: string,
): { subject: string; html: string } {
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;
  const body = `
    <h2 style="margin:0 0 20px; font-size:22px; color:#f8f8f8;">Reset Your Password</h2>
    <p style="${textStyle}">Hi ${username},</p>
    <p style="${textStyle}">We received a request to reset your password. Click the button below to set a new one.</p>
    <p style="text-align:center; margin:30px 0;">
      <a href="${resetUrl}" style="${btnStyle}">Reset Password</a>
    </p>
    <p style="${textStyle}">This link expires in 1 hour.</p>
    <p style="font-size:13px; color:#5d5d5d;">If you didn't request this, you can safely ignore this email.</p>
  `;
  return { subject: 'Reset your Fansbook password', html: wrapInLayout('Reset Password', body) };
}

const NOTIF_LABELS: Record<string, string> = {
  LIKE: 'New Like',
  COMMENT: 'New Comment',
  FOLLOW: 'New Follower',
  SUBSCRIBE: 'New Subscriber',
  TIP: 'Tip Received',
  MESSAGE: 'New Message',
  LIVE: 'Live Stream',
  STORY: 'New Story',
  MENTION: 'You Were Mentioned',
  POST: 'New Post',
  SYSTEM: 'System Notification',
  BADGE: 'Badge Earned',
  MARKETPLACE: 'Marketplace Update',
};

export function notificationEmailTemplate(
  type: string,
  message: string,
): { subject: string; html: string } {
  const label = NOTIF_LABELS[type] || 'Notification';
  const body = `
    <h2 style="margin:0 0 20px; font-size:22px; color:#f8f8f8;">${label}</h2>
    <p style="${textStyle}">${message}</p>
    <p style="text-align:center; margin:30px 0;">
      <a href="${baseUrl}/notifications" style="${btnStyle}">View on Fansbook</a>
    </p>
    <p style="font-size:13px; color:#5d5d5d;">You can manage notification preferences in your settings.</p>
  `;
  return { subject: `Fansbook: ${label}`, html: wrapInLayout(label, body) };
}

export function welcomeTemplate(username: string): { subject: string; html: string } {
  const body = `
    <h2 style="margin:0 0 20px; font-size:22px; color:#f8f8f8;">Welcome to Fansbook!</h2>
    <p style="${textStyle}">Hi ${username},</p>
    <p style="${textStyle}">Your account has been created successfully. Start exploring and connecting with your favorite creators.</p>
    <p style="text-align:center; margin:30px 0;">
      <a href="${baseUrl}/feed" style="${btnStyle}">Go to Feed</a>
    </p>
    <p style="${textStyle}">Have questions? Visit our <a href="${baseUrl}/faq" style="color:#01adf1;">FAQ</a> or contact support.</p>
  `;
  return { subject: 'Welcome to Fansbook!', html: wrapInLayout('Welcome', body) };
}
