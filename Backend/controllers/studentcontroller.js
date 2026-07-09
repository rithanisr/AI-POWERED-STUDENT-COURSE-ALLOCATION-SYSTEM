import asyncHandler from "../utils/asyncHandler.js";
import Student from "../models/student.js";
import Course from "../models/course.js";
import {
  createStudentService,
  getAllStudentsService,
  getStudentByIdService,
} from "../services/studentService.js";

const resolvePreferences = async (preferences = []) => {
  if (!Array.isArray(preferences)) {
    throw new Error("Preferences must be an array");
  }

  const resolved = [];

  for (const item of preferences) {
    if (!item || (typeof item === "string" && item.trim() === "")) {
      continue;
    }

    const course = await Course.findOne({
      $or: [
        { courseId: item },
        { courseName: { $regex: new RegExp(`^${item}$`, "i") } },
      ],
    });

    if (!course) {
      throw new Error(`Course not found for preference: ${item}`);
    }

    resolved.push({
      courseId: course.courseId,
      courseName: course.courseName,
    });
  }

  return resolved;
};

export const createStudent = asyncHandler(async (req, res) => {
  const { name, email, marks, category, preferences } = req.body;

  if (!name || !email || !marks || !category) {
    res.status(400);
    throw new Error("Name, email, marks, and category are required");
  }

  // Server-side check for duplicate email
  const existingStudent = await Student.findOne({ email: email.toLowerCase() });
  if (existingStudent) {
    return res.status(409).json({
      success: false,
      message: "This email has already been registered.",
    });
  }

  if (marks < 0 || marks > 100) {
    res.status(400);
    throw new Error("Marks must be between 0 and 100");
  }

  const lastStudent = await Student.findOne().sort({ studentId: -1 });
  const nextStudentId = lastStudent ? Number(lastStudent.studentId) + 1 : 101;
  const resolvedPreferences = await resolvePreferences(preferences);

  const studentData = {
    studentId: String(nextStudentId),
    name,
    email: email.toLowerCase(),
    marks,
    category,
    applicationDate: new Date(),
    preferences: resolvedPreferences,
  };

  const student = await createStudentService(studentData);

  res.status(201).json({
    success: true,
    message: "Student application submitted successfully",
    data: student,
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required for verification.");
  }

  const student = await Student.findOne({ email: email.toLowerCase() });

  if (student) {
    return res.status(409).json({
      success: false,
      verified: false,
      message: "This email has already been registered.",
    });
  }

  res
    .status(200)
    .json({ success: true, verified: true, message: "Email is available." });
});

export const getStudents = asyncHandler(async (req, res) => {
  const students = await getAllStudentsService();

  res.status(200).json({
    success: true,
    count: students.length,
    data: students,
  });
});

export const getStudentById = asyncHandler(async (req, res) => {
  const student = await getStudentByIdService(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  res.status(200).json({
    success: true,
    data: student,
  });
});
