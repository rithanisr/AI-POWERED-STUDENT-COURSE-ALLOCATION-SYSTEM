import Course from "../models/course.js";

const generateCourseId = async () => {
  const lastCourse = await Course.findOne().sort({ createdAt: -1 });
  const nextNumber = lastCourse
    ? Number(lastCourse.courseId?.replace(/\D/g, "")) + 1
    : 1;
  return `C${String(nextNumber).padStart(3, "0")}`;
};

export const createCourseService = async (courseData) => {
  const courseId = courseData.courseId || (await generateCourseId());
  const course = await Course.create({ ...courseData, courseId });
  return course;
};

export const getAllCoursesService = async () => {
  return await Course.find().sort({ createdAt: -1 });
};

export const getCourseByIdService = async (id) => {
  return await Course.findById(id);
};

export const updateCourseService = async (id, courseData) => {
  const course = await Course.findByIdAndUpdate(id, courseData, {
    new: true,
    runValidators: true,
  });

  return course;
};

export const deleteCourseService = async (id) => {
  const course = await Course.findByIdAndDelete(id);
  return course;
};
