import { configureStore } from "@reduxjs/toolkit";
import { modalReducer } from "./slices/modal";

export const store = configureStore({
  reducer: {
    modal: modalReducer,
  },
});
