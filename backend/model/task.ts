import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: [3, "Need atleast 3 charecters in task title"],
      max: [15, "Task title cannot have more than 15 characters"],
    },
    desc: {
      type: String,
      max: [15, "Task title cannot have more than 50 characters"],
    },
    Status: {
      type: String,
      enum: ["New", "InProgress", "Completed"],
      default: "New",
    },
    User: { type: mongoose.Schema.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
