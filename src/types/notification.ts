export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  data?: Record<string, string>;
}
