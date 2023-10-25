import { Router } from "express";

const taskRouter = Router();

//get all tasks related to user
taskRouter.get("/all", (req: any, res: any) => {
  //todo
});

//get single task based on task id
taskRouter.get("/:taskid", (req: any, res: any) => {
  //todo
});

//create task
taskRouter.post("/create", (req: any, res: any) => {
  //todo
});

//update task based on id
taskRouter.put("/:taskid/update", (req: any, res: any) => {
  //todo:
});

//get all tasks related to user
taskRouter.delete("/:taskid/delete", (req: any, res: any) => {
  //todo
});

export default taskRouter;
