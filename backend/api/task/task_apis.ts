import { StatusCodes } from "http-status-codes";
import { ReturnType } from "../../constants";
import Task from "../../model/task";
import mongoose from "mongoose";

const getAllTasks = async (req: any, res: any) => {
  try {
    let queryStatus = ReturnType.SUCCESS;
    if (req.body.userid) {
      const allTasks = await Task.find({ userId: req.body.userid }).catch(
        (error) => {
          console.log(error);
          queryStatus = ReturnType.FAIL;
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send("Internal Server Error");
        }
      );
      if ((queryStatus as ReturnType) == ReturnType.SUCCESS) {
        res.status(StatusCodes.OK).send({ tasks: allTasks });
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).send({ msg: "Bad request" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "Internal Server Error" });
  }
};

const createTask = async (req: any, res: any) => {
  try {
    const { title, desc, status, userid } = req.body;
    let errorOccured = false;
    if (title && userid) {
      await Task.create({
        title: title,
        desc: desc,
        status: status,
        userId: userid,
      }).catch((error) => {
        errorOccured = true;
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(StatusCodes.BAD_REQUEST).send({ msg: error.message });
        } else {
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send("Internal Server Error");
        }
      });
      if (!errorOccured) {
        res.status(StatusCodes.OK).send({ msg: "Task Created Successfully" });
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).send({ msg: "Bad Request" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "Internal Server Error" });
  }
};

const getTaskDetails = async (req: any, res: any) => {
  try {
    let queryStatus = ReturnType.SUCCESS;
    if (req.body.taskid) {
      const task = await Task.findOne({ _id: req.body.taskid }).catch(
        (error) => {
          queryStatus = ReturnType.FAIL;
          console.log(error);
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send("Internal Server Error");
        }
      );
      if ((queryStatus as ReturnType) == ReturnType.SUCCESS) {
        if (task) {
          res.status(StatusCodes.OK).send({ task: task });
        } else {
          res.status(StatusCodes.NOT_FOUND).send({ msg: "Task not found!!" });
        }
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).send({ msg: "Bad request" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "Internal Server Error" });
  }
};

const updateTask = async (req: any, res: any) => {
  try {
    let errorOccured = false;
    if (req.body.task) {
      const task: any = await Task.findOne({ _id: req.body.task._id }).catch(
        (error) => {
          errorOccured = true;
          console.log(error);
          if (error instanceof mongoose.Error.ValidationError) {
            res.send(StatusCodes.BAD_REQUEST).send({ msg: error.message });
          } else {
            res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .send("Internal Server Error");
          }
        }
      );
      if (!errorOccured) {
        if (task) {
          Object.keys(req.body.task).forEach((key: string) => {
            if (!key.startsWith("_")) {
              task[key] = req.body.task[key];
            }
          });
          task.save().catch((error: any) => {
            errorOccured = true;
            console.log(error);
            res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .send("Internal Server Error");
          });
          if (!errorOccured) {
            res
              .status(StatusCodes.OK)
              .send({ msg: "Task Updated Successfully!!" });
          }
        } else {
          res.status(StatusCodes.NOT_FOUND).send({ msg: "Task not found!!" });
        }
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).send({ msg: "Bad request" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "Internal Server Error" });
  }
};

const deleteTask = async (req: any, res: any) => {
  try {
    let errorOccured = ReturnType.SUCCESS;
    if (req.body.taskid) {
      await Task.deleteOne({ _id: req.body.taskid }).catch((error) => {
        errorOccured = ReturnType.FAIL;
        console.log(error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send("Internal Server Error");
      });
      if ((errorOccured as ReturnType) == ReturnType.SUCCESS) {
        res.status(StatusCodes.OK).send({ msg: "Task Deleted Successfully" });
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).send({ msg: "Bad request" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "Internal Server Error" });
  }
};

export { getAllTasks, createTask, getTaskDetails, updateTask, deleteTask };
