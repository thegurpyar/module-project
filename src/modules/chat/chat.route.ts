import express from "express";
import mongoose from "mongoose";
import Conversation from "./conversation.model";
import Message from "./message.model";
import { auth, role } from "../../middlewares/auth.middleware";
import { successResponse } from "../../middlewares/errorHandler";
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.userId);

  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
  const skip = (page - 1) * limit;

  const search = (req.query.search as string || "").trim();
  const shouldSearch = search.length >= 3;

  const pipeline: any[] = [
    // 1. User must be part of conversation
    {
      $match: {
        participants: userId,
      },
    },

    // 2. Get last message
    {
      $lookup: {
        from: "messages",
        let: { convoId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$conversationId", "$$convoId"] } } },
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
        ],
        as: "lastMessage",
      },
    },

    // Pagination
    { $skip: skip },
    { $limit: limit },

    // 3. Get unread count
    {
      $lookup: {
        from: "messages",
        let: { convoId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$conversationId", "$$convoId"] },
                  { $eq: ["$receiverId", userId] },
                  { $eq: ["$isRead", false] },
                ],
              },
            },
          },
          { $count: "count" },
        ],
        as: "unreadMeta",
      },
    },

    // 4. Extract other participant ID
    {
      $addFields: {
        otherUserId: {
          $first: {
            $filter: {
              input: "$participants",
              as: "p",
              cond: { $ne: ["$$p", userId] },
            },
          },
        },
      },
    },

    // 5. Fetch other user
    {
      $lookup: {
        from: "users",
        localField: "otherUserId",
        foreignField: "_id",
        as: "otherUser",
      },
    },

    // 6. Normalize arrays
    {
      $addFields: {
        lastMessage: { $arrayElemAt: ["$lastMessage", 0] },
        unreadCount: {
          $ifNull: [{ $arrayElemAt: ["$unreadMeta.count", 0] }, 0],
        },
        otherUser: { $arrayElemAt: ["$otherUser", 0] },
      },
    },
  ];

  // 🔍 Apply search ONLY if >= 3 chars
  if (shouldSearch) {
    pipeline.push({
      $match: {
        "otherUser.full_name": {
          $regex: search,
          $options: "i",
        },
      },
    });
  }

  // 7. Sort
  pipeline.push(
    {
      $sort: { "lastMessage.createdAt": -1 },
    },
    {
      $project: {
        _id: 1,
        unreadCount: 1,
        lastMessage: 1,
        isArchived: 1,
        otherUser: {
          _id: 1,
          full_name: 1,
          role: 1,
          profilePhoto: 1,
        },
      },
    }
  );

  const [chats, total] = await Promise.all([
    Conversation.aggregate(pipeline),
    Conversation.countDocuments({ participants: userId }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return successResponse(res, {
    data: chats,
    pagination: {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  });
});



router.get("/messages", auth, async (req, res) => {
  const { conversationId, cursor } = req.query;
  const limit = Math.min(Number(req.query.limit) || 20, 50);

  const query: any = {
    conversationId: new mongoose.Types.ObjectId(conversationId as string),
    $or: [
      { senderId: new mongoose.Types.ObjectId(req.userId) },
      { receiverId: new mongoose.Types.ObjectId(req.userId) },
    ],
  };

  if (cursor) {
    query._id = { $lt: new mongoose.Types.ObjectId(cursor as string) };
  }

  const messages = await Message.find(query)
    .sort({ _id: -1 })
    .limit(limit)
    .lean();

  return successResponse(res, {
    data: messages.reverse(),
    nextCursor:
      messages.length > 0 ? messages[0]._id.toString() : null,
    hasMore: messages.length === limit,
  });
});




export default router;