import express from "express";
import {
  createStudent,
  getStudentById,
  getStudents,
  verifyEmail,
} from "../controllers/studentcontroller.js";

const router = express.Router();

router.post("/", createStudent);
router.post("/verify-email", verifyEmail);
router.get("/", getStudents);
router.get("/:id", getStudentById);

export default router;
