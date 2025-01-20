// features/counter/tripSlice.js
import { createSlice } from "@reduxjs/toolkit";

const tripClice = createSlice({
  name: "tripDetails",
  initialState: {
    trip: {},
  },
  reducers: {
    setTrip: (state, action) => {
      const { trip } = action.payload;
      state.trip = trip;
    },
  },
});

export const { setTrip } = tripClice.actions;

export default tripClice.reducer;
