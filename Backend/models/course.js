import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    courseName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },

    reservedSeats: {
      General: {
        type: Number,
        default: 0,
      },

      OBC: {
        type: Number,
        default: 0,
      },

      SC: {
        type: Number,
        default: 0,
      },

      ST: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Course", courseSchema);
