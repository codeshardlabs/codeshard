import { Schema, models, model } from "mongoose";
import { Shard } from "./Shard.js";
import { Comment } from "./Comment.js";
import { User } from "./User.js";

const activitySchema = new Schema(
  {
    activityType: {
      type: String,
      enum: ["post", "comment", "like", "follow"],
    },
    shardId: {
      type: Schema.Types.ObjectId,
      ref: "Shard",
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },

    userId: {
      type: String,
    },

    followingId: {
      type: String,
    },

    likes: Number,
  },
  {
    timestamps: true,
  },
);

export const ActivityType = {
  POST: "post",
  COMMENT: "comment",
  LIKE: "like",
  FOLLOW: "follow",
};

export const Activity = models?.Activity || model("Activity", activitySchema);
