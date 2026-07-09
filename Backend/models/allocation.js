import mongoose from "mongoose";

const allocationSchema = new mongoose.Schema(
  {
    // store student identifier and name (avoid raw MongoDB ObjectId in allocation records)
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    // store allocated course identifier and name
    allocatedCourseId: {
      type: String,
      default: null,
      trim: true,
    },

    allocatedCourseName: {
      type: String,
      default: null,
      trim: true,
    },

    allocatedPreference: {
      type: Number,
      enum: [1, 2, 3],
      default: null,
    },

    allocationStatus: {
      type: String,
      enum: ["Allocated", "Not Allocated"],
      default: "Not Allocated",
    },

    allocationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Allocation", allocationSchema);
