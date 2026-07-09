import asyncHandler from "../utils/asyncHandler.js";
import {
  createCourseService,
  getAllCoursesService,
  getCourseByIdService,
  updateCourseService,
  deleteCourseService,
} from "../services/courseService.js";

export const createCourse = asyncHandler(async (req, res) => {
  const { courseName, totalSeats, reservedSeats } = req.body;

  if (!courseName || !totalSeats) {
    res.status(400);
    throw new Error("Course name and total seats are required");
  }

  if (totalSeats <= 0) {
    res.status(400);
    throw new Error("Total seats must be greater than 0");
  }

  const course = await createCourseService({
    courseName,
    totalSeats,
    reservedSeats: reservedSeats || {
      General: 0,
      OBC: 0,
      SC: 0,
      ST: 0,
    },
  });

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: course,
  });
});

export const getCourses = asyncHandler(async (req, res) => {
  const courses = await getAllCoursesService();

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

export const getCourseById = asyncHandler(async (req, res) => {
  const course = await getCourseByIdService(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await updateCourseService(req.params.id, req.body);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  res.status(200).json({
    success: true,
    message: "Course updated successfully",
    data: course,
  });
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await deleteCourseService(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  res.status(200).json({
    success: true,
    message: "Course deleted successfully",
  });
});
