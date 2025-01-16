import mongoose from "mongoose";

const { Schema, model } = mongoose;

const chapterProgressSchema = new Schema({
  chapterId: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
});

const sectionProgressSchema = new Schema({
  sectionId: {
    type: String,
    required: true,
  },
  chapters: [chapterProgressSchema],
});

const userCourseProgressSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true, // Mongoose equivalent of hashKey for indexing
    },
    courseId: {
      type: String,
      required: true,
      unique: true, // Ensures uniqueness like rangeKey
    },
    enrollmentDate: {
      type: Date,
      required: true,
      default: Date.now, // Defaults to the current date and time
    },
    overallProgress: {
      type: Number,
      required: true,
    },
    sections: [sectionProgressSchema],
    lastAccessedTimestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

const UserCourseProgress = model("UserCourseProgress", userCourseProgressSchema);
export default UserCourseProgress;
