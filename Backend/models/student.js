import mongoose from "mongoose";

const preferenceSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
      trim: true,
    },
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    marks: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    category: {
      type: String,
      enum: ["General", "OBC", "SC", "ST"],
      required: true,
    },

    applicationDate: {
      type: Date,
      required: true,
    },

    preferences: [preferenceSchema],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Student", studentSchema);
