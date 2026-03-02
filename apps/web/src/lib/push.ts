import { api } from './api';

async function getVapidKey(): Promise<string> {
  const { data } = await api.get<{ key: string }>('/push/vapid-key');
  return data.key;
}

export async function subscribeToPush(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;

  const registration = await navigator.serviceWorker.ready;
  const vapidKey = await getVapidKey();

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: vapidKey,
  });

  await api.post('/push/subscribe', subscription.toJSON());
  return true;
}

export async function unsubscribeFromPush(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) return false;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return false;

  await subscription.unsubscribe();
  await api.post('/push/unsubscribe', { endpoint: subscription.endpoint });
  return true;
}

export async function getPushStatus(): Promise<{ subscribed: boolean }> {
  const { data } = await api.get<{ subscribed: boolean }>('/push/status');
  return data;
}
