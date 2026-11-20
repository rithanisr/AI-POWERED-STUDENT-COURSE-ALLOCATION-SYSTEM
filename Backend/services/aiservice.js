import Student from "../models/student.js";
import Course from "../models/course.js";
import Allocation from "../models/allocation.js";
import {
  createGeminiClient,
  GeminiServiceError,
} from "../utils/geminiClient.js";

const callGemini = async (prompt) => {
  try {
    const ai = createGeminiClient();

    return await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      contents: prompt,
    });
  } catch (error) {
    if (error instanceof GeminiServiceError) {
      throw error;
    }

    const status = Number(error?.status ?? error?.statusCode);
    const code = typeof error?.code === "string" ? error.code : "";
    const message = typeof error?.message === "string" ? error.message : "";
    const isAuthenticationFailure =
      status === 401 ||
      code === "ACCESS_TOKEN_TYPE_UNSUPPORTED" ||
      message.includes("ACCESS_TOKEN_TYPE_UNSUPPORTED");

    console.error("Gemini API request failed", {
      status: Number.isFinite(status) ? status : undefined,
      category: isAuthenticationFailure ? "authentication" : "provider",
    });

    throw new GeminiServiceError(
      isAuthenticationFailure
        ? "Gemini authentication failed. Set GEMINI_API_KEY to a valid Gemini API key; OAuth access tokens are not accepted."
        : "Gemini request failed. Please try again.",
      502,
    );
  }
};

const buildCourseSummaries = (courses, students, allocations) => {
  const applicationCounts = new Map();

  students.forEach((student) => {
    const preferences = Array.isArray(student.preferences)
      ? student.preferences
      : [];

    const seenCourseIds = new Set();

    preferences.forEach((pref) => {
      if (!pref?.courseId || seenCourseIds.has(pref.courseId)) return;

      seenCourseIds.add(pref.courseId);

      applicationCounts.set(
        pref.courseId,
        (applicationCounts.get(pref.courseId) || 0) + 1
      );
    });
  });

  const allocationCounts = new Map();

  allocations.forEach((alloc) => {
    if (
      alloc.allocationStatus !== "Allocated" ||
      !alloc.allocatedCourseId
    )
      return;

    allocationCounts.set(
      alloc.allocatedCourseId,
      (allocationCounts.get(alloc.allocatedCourseId) || 0) + 1
    );
  });

  return courses.map((course) => {
    const totalApplications = applicationCounts.get(course.courseId) || 0;
    const totalAllocated = allocationCounts.get(course.courseId) || 0;
    const totalRejected = Math.max(
      totalApplications - totalAllocated,
      0
    );

    const rejectionRate =
      totalApplications > 0
        ? (totalRejected / totalApplications) * 100
        : 0;

    return {
      courseId: course.courseId,
      courseName: course.courseName,
      totalSeats: course.totalSeats,
      totalApplications,
      totalAllocated,
      totalRejected,
      rejectionRate: Number(rejectionRate.toFixed(1)),
    };
  });
};

const buildCategoryAllocationSummary = (students, allocations) => {
  const studentMap = new Map(
    students.map((student) => [student.studentId, student])
  );

  const counts = {
    General: 0,
    OBC: 0,
    SC: 0,
    ST: 0,
  };

  allocations.forEach((alloc) => {
    if (
      alloc.allocationStatus !== "Allocated" ||
      !alloc.studentId
    )
      return;

    const student = studentMap.get(alloc.studentId);

    const category = student?.category;

    if (!category || counts[category] === undefined) return;

    counts[category]++;
  });

  return counts;
};

const buildNotFirstPreferenceStudents = (students, allocations) => {
  const studentMap = new Map(
    students.map((student) => [student.studentId, student])
  );

  return allocations
    .filter(
      (alloc) =>
        alloc.allocationStatus === "Allocated" &&
        alloc.allocatedPreference > 1
    )
    .map((alloc) => {
      const student = studentMap.get(alloc.studentId);

      return {
        studentName: alloc.studentName || student?.name || "Unknown",
        studentId: alloc.studentId,
        allocatedCourseName:
          alloc.allocatedCourseName || "Unknown",
        allocatedPreference: alloc.allocatedPreference,
      };
    });
};

const buildPrompt = ({
  question,
  courseSummaries,
  categorySummary,
  notFirstPreferenceStudents,
}) => {
  const promptParts = [
    "You are a university data assistant.",
    "Answer ONLY using the information below.",
    "Do not make up any information.",
    `Question: ${question}`,
  ];

  if (courseSummaries.length) {
    promptParts.push("Course summaries:");

    courseSummaries.forEach((course) => {
      promptParts.push(
        `Course: ${course.courseName} (ID: ${course.courseId}),
Seats: ${course.totalSeats},
Applications: ${course.totalApplications},
Allocated: ${course.totalAllocated},
Rejected: ${course.totalRejected},
Rejection Rate: ${course.rejectionRate}%`
      );
    });
  }

  promptParts.push("Category-wise Allocation:");

  promptParts.push(
    `General: ${categorySummary.General}`,
    `OBC: ${categorySummary.OBC}`,
    `SC: ${categorySummary.SC}`,
    `ST: ${categorySummary.ST}`
  );

  if (notFirstPreferenceStudents.length) {
    promptParts.push(
      "Students who did not receive first preference:"
    );

    notFirstPreferenceStudents.forEach((student) => {
      promptParts.push(
        `${student.studentName} (${student.studentId}) -> ${student.allocatedCourseName} (Preference ${student.allocatedPreference})`
      );
    });
  }

  promptParts.push(
    "If the answer cannot be determined from the above information, reply:",
    "'I can only answer based on the provided allocation data.'"
  );

  return promptParts.join("\n\n");
};

export const chatWithAI = async (question) => {
  if (!question || typeof question !== "string") {
    throw new GeminiServiceError(
      "Question must be a non-empty string.",
      400,
    );
  }

  try {
    const [students, courses, allocations] = await Promise.all([
      Student.find().lean(),
      Course.find().lean(),
      Allocation.find().lean(),
    ]);

    const courseSummaries = buildCourseSummaries(
      courses,
      students,
      allocations
    );

    const categorySummary =
      buildCategoryAllocationSummary(
        students,
        allocations
      );

    const notFirstPreferenceStudents =
      buildNotFirstPreferenceStudents(
        students,
        allocations
      );

    const prompt = buildPrompt({
      question,
      courseSummaries,
      categorySummary,
      notFirstPreferenceStudents,
    });

    const response = await callGemini(prompt);

    const answer = response.text;

    if (!answer || answer.trim() === "") {
      throw new Error("Gemini did not return an answer.");
    }

    return answer;
  } catch (error) {
    if (error instanceof GeminiServiceError) {
      throw error;
    }

    console.error("AI service failed", { category: "internal" });
    throw new GeminiServiceError(
      "AI service failed. Please try again.",
      500,
    );
  }
};

export default chatWithAI;