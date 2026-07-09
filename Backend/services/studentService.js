import Student from "../models/student.js";

export const createStudentService = async (studentData) => {
  const student = await Student.create(studentData);
  return student;
};

export const getAllStudentsService = async () => {
  return await Student.find().populate("preferences").sort({ createdAt: -1 });
};

export const getStudentByIdService = async (id) => {
  return await Student.findById(id).populate("preferences");
};
