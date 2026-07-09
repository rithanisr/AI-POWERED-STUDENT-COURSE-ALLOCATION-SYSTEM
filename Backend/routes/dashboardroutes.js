import express from "express";
import {
  totalStudents,
  allocatedStudents,
  notAllocatedStudents,
  availableSeats,
  courseStatistics,
  categoryAllocation,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/total-students", totalStudents);
router.get("/allocated-students", allocatedStudents);
router.get("/not-allocated-students", notAllocatedStudents);
router.get("/available-seats", availableSeats);
router.get("/course-statistics", courseStatistics);
router.get("/category-allocation", categoryAllocation);

export default router;
