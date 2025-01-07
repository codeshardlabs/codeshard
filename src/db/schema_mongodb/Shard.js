import { Schema, model, models } from "mongoose";
import { fileSchema } from "./File.js";
import { dependencySchema } from "./Dependency.js";
import { Comment } from "./Comment.js";

const shardSchema = new Schema(
  {
    title: {
      type: String,
      default: "Untitled",
    },
    userId: {
      type: String,
      index: true,
    },
    templateType: {
      type: String,
      enum: [
        "static",
        "angular",
        "react",
        "react-ts",
        "solid",
        "svelte",
        "test-ts",
        "vanilla-ts",
        "vanilla",
        "vue",
        "vue-ts",
        "node",
        "nextjs",
        "astro",
        "vite",
        "vite-react",
        "vite-react-ts",
      ],
    },
    files: [fileSchema],
    dependencies: [dependencySchema],
    tags: [String],
    type: {
      type: String,
      default: "public",
      enum: ["public", "private", "forked"],
    },
    mode: {
      type: String,
      default: "normal",
      enum: ["normal", "collaboration"],
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [String],
      default: []
    },
    commentThread: Schema.Types.ObjectId,
    lastSyncTimestamp: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  },
);

export const Shard = models?.Shard || model("Shard", shardSchema);
