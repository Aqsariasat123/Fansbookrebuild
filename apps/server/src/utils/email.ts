import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from './logger.js';
import { emailQueue } from '../jobs/queue.js';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (env.EMAIL_ENABLED !== 'true') {
    logger.info({ to, subject }, '[email] EMAIL_ENABLED=false — logged instead of sent');
    return true;
  }

  try {
    await getTransporter().sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      html,
    });
    logger.info({ to, subject }, 'Email sent successfully');
    return true;
  } catch (err) {
    logger.error({ err, to, subject }, 'Failed to send email');
    return false;
  }
}

/** Queue an email for async delivery via BullMQ (best-effort). */
export function queueEmail(to: string, subject: string, html: string) {
  emailQueue.add('send-email', { to, subject, html }).catch((err) => {
    logger.warn({ err, to, subject }, 'Failed to queue email — sending directly');
    sendEmail(to, subject, html);
  });
}
