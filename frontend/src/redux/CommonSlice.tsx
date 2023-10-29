import { createSlice } from "@reduxjs/toolkit";
import Constants from "../util/constants";

export const CommonSlice = createSlice({
  name: "Common",
  initialState: {
    alertProps: Constants.initialAlertProps,
    toastMessage: "",
  },
  reducers: {
    setAlertProps: (state, action) => {
      return {
        ...state,
        alertProps: { ...action.payload },
      };
    },
    closeAlert: (state, action) => {
      return {
        ...state,
        alertProps: Constants.initialAlertProps,
      };
    },
    showToastMessage: (state, action) => {
      return { ...state, toastMessage: action.payload.message };
    },
    clearToastMessage: (state, action) => {
      return { ...state, toastMessage: "" };
    },
  },
});

export const {
  showToastMessage,
  setAlertProps,
  closeAlert,
  clearToastMessage,
} = CommonSlice.actions;
