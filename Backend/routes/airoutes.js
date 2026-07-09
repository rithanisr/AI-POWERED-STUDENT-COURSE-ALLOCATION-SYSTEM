import express from "express";
import { askAI } from "../controllers/aicontroller.js";
import protectAdmin from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/chat", protectAdmin, askAI);

export default router;
