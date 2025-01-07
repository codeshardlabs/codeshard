import { Schema } from "mongoose";

export const dependencySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    default: "latest",
  },
  isDevDependency: {
    type: Boolean,
    default: false,
  },
});
