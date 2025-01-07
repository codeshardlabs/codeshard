import { Schema, models, model } from "mongoose";
import { Activity } from "./Activity.js";

const feedSchema = new Schema(
  {
    userId: { type: String, unique: true },
    activities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Feed = models?.Feed || model("Feed", feedSchema);
