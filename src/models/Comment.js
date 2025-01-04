import mongoose, { Schema, models, model } from "mongoose";

const commentSchema = new Schema(
  {
    user: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    shardId: {
      type: String,
      required: true,
    },
    threadId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      index: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const Comment = models?.Comment || model("Comment", commentSchema);
