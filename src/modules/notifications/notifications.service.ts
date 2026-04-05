import { sendDirect } from "./notifications.sender";
import { NotificationPayload } from "../../types/notification";

export const notifyUser = async (payload: NotificationPayload) => {
  // PHASE 1
  return sendDirect(payload);

  // PHASE 2 (later)    
  // return enqueueNotification(payload);
};
