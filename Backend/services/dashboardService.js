import Student from "../models/student.js";
import Course from "../models/course.js";
import Allocation from "../models/allocation.js";

// Returns total number of registered students
export const getTotalStudents = async () => {
  try {
    const total = await Student.countDocuments();
    return { totalStudents: total };
  } catch (error) {
    throw new Error(`getTotalStudents failed: ${error.message}`);
  }
};

// Returns number of allocated students (allocationStatus === 'Allocated')
export const getTotalAllocatedStudents = async () => {
  try {
    const count = await Allocation.countDocuments({
      allocationStatus: "Allocated",
    });
    return { allocatedStudents: count };
  } catch (error) {
    throw new Error(`getTotalAllocatedStudents failed: ${error.message}`);
  }
};

// Returns number of not allocated students (allocationStatus === 'Not Allocated')
export const getTotalNotAllocatedStudents = async () => {
  try {
    const count = await Allocation.countDocuments({
      allocationStatus: "Not Allocated",
    });
    return { notAllocatedStudents: count };
  } catch (error) {
    throw new Error(`getTotalNotAllocatedStudents failed: ${error.message}`);
  }
};

// Helper: build a map of allocations for quick lookups
const buildAllocationsAndStudentsMap = async () => {
  const allocations = await Allocation.find({
    allocationStatus: "Allocated",
  }).lean();
  const studentIds = allocations.map((a) => a.studentId).filter(Boolean);
  const students = await Student.find({
    studentId: { $in: studentIds },
  }).lean();
  const studentMap = new Map();
  students.forEach((s) => studentMap.set(s.studentId, s));
  return { allocations, studentMap };
};

// Returns available seats per course by category and total remaining
export const getAvailableSeats = async () => {
  try {
    const courses = await Course.find().lean();

    const { allocations, studentMap } = await buildAllocationsAndStudentsMap();

    // Build allocation counts per courseId per category
    const allocCounts = {}; // { courseId: { General: n, OBC: n, ... } }

    for (const alloc of allocations) {
      if (!alloc.allocatedCourseId) continue;
      const courseId = alloc.allocatedCourseId;
      const student = studentMap.get(alloc.studentId);
      const category = student?.category || "General"; // default category if missing

      allocCounts[courseId] = allocCounts[courseId] || {
        General: 0,
        OBC: 0,
        SC: 0,
        ST: 0,
      };
      if (allocCounts[courseId][category] === undefined)
        allocCounts[courseId][category] = 0;
      allocCounts[courseId][category] += 1;
    }

    const result = courses.map((course) => {
      const reserved = course.reservedSeats || {
        General: 0,
        OBC: 0,
        SC: 0,
        ST: 0,
      };
      const counts = allocCounts[course.courseId] || {
        General: 0,
        OBC: 0,
        SC: 0,
        ST: 0,
      };

      const remainingGeneral = Math.max(
        (reserved.General || 0) - (counts.General || 0),
        0,
      );
      const remainingOBC = Math.max((reserved.OBC || 0) - (counts.OBC || 0), 0);
      const remainingSC = Math.max((reserved.SC || 0) - (counts.SC || 0), 0);
      const remainingST = Math.max((reserved.ST || 0) - (counts.ST || 0), 0);

      const totalRemaining =
        remainingGeneral + remainingOBC + remainingSC + remainingST;

      return {
        courseId: course.courseId,
        courseName: course.courseName,
        totalSeats: course.totalSeats,
        remainingGeneralSeats: remainingGeneral,
        remainingOBCSeats: remainingOBC,
        remainingSCSeats: remainingSC,
        remainingSTSeats: remainingST,
        totalRemainingSeats: totalRemaining,
      };
    });

    return { courses: result };
  } catch (error) {
    throw new Error(`getAvailableSeats failed: ${error.message}`);
  }
};

// Returns course statistics: total applications (students who selected the course in any preference), allocated, rejected
export const getCourseStatistics = async () => {
  try {
    const courses = await Course.find().lean();
    const students = await Student.find().lean();
    const allocations = await Allocation.find({
      allocationStatus: { $in: ["Allocated", "Not Allocated"] },
    }).lean();

    // Applications map: courseId -> number of students who included it in preferences
    const appMap = {}; // { courseId: count }
    for (const student of students) {
      const prefs = Array.isArray(student.preferences)
        ? student.preferences
        : [];
      // Use a set to avoid duplicate preferences in same student
      const seen = new Set();
      for (const p of prefs) {
        if (!p || !p.courseId) continue;
        if (seen.has(p.courseId)) continue;
        seen.add(p.courseId);
        appMap[p.courseId] = (appMap[p.courseId] || 0) + 1;
      }
    }

    // Allocated map: courseId -> allocated count
    const allocMap = {};
    for (const alloc of allocations) {
      if (!alloc.allocatedCourseId) continue;
      allocMap[alloc.allocatedCourseId] =
        (allocMap[alloc.allocatedCourseId] || 0) +
        (alloc.allocationStatus === "Allocated" ? 1 : 0);
    }

    const result = courses.map((course) => {
      const totalApplications = appMap[course.courseId] || 0;
      const totalAllocated = allocMap[course.courseId] || 0;
      const totalRejected = Math.max(totalApplications - totalAllocated, 0);

      return {
        courseId: course.courseId,
        courseName: course.courseName,
        totalSeats: course.totalSeats,
        totalApplications,
        totalAllocatedStudents: totalAllocated,
        totalRejectedStudents: totalRejected,
      };
    });

    return { courses: result };
  } catch (error) {
    throw new Error(`getCourseStatistics failed: ${error.message}`);
  }
};

// Returns allocation counts grouped by category
export const getCategoryWiseAllocation = async () => {
  try {
    const allocations = await Allocation.find({
      allocationStatus: "Allocated",
    }).lean();
    const studentIds = allocations.map((a) => a.studentId).filter(Boolean);
    const students = await Student.find({
      studentId: { $in: studentIds },
    }).lean();
    const studentMap = new Map(students.map((s) => [s.studentId, s]));

    const counts = { General: 0, OBC: 0, SC: 0, ST: 0 };
    for (const alloc of allocations) {
      const student = studentMap.get(alloc.studentId);
      const category = student?.category || "General";
      if (counts[category] === undefined) counts[category] = 0;
      counts[category] += 1;
    }

    return { categoryWiseAllocation: counts };
  } catch (error) {
    throw new Error(`getCategoryWiseAllocation failed: ${error.message}`);
  }
};

export default {
  getTotalStudents,
  getTotalAllocatedStudents,
  getTotalNotAllocatedStudents,
  getAvailableSeats,
  getCourseStatistics,
  getCategoryWiseAllocation,
};
