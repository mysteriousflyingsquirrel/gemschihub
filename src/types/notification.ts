/**
 * Push subscription stored per device.
 */
export interface PushSubscriptionRecord {
  id: string;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt: string; // ISO date string
}
