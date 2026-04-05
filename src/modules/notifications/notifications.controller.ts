import { Request, Response } from 'express';
import Notification from './notifications.model';
import { successResponse, errorResponse } from '../../middlewares/errorHandler';
import Device from './device.model';
import { NotificationPayload } from "../../types/notification";
import { sendDirect } from './notifications.sender';
import NotificationPreference from "./notificationpreference.model";
import AdminNotificationPreference from "./adminnotification.model";

export const registerDevice = async (req: any, res: any) => {
  try {
    const { token, platform } = req.body;
    const userId = req.userId;

    if (!token) {
      return errorResponse(res, "FCM token is required", 400);
    }

    if (!platform) {
      return errorResponse(res, "Platform is required", 400);
    }

    await Device.findOneAndUpdate(
      { token }, //token is globally unique
      {
        userId,
        platform: platform.toLowerCase(),
        lastActiveAt: new Date()
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    return successResponse(
      res,
      { token, platform },
      "Device registered successfully"
    );
  } catch (error: any) {
    return errorResponse(
      res,
      error.message || "Internal server error",
      500
    );
  }
};


export const sendNotification = async (req: any, res: any) => {
  const payload: NotificationPayload = {
    userId: req.body.userId,
    title: req.body.title,
    message: req.body.message,
    data: req.body.data
  };
  await sendDirect(payload);

  res.json({ success: true });
};



export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const notifications = await Notification.find({ userId: req.userId }).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum);
    const total = await Notification.countDocuments({ userId: req.userId });
    return successResponse(res, { notifications, page: pageNum, limit: limitNum, total }, "Notifications retrieved successfully");
  } catch (error) {
    return errorResponse(res, error.message || 'Internal server error', 500);
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, read: false },
      { $set: { read: true } }
    );

    return successResponse(res,{}, 'All unread notifications marked as read successfully');
  } catch (error) {
    return errorResponse(res, error.message || 'Internal server error', 500);
  }
};


export const updateNotificationPreference = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.userId;
    const { path, value } = req.body;
    if (!path || typeof value !== "boolean") {
      return errorResponse(res, "Invalid path or value", 400);
    }

    const ALLOWED_PATHS = [
      "messages.newMessageReceived",
      "messages.messageReplies",
      "messages.attachmentsShared",

      "collaborations.newCollaborationRequest",
      "collaborations.requestAcceptedDeclined",
      "collaborations.projectStatusUpdates",

      "brandActions.profileViewed",
      "brandActions.invitesViewed",

      "creatorActions.profileViewed",
      "creatorActions.invitesViewed",

      "system.subscriptionReminders",
      "system.securityAlerts",
      "system.appUpdates",

      "channels.push",
      "channels.email",
      "channels.inApp",
    ];

    if (!ALLOWED_PATHS.includes(path)) {
      return errorResponse(res, "Updating this field is not allowed", 403);
    }

    const updated = await NotificationPreference.findOneAndUpdate(
      { userId },
      { $set: { [path]: value } },
      { new: true, upsert: true }
    );

    return successResponse(res, updated, "Notification preference updated successfully");
  } catch (error) {
    console.error("Notification preference update error:", error);
    return errorResponse(res, "Something went wrong", 500);
  }
};


export const updateAdminNotificationPreference = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.userId;
    const { path, value } = req.body;
    if (!path || typeof value !== "boolean") {
      return errorResponse(res, "Invalid path or value", 400);
    }

    const ALLOWED_PATHS = [
      "newuser",
      "approval",
      "revenue",
      "system",
    ];

    if (!ALLOWED_PATHS.includes(path)) {
      return errorResponse(res, "Updating this field is not allowed", 403);
    }

    const updated = await AdminNotificationPreference.findOneAndUpdate(
      { userId },
      { $set: { [path]: value } },
      { new: true, upsert: true }
    );

    console.log(updated,"jjbjbbbj")
    return successResponse(res, updated, "Notification preference updated successfully");
  } catch (error) {
    console.error("Notification preference update error:", error);
    return errorResponse(res, "Something went wrong", 500);
  }
};

export const getNotificationPreference = async (req: any, res: any) => {
  const userId = req.userId;
  console.log(req.user.role,"/././.")
  if(req.user.role === "admin") {
    const preference = await AdminNotificationPreference.findOne({ userId });
    return successResponse(res, preference, "Admin notification preference retrieved successfully");
  }
  
  const preference = await NotificationPreference.findOne({ userId });

  return successResponse(res, preference, "Notification preference retrieved successfully");
}


