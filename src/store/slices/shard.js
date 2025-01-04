import { createSlice } from "@reduxjs/toolkit";

const shardSlice = createSlice({
  name: "shard",
  initialState: {
    current: {
      title: "Untitled",
      html: "",
      css: "",
      js: "",
      id: "",
      mode: "normal",
    },
    prev: {
      title: "Untitled",
      html: "",
      css: "",
      js: "",
      id: "",
      mode: "normal",
    },
  },
  reducers: {
    setShard(state, action) {
      const input = action.payload;
      if (input.title) state.current.title = input.title;
      if (input.html) state.current.html = input.html;
      if (input.css) state.current.css = input.css;
      if (input.js) state.current.js = input.js;
      if (input.id) state.current.id = input.id;
      if (input.mode) state.current.mode = input.mode;
    },

    setPrev(state, action) {
      const input = action.payload;
      if (input.title) state.prev.title = input.title;
      if (input.html) state.prev.html = input.html;
      if (input.css) state.prev.css = input.css;
      if (input.js) state.prev.js = input.js;
      if (input.id) state.prev.id = input.id;
      if (input.mode) state.prev.mode = input.mode;
    },
  },
});

export const {
  actions: { setShard, setPrev },
  reducer: shardReducer,
} = shardSlice;
