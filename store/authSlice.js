// features/counter/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "userInfo",
  initialState: {
    userId: null,
  },
  reducers: {
    setUserId: (state, action) => {
      const { userId } = action.payload;
      state.userId = userId;
    },
  },
});

export const { setUserId } = authSlice.actions;

export default authSlice.reducer;
