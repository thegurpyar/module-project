import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image:{
    type: String,
    default: ""
  },
  message: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    default: ""
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("notifications", notificationSchema);

export default Notification;