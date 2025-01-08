
import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    userId: {
      type: String, 
      unique: true,
      index: true,
    },
    followers: {
      type: [String],
      default: [],
    },
    following: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const User = models?.User || model("User", userSchema);


