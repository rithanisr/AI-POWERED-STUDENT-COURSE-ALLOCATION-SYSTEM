import Student from "../models/student.js";
import Course from "../models/course.js";
import Allocation from "../models/allocation.js";

const CATEGORY_KEYS = ["General", "OBC", "SC", "ST"];

const getSeatCountForCategory = (course, category) => {
  return course.reservedSeats?.[category] ?? 0;
};

const allocateStudentToPreferredCourse = async (
  student,
  coursesById,
  courseMap,
) => {
  const preferences = Array.isArray(student.preferences)
    ? student.preferences
    : [];

  for (let index = 0; index < preferences.length; index += 1) {
    const preference = preferences[index];
    const course = courseMap.get(preference.courseId);

    if (!course) continue;

    const category = student.category;
    const remainingSeats = getSeatCountForCategory(course, category);

    if (remainingSeats > 0) {
      // decrement seat immediately and persist
      course.reservedSeats[category] = remainingSeats - 1;
      // also decrement overall total seats to reflect allocation
      course.totalSeats = Math.max((course.totalSeats || 0) - 1, 0);
      await course.save();

      return {
        allocatedCourseId: course.courseId,
        allocatedCourseName: course.courseName,
        allocatedPreference: index + 1,
        allocationStatus: "Allocated",
      };
    }
  }

  return {
    allocatedCourseId: null,
    allocatedCourseName: null,
    allocatedPreference: null,
    allocationStatus: "Not Allocated",
  };
};

export const allocateStudents = async () => {
  try {
    // Ensure legacy unique index on 'student' field (if present) does not block upserts
    // Some earlier deployments created a unique index on `student` which allowed a
    // single document with `student: null`. That causes E11000 when inserting new
    // documents that omit that field. If the index exists, drop it safely.
    try {
      const existingIndexes = await Allocation.collection.indexes();
      const hasStudentIndex = existingIndexes.some(
        (idx) => idx.name === "student_1",
      );
      if (hasStudentIndex) {
        await Allocation.collection.dropIndex("student_1");
      }
    } catch (ixErr) {
      // non-fatal: log and continue
      console.warn("Could not drop legacy student index:", ixErr.message);
    }

    const students = await Student.find().sort({
      marks: -1,
      applicationDate: 1,
    });
    const courses = await Course.find();

    const courseMap = new Map();
    courses.forEach((course) => {
      courseMap.set(course.courseId, course);
    });

    const allocations = [];

    for (const student of students) {
      const result = await allocateStudentToPreferredCourse(
        student,
        courses,
        courseMap,
      );

      const allocationData = {
        studentId: student.studentId,
        studentName: student.name,
        allocatedCourseId: result.allocatedCourseId,
        allocatedCourseName: result.allocatedCourseName,
        allocatedPreference: result.allocatedPreference,
        allocationStatus: result.allocationStatus,
        allocationDate: new Date(),
      };

      // Use findOneAndReplace with an ordered replacement document so field
      // order in MongoDB matches the desired schema order (studentId, studentName, ...).
      await Allocation.findOneAndReplace(
        { studentId: student.studentId },
        allocationData,
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
      );

      allocations.push(allocationData);
    }

    const allocatedStudents = allocations.filter(
      (item) => item.allocationStatus === "Allocated",
    ).length;
    const notAllocatedStudents = allocations.filter(
      (item) => item.allocationStatus === "Not Allocated",
    ).length;

    return {
      totalStudents: students.length,
      allocatedStudents,
      notAllocatedStudents,
      allocations,
    };
  } catch (error) {
    throw new Error(`Allocation failed: ${error.message}`);
  }
};

export default allocateStudents;
