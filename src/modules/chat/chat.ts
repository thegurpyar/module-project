import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import Message from "./message.model";
import Conversation from "./conversation.model";
import {
  addUserSocket,
  removeUserSocket,
  getUserSocketIds,
} from "./chat.util";
import { socketAuth, AuthenticatedSocket } from "./socketAuth";

let ioInstance: Server | null = null;

export const invalidateUserSockets = (userId: string) => {
  if(!userId){
    return;
  }
  if (!ioInstance) {
    console.error('Socket.IO server not initialized');
    return;
  }
  
  const socketIds = getUserSocketIds(userId);
  if (!socketIds.length) return;

  socketIds.forEach(socketId => {
    const socket = ioInstance?.sockets.sockets.get(socketId);
    if (socket) {
      socket.emit('forceLogout', 'Please log in again.');
      socket.disconnect(true); // immediately disconnect
    }
    removeUserSocket(userId, socketId);
  });
};

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? process.env.FRONTEND_URL
          : ["http://localhost:3000", "http://127.0.0.1:3000"],
      credentials: true,
    },
  });

  ioInstance = io; 

  io.use(socketAuth);

  io.on("connection", (socket: AuthenticatedSocket) => {
    const { userId } = socket;

    if (!userId) {
      socket.disconnect();
      return;
    }

    // ✅ Add socket
    addUserSocket(userId, socket.id);
    console.log(`User ${userId} connected → ${socket.id}`);

    // 🔹 SEND MESSAGE
    socket.on(
      "send_message",
      async ({ conversationId, receiverId, content, messageType = "text" }) => {
        const message = await Message.create({
          conversationId,
          senderId: userId,
          receiverId,
          content,
          messageType,
        });

        const payload = {
          _id: message._id,
          conversationId,
          senderId: userId,
          receiverId,
          content,
          messageType,
          createdAt: message.createdAt,
        };

        // 🔹 1. Send message to receiver (inner chat)
        getUserSocketIds(receiverId).forEach((sid) => {
          console.log(`Sending message to ${receiverId} → ${sid}`);
          io.to(sid).emit("receive_message", payload);

          // 🔥 2. Tell receiver to refresh WALL
          io.to(sid).emit("wall_update", {
            conversationId,
            lastMessage: content,
            createdAt: message.createdAt,
          });

        });

        // 🔹 3. ACK sender
        getUserSocketIds(userId).forEach((sid) => {
          io.to(sid).emit("message_ack", {
            success: true,
            messageId: message._id,
          });

          // 🔥 4. Tell sender to refresh WALL  
          io.to(sid).emit("wall_update", {
            conversationId,
            lastMessage: content,
            createdAt: message.createdAt,
          });

        });
      }
    );


    // 🔹 MARK AS READ
socket.on("message_seen", async ({ conversationId }) => {
  const result = await Message.updateMany(
    {
      conversationId,
      receiverId: userId,
      isRead: false,
    },
    { $set: { isRead: true, readAt: new Date() } }
  );

  if (result.modifiedCount === 0) return;

  // Find conversation to get other user
  const conversation = await Conversation.findById(conversationId).select("participants");

  const otherUserId = conversation.participants.find(
    (id) => id.toString() !== userId
  );

  if (!otherUserId) return;

  getUserSocketIds(otherUserId.toString()).forEach((sid) => {
    io.to(sid).emit("message_seen", {
      conversationId,
      seenBy: userId,
    });
  });
});



    // 🔊 AUDIO CALL SIGNALING
    socket.on("call_user", ({ to }) => {
      const receiverSockets = getUserSocketIds(to);

      receiverSockets.forEach((sid) => {
        io.to(sid).emit("incoming_call", {
          from: userId,
        });
      });
    });

    socket.on("call_accepted", ({ to }) => {
      getUserSocketIds(to).forEach((sid) => {
        io.to(sid).emit("call_accepted", {
          from: userId,
        });
      });
    });

    socket.on("call_rejected", ({ to }) => {
      getUserSocketIds(to).forEach((sid) => {
        io.to(sid).emit("call_rejected", {
          from: userId,
        });
      });
    });

    // 🔁 WEBRTC SIGNALING
    socket.on("webrtc_offer", ({ to, offer }) => {
      getUserSocketIds(to).forEach((sid) => {
        io.to(sid).emit("webrtc_offer", {
          from: userId,
          offer,
        });
      });
    });

    socket.on("webrtc_answer", ({ to, answer }) => {
      getUserSocketIds(to).forEach((sid) => {
        io.to(sid).emit("webrtc_answer", {
          from: userId,
          answer,
        });
      });
    });

    socket.on("webrtc_ice", ({ to, candidate }) => {
      getUserSocketIds(to).forEach((sid) => {
        io.to(sid).emit("webrtc_ice", {
          from: userId,
          candidate,
        });
      });
    });

    socket.on("end_call", ({ to }) => {
      getUserSocketIds(to).forEach((sid) => {
        io.to(sid).emit("end_call", {
          from: userId,
        });
      });
    });



    socket.on("disconnect", () => {
      removeUserSocket(userId, socket.id);
      console.log(`User ${userId} disconnected → ${socket.id}`);
    });
  });

  return io;
};
