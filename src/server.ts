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
import { seedAdminUsers } from "./modules/seed/seed";

connectDB().then(() => {
  seedAdminUsers(); // 🔥 auto create admin + agent
});

const app = express();
const httpServer = createServer(app);
const io = initializeSocket(httpServer);

// app.use(
//   cors({
//     origin:
//       process.env.NODE_ENV === "production"
//         ? process.env.FRONTEND_URL
//         : ["http://localhost:3000","http://localhost:3001", "http://127.0.0.1:3000","http://127.0.0.1:3001", "https://inspiring-medovik-b801f4.netlify.app"], // ✅ Add both
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
//     allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "ngrok-skip-browser-warning",
//     ],
//     credentials: true,
//   })
// );

app.use(cors({
  origin: "*",
}));
// Body parser
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (req, res) => {
  res.send("API is running...");
});

import swaggerRoutes from "./modules/swagger.route";

// Use Swagger documentation route
app.use(swaggerRoutes);
app.use("/api", routes);
/* --------- Global error handler (should be last middleware) --- */
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

