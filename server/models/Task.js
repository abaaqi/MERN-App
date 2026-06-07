const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    authorName: String,
  },
  { timestamps: true },
);

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "review", "done"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    category: {
      type: String,
      enum: ["work", "personal", "shopping", "health", "finance", "other"],
      default: "other",
    },
    dueDate: {
      type: Date,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [CommentSchema],
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: Date,
  },
  { timestamps: true },
);

// Auto-set completedAt when task is marked done
TaskSchema.pre("save", function (next) {
  if (this.status === "done" && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }
  if (this.status !== "done") {
    this.isCompleted = false;
    this.completedAt = undefined;
  }
  next();
});

// Index for faster queries
TaskSchema.index({ createdBy: 1, status: 1 });
TaskSchema.index({ dueDate: 1 });

module.exports = mongoose.model("Task", TaskSchema);
