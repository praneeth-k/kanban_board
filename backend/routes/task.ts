import { Router } from "express";
import {
  getAllTasks,
  createTask,
  getTaskDetails,
  updateTask,
  deleteTask,
} from "../api/task/task_apis";

const taskRouter = Router();

//get all tasks related to user
taskRouter.get("/all", (req: any, res: any) => {
  getAllTasks(req, res);
});

//get single task based on task id
taskRouter.get("/details", (req: any, res: any) => {
  getTaskDetails(req, res);
});

//create task
taskRouter.post("/create", (req: any, res: any) => {
  createTask(req, res);
});

//update task based on id
taskRouter.put("/update", (req: any, res: any) => {
  updateTask(req, res);
});

//get all tasks related to user
taskRouter.delete("/delete", (req: any, res: any) => {
  deleteTask(req, res);
});

export default taskRouter;
