import express from "express";
import cors from "cors";
import routes from "./routes";
import connectDB from "./config/db";
import dotenv from "dotenv";
import path from "path";
dotenv.config();
import { globalErrorHandler } from "./middlewares/errorHandler";
import { createServer } from "http";
import { initializeSocket } from "./modules/chat/chat";

connectDB();
const app = express();
const httpServer = createServer(app);
const io = initializeSocket(httpServer);

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : ["http://localhost:3000","http://localhost:3001", "http://127.0.0.1:3000","http://127.0.0.1:3001"], // ✅ Add both
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
    ],
    credentials: true,
  })
);

// Body parser
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.send("API is running...");
});

// Use centralized routes
app.use("/api", routes);
/* --------- Global error handler (should be last middleware) --- */
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// //web socket server
// const SOCKET_PORT = process.env.SOCKET_PORT || 5000;
// httpServer.listen(SOCKET_PORT, () => console.log(`Socket server running on port ${SOCKET_PORT}`));
