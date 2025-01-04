import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isOpen: false,
  },
  reducers: {
    setModal(state, action) {
      state.isOpen = action.payload;
    },
  },
});

export const {
  actions: { setModal },
  reducer: modalReducer,
} = modalSlice;
