import { configureStore } from "@reduxjs/toolkit";
import { UserSlice } from "./UserSlice";
import { TaskSlice } from "./TaskSlice";
import { CommonSlice } from "./CommonSlice";

const Store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    task: TaskSlice.reducer,
    common: CommonSlice.reducer,
  },
});

export default Store;
