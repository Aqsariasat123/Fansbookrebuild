import webPush from 'web-push';
import { logger } from '../utils/logger.js';

// VAPID keys — use env vars; in dev, generate ephemeral keys if missing
const generated = webPush.generateVAPIDKeys();

export const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || generated.publicKey;

const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || generated.privateKey;

const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@fansbook.com';

webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

if (!process.env.VAPID_PUBLIC_KEY) {
  logger.warn(
    'VAPID_PUBLIC_KEY not set — using ephemeral keys (push tokens will not survive restarts)',
  );
}

interface PushSubscriptionData {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  url?: string;
  tag?: string;
}

export async function sendPushNotification(
  subscription: PushSubscriptionData,
  payload: PushPayload,
): Promise<boolean> {
  try {
    await webPush.sendNotification(subscription, JSON.stringify(payload));
    return true;
  } catch (err: unknown) {
    const statusCode = (err as { statusCode?: number }).statusCode;
    if (statusCode === 410 || statusCode === 404) {
      // Subscription expired or invalid — caller should clean up
      logger.info({ endpoint: subscription.endpoint }, 'Push subscription expired');
      return false;
    }
    logger.error({ err, endpoint: subscription.endpoint }, 'Failed to send push notification');
    return false;
  }
}
