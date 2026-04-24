// config/db.js
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    console.log("Connecting to MongoDB with URI:", process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10, // better performance
      serverSelectionTimeoutMS: 5000, // timeout after 5s
    });

    // console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error: any) {
    console.error("MongoDB connection error:", error.message);

    // Instead of process.exit(1), just throw so caller can handle it
    throw new Error("Failed to connect to MongoDB. Please check your MONGO_URI.");
  }
};

export default connectDB;