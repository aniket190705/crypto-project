import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";




dotenv.config();
connectDB();

const app = express();
app.use("/api/user", userRoutes);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.get("/api/ping", (req, res) => {
  res.send("✅ Backend is working!");
});

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("sendMessage", ({ room, message }) => {
    io.to(room).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
