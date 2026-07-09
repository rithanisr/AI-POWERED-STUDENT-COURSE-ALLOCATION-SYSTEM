import {
  getTotalStudents,
  getTotalAllocatedStudents,
  getTotalNotAllocatedStudents,
  getAvailableSeats,
  getCourseStatistics,
  getCategoryWiseAllocation,
} from "../services/dashboardService.js";

export const totalStudents = async (req, res, next) => {
  try {
    const data = await getTotalStudents();
    return res.status(200).json({
      success: true,
      message: "Total students retrieved successfully",
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

export const allocatedStudents = async (req, res, next) => {
  try {
    const data = await getTotalAllocatedStudents();
    return res.status(200).json({
      success: true,
      message: "Allocated students retrieved successfully",
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

export const notAllocatedStudents = async (req, res, next) => {
  try {
    const data = await getTotalNotAllocatedStudents();
    return res.status(200).json({
      success: true,
      message: "Not allocated students retrieved successfully",
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

export const availableSeats = async (req, res, next) => {
  try {
    const data = await getAvailableSeats();
    return res.status(200).json({
      success: true,
      message: "Available seats retrieved successfully",
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

export const courseStatistics = async (req, res, next) => {
  try {
    const data = await getCourseStatistics();
    return res.status(200).json({
      success: true,
      message: "Course statistics retrieved successfully",
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

export const categoryAllocation = async (req, res, next) => {
  try {
    const data = await getCategoryWiseAllocation();
    return res.status(200).json({
      success: true,
      message: "Category wise allocation retrieved successfully",
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  totalStudents,
  allocatedStudents,
  notAllocatedStudents,
  availableSeats,
  courseStatistics,
  categoryAllocation,
};
