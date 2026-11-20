import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "node:dns/promises";

import connectDB from "./Db/db.js";
import studentRoutes from "./routes/studentroutes.js";
import courseRoutes from "./routes/courseroutes.js";
import allocationRoutes from "./routes/allocationroutes.js";
import dashboardRoutes from "./routes/dashboardroutes.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/airoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/allocation", allocationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/students/verify-email", studentRoutes);

const PORT = process.env.PORT || 5000;

// Check MongoDB DNS
async function checkMongoDNS() {
  try {
    const records = await dns.resolveSrv(
      "_mongodb._tcp.cluster0.9a8vmr5.mongodb.net",
    );

    console.log("MongoDB DNS SUCCESS:", records);
  } catch (error) {
    console.error("MongoDB DNS FAILED:", error);
  }
}

const startServer = async () => {
  try {
    await checkMongoDNS();

    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
