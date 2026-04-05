import admin from "../../config/firebase";
import Device from "./device.model";
import { NotificationPayload } from "../../types/notification";

/**
 * Utility to split array into chunks
 * FCM max = 500 tokens per request
 */
const chunk = (arr: string[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

export const sendDirect = async (payload: NotificationPayload) => {
  const { userId, title, message, data } = payload;

  const devices = await Device.find({ userId }).lean();
  if (!devices.length) return;

  const tokens = devices.map(d => d.token);
  const batches = chunk(tokens, 500);

  const invalidTokens: string[] = [];

  for (const batch of batches) {
    try {
      const response = await admin.messaging().sendEachForMulticast({
        tokens: batch,
        notification: {
          title,
          body: message
        },
        data
      });

      response.responses.forEach((res, index) => {
        if (!res.success) {
          const code = res.error?.code;
          if (
            code === "messaging/invalid-registration-token" ||
            code === "messaging/registration-token-not-registered"
          ) {
            invalidTokens.push(batch[index]);
          }
        }
      });
    } catch (err) {
      console.error("FCM batch failed", err);
      // continue to next batch
    }
  }

  // Single cleanup
  if (invalidTokens.length) {
    await Device.deleteMany({
      token: { $in: invalidTokens }
    });
  }
};

