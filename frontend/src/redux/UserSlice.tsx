import { createSlice, createAction } from "@reduxjs/toolkit";

// const clearData = createAction("clearData");
export const UserSlice = createSlice({
  name: "User",
  initialState: {
    name: "",
    token: "",
  },
  reducers: {
    setActiveUser: (state, action) => {
      let _name = "",
        _token = "";
      if (action.payload.name && action.payload.token) {
        _name = action.payload.name;
        _token = action.payload.token;
      }
      return {
        ...state,
        name: _name,
        token: _token,
      };
    },
    clearUserData: (state, action) => {
      return {
        ...state,
        name: "",
        token: "",
      };
    },
  },
  extraReducers(builder) {
    // builder.addCase(clearData, (state, action) => {
    //   return {
    //     ...state,
    //     name: "",
    //     password: ""
    //   };
    // });
  },
});

export const { setActiveUser, clearUserData } = UserSlice.actions;
