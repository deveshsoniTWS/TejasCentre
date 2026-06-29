import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: localStorage.getItem('accessToken') || null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
    },

    logout: (state) => {
      localStorage.removeItem('accessToken');
      state.accessToken = null;
    },
  },
});

export const {
  setCredentials,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
