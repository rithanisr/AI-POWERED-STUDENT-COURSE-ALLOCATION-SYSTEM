import { allocateStudents } from "../services/allocationservice.js";

export const allocateCourses = async (req, res, next) => {
  try {
    const result = await allocateStudents();

    return res.status(200).json({
      success: true,
      message: "Allocation completed successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export default allocateCourses;
