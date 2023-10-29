import { StatusCodes } from "http-status-codes";
import { ReturnType } from "../../constants";
import Task from "../../model/task";
import mongoose from "mongoose";
import { ObjectFilter } from "../../util";
import * as jwt from "jsonwebtoken";
import "dotenv/config";

const getAllTasks = async (req: any, res: any) => {
  try {
    let queryStatus = ReturnType.SUCCESS;
    if (req.body.token && process.env.SECRET_KEY) {
      const verifiedUser: any = jwt.verify(
        req.body.token,
        process.env.SECRET_KEY
      );
      const allTasks: any = await Task.find({ userId: verifiedUser.id }).catch(
        (error) => {
          console.log(error);
          queryStatus = ReturnType.FAIL;
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send("Internal Server Error");
        }
      );
      let i = 0;
      for (i = 0; i < allTasks?.length; i++) {
        allTasks[i].id = allTasks[i]._id;
        allTasks[i] = ObjectFilter(
          allTasks[i].toJSON(),
          (key: string) =>
            key != "userId" && (key == "_id" || !key.startsWith("_")) //task id is required
        );
      }
      if ((queryStatus as ReturnType) == ReturnType.SUCCESS) {
        res.status(StatusCodes.OK).send({ taskList: allTasks });
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).send({ msg: "Bad request" });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.TokenExpiredError) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ msg: "Session Expired!! Please login again" });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ msg: "Internal Server Error" });
    }
  }
};

const createTask = async (req: any, res: any) => {
  try {
    const { title, desc: descreption, status, token } = req.body;
    let errorOccured = false;
    if (title && token && process.env.SECRET_KEY) {
      const verifiedUser: any = jwt.verify(
        req.body.token,
        process.env.SECRET_KEY
      );
      await Task.create({
        title: title,
        desc: descreption,
        status: status,
        userId: verifiedUser.id,
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
    if (error instanceof jwt.TokenExpiredError) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ msg: "Session expired!! Please login again" });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "Internal Server Error" });
  }
};

const getTaskDetails = async (req: any, res: any) => {
  try {
    let queryStatus = ReturnType.SUCCESS;
    if (req.body.taskid && req.body.token && process.env.SECRET_KEY) {
      const verifiedUser: any = jwt.verify(
        req.body.token,
        process.env.SECRET_KEY
      );
      let task: any = await Task.findOne({ _id: req.body.taskid }).catch(
        (error) => {
          queryStatus = ReturnType.FAIL;
          console.log(error);
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send("Internal Server Error");
        }
      );
      if ((queryStatus as ReturnType) == ReturnType.SUCCESS) {
        if (task && task._id) {
          if (task.userId == verifiedUser.id) {
            task.id = task._id.toString();
            task = ObjectFilter(
              task.toJSON(),
              (key: string) =>
                key != "userId" && (key == "_id" || !key.startsWith("_")) //task id is required
            );
            res.status(StatusCodes.OK).send({ task: task });
          } else {
            res
              .status(StatusCodes.UNAUTHORIZED)
              .send({ msg: "you are not authorized to view this task" });
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
    if (error instanceof jwt.TokenExpiredError) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ msg: "Session expired!! Please login again" });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "Internal Server Error" });
  }
};

const updateTask = async (req: any, res: any) => {
  try {
    let errorOccured = false;
    if (req.body.task && req.body.token && process.env.SECRET_KEY) {
      const verifiedUser: any = jwt.verify(
        req.body.token,
        process.env.SECRET_KEY
      );
      const task: any = await Task.findOne({ _id: req.body.task._id }).catch(
        (error) => {
          errorOccured = true;
          console.log(error);
          if (error instanceof mongoose.Error.ValidationError) {
            res.status(StatusCodes.BAD_REQUEST).send({ msg: error.message });
          } else {
            res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .send("Internal Server Error");
          }
        }
      );
      if (!errorOccured) {
        if (task) {
          if (task.userId == verifiedUser.id) {
            Object.keys(req.body.task).forEach((key: string) => {
              if (!key.startsWith("_")) {
                task[key] = req.body.task[key];
              }
            });
            await task.save().catch((error: any) => {
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
        } else {
          res
            .status(StatusCodes.UNAUTHORIZED)
            .send({ msg: "You are unauthorized to update this task" });
        }
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).send({ msg: "Bad request" });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.TokenExpiredError) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ msg: "Session expired!! please login again" });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ msg: "Internal Server Error" });
    }
  }
};

const deleteTask = async (req: any, res: any) => {
  try {
    let errorOccured = ReturnType.SUCCESS;
    if (req.body.taskid && req.body.token && process.env.SECRET_KEY) {
      const verifiedUser: any = jwt.verify(
        req.body.token,
        process.env.SECRET_KEY
      );
      const taskDeleted: any = await Task.deleteOne({
        _id: req.body.taskid,
        userId: verifiedUser.id,
      }).catch((error) => {
        errorOccured = ReturnType.FAIL;
        console.log(error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send("Internal Server Error");
      });
      if ((errorOccured as ReturnType) == ReturnType.SUCCESS) {
        if (taskDeleted.deletedCount > 0) {
          res.status(StatusCodes.OK).send({ msg: "Task Deleted Successfully" });
        } else {
          res.status(StatusCodes.NOT_FOUND).send({ msg: "Task not found" });
        }
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).send({ msg: "Bad request" });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.TokenExpiredError) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ msg: "Session expired!! please login again" });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ msg: "Internal Server Error" });
    }
  }
};

export { getAllTasks, createTask, getTaskDetails, updateTask, deleteTask };
