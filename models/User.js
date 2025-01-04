import { Schema, model, models } from "mongoose";
import { Shard } from "./Shard";

const userSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    shards: {
      type: [Schema.Types.ObjectId],
      ref: "Shard",
      default: [],
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
