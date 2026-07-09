import express from "express";
import { allocateCourses } from "../controllers/allocationcontroller.js";

const router = express.Router();

router.post("/", allocateCourses);

export default router;
