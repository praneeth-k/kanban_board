import { createSlice } from "@reduxjs/toolkit";
import { UserSlice } from "./UserSlice";
import { sortByTimestamp } from "../util/utilFunctions";
export const TaskSlice = createSlice({
  name: "Task",
  initialState: {
    taskList: [],
  },
  reducers: {
    setTaskList: (state: any, action) => {
      return {
        ...state,
        taskList: [...action.payload.taskList].sort((a, b) =>
          sortByTimestamp(a, b, true)
        ),
      };
    },
    addNewTask: (state: any, action) => {
      return {
        ...state,
        taskList: [...state.taskList, action.payload.task],
      };
    },
    updateTask: (state: any, action) => {
      let taskList = [...state.taskList];
      const taskIndex = taskList.findIndex(
        (task) => task.id == action.payload.task.id
      );
      if (taskIndex > -1) taskList[taskIndex] = action.payload.task;

      return {
        ...state,
        taskList: taskList.sort((a, b) => sortByTimestamp(a, b, true)),
      };
    },
    deleteTask: (state: any, action) => {
      return {
        ...state,
        taskList: [
          ...state.taskList.filter(
            (task: any) => task.id != action.payload.task.id
          ),
        ],
      };
    },
  },
  extraReducers(builder) {
    builder.addCase(UserSlice.actions.clearUserData, (state, action) => {
      return {
        ...state,
        taskList: [],
      };
    });
  },
});

export const { setTaskList, addNewTask, updateTask, deleteTask } =
  TaskSlice.actions;
