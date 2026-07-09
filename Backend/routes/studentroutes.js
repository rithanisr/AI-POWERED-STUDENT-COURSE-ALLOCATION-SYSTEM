import express from "express";
import {
  createStudent,
  getStudentById,
  getStudents,
} from "../controllers/studentcontroller.js";

const router = express.Router();

router.post("/", createStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);

export default router;
