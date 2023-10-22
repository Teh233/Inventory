import { createSlice } from "@reduxjs/toolkit";
import { useLoginMutation } from "../api/usersApiSlice";
const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
      localStorage.clear()
    },
    addError: (state, action) => {
      state.error = action.payload;
    },
    removeError: (state, action) => {
      state.error = null;
    },
    removeUserInfo: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
  },
 
});

export const { setCredentials, logout, addError, removeError, removeUserInfo } =
  authSlice.actions;
export default authSlice.reducer;
