import { supabase } from './supabase';

function getLocale(): string {
  return localStorage.getItem('thesdel_locale') || 'en';
}

export async function subscribeToPush(userId: string) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return null;
  }

  const registration = await navigator.serviceWorker.ready;

  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    return null;
  }

  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

  if (!vapidPublicKey) {
    throw new Error('Missing VITE_VAPID_PUBLIC_KEY');
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: vapidPublicKey,
  });

  const json = subscription.toJSON();

  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    throw new Error('Invalid push subscription');
  }

  const { error } = await supabase
    .from('push_subscriptions')
    .upsert(
      {
        user_id: userId,
        endpoint: json.endpoint,
        p256dh: json.keys.p256dh,
        auth: json.keys.auth,
        locale: getLocale(),
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,endpoint',
      },
    );

  if (error) {
    throw error;
  }

  return subscription;
}