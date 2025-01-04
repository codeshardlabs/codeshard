import { configureStore } from "@reduxjs/toolkit";
import { shardReducer } from "./slices/shard";
import { modalReducer } from "./slices/modal";

export const store = configureStore({
  reducer: {
    shard: shardReducer,
    modal: modalReducer,
  },
});
