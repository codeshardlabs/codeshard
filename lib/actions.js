"use server";

import { signOut } from "@/auth";
import { Shard } from "@/models/Shard";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import connectToDB from "./database";
import { User } from "@/models/User";
import { Activity, ActivityType } from "@/models/Activity";
import { Feed } from "@/models/Feed";
import { Comment } from "@/models/Comment";
import { getThreadedComments } from "@/utils";

export const signOutHandler = async () => {
  await signOut();
  redirect("/login");
};

export const handleRouteShift = () => {
  revalidateTag("shards");
  redirect("/your-work");
};

export const handleRoomRouteShift = () => {
  revalidateTag("rooms");
  redirect("/rooms-list");
};

export const incLikes = async (id) => {
  connectToDB();
  const existingShard = await Shard.findById(id);
  existingShard.likes++;
  await existingShard.save();

  console.log("likes incremented successfully");
};

export const handleFollowersOfUser = async (
  mainUser,
  guestUser,
  hasFollowed,
) => {
  try {
    connectToDB();
    const mainUserDetails = await User.findOne({ name: mainUser });
    const guestUserDetails = await User.findOne({ name: guestUser });

    if (!mainUserDetails || !guestUserDetails) {
      throw new Error("Main user or guest user not found");
    }

    let isValidActivity = false;

    if (!hasFollowed) {
      mainUserDetails.followers.push(guestUser);
      guestUserDetails.following.push(mainUser);

      isValidActivity = true;
    }

    if (hasFollowed) {
      if (mainUserDetails.followers.length > 0)
        mainUserDetails.followers.pull(guestUser);
      if (guestUserDetails.following.length > 0)
        guestUserDetails.following.pull(mainUser);
    }

    await Promise.all([mainUserDetails.save(), guestUserDetails.save()]);

    if (isValidActivity) {
      await Activity.create({
        activity: "follow",
        followerId: guestUserDetails._id,
        followingId: mainUserDetails._id,
      });
    }

    revalidateTag(`${mainUser.toLowerCase().split(" ").join("-")}`);
  } catch (error) {
    console.log("Could not perform the action");
    console.log(error.message);
  }
};

export const saveTemplateToDB = async (
  id,
  files,
  dependencies,
  devDependencies
) => {
  const fileContent = Object.entries(files).map(([fileName, fileConfig]) => {
    return {
      name: fileName,
      ...fileConfig,
    };
  });

  const nonDevDepContent = Object.entries(dependencies).map(
    ([depName, version]) => {
      return {
        name: depName,
        version,
        isDevDependency: false,
      };
    },
  );
  const devDepContent = Object.entries(devDependencies).map(
    ([depName, version]) => {
      return {
        name: depName,
        version,
        isDevDependency: true,
      };
    },
  );

  const dependencyContent = [...nonDevDepContent, ...devDepContent];
  try {
    const updatedDoc = await Shard.findById(id);
    if (!updatedDoc) {
      return { status: 404, message: "Template not found" };
    } 
    updatedDoc.files = fileContent;
    updatedDoc.dependencies = dependencyContent;
    await updatedDoc.save();
      return { status: 200 };
  } catch (error) {
    console.log("Could not update template: ", id, error);
    return { status: 500 };
  }
};

export const saveShardName = async (id, shardName) => {
  try {
    const existingShard = await Shard.findById({ _id: id });
    existingShard.title = shardName;
    await existingShard.save();
  } catch (error) {
    console.log("Could not save shards...", error);
  }
};

export const updateLikes = async (id, likes, likeStatus, email) => {
  try {
    const existingShard = await Shard.findById({ _id: id });
    const user = await User.findOne({ email: email });
    if (
      likeStatus === "liked" &&
      !existingShard.likedBy.includes(user._id.toString())
    ) {
      existingShard.likes++;
      existingShard.likedBy?.push(user._id);

      await existingShard.save();

      if (existingShard.creator !== user.name) {
        await Activity.create({
          activityType: ActivityType.LIKE,
          likes: existingShard.likes,
          shardId: existingShard._id,
        });
      }
    } else if (
      likeStatus === "unliked" &&
      existingShard.likedBy.includes(user._id.toString())
    ) {
      existingShard.liked--;
      existingShard.likedBy?.pop(user._id);
      await existingShard.save();
    }
  } catch (error) {
    console.log("Could not update likes...", error);
  }
};

export const addCommentToShard = async (msg, shardId, user, parent) => {
  try {
    const commentDoc = await Comment.create({
      user: user,
      message: msg,
      parentId: parent,
      shardId: shardId,
    });

    if (parent === null) {
      // top-level-comment
      commentDoc.threadId = shardId;
      await Shard.findOneAndUpdate(
        {
          _id: shardId,
        },
        {
          $set: {
            commentThread: shardId,
          },
        },
      );
    } else {
      const comment = await Comment.findOne({ _id: parent });
      commentDoc.threadId = comment.threadId;
    }

    await commentDoc.save();

    const existingShard = await Shard.findOne({ _id: shardId });
    if (existingShard) {
      await Activity.create({
        activityType: ActivityType.COMMENT,
        commentId: commentDoc._id,
      });
    }

    const commentObj = await Comment.findById(commentDoc._id).lean();
    return commentObj;
  } catch (error) {
    console.log("Could not add comment...", error);
    throw error;
  }
};

export const getCommentsOfShard = async (threadId) => {
  try {
    const comments = await Comment.find({
      threadId: threadId,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    return JSON.stringify(getThreadedComments(comments));
  } catch (error) {
    console.log("Could not get new comment...", error);
    return JSON.stringify([]);
  }
};

export const getRecentActivityofFollowing = async (following) => {
  try {
    const currentDate = new Date();
    const lastHourDate = currentDate.setDate(currentDate.getHours() - 1);
    const activities = await Activity.find({
      user: { $in: following },
      createdAt: { $gte: lastHourDate },
    })
      .sort({
        createdAt: 1,
      })
      .lean();

    return activities;
  } catch (error) {
    console.log("Could not get recent activites: ", error);
    return [];
  }
};

export const getFeedOfUser = async (user) => {
  try {
    const existingUser = await User.find({ name: user });
    const activites = await getRecentActivityofFollowing(
      existingUser.following,
    );
    const feed = await Feed.findOne({
      user: user,
    });

    if (feed) {
      feed.activites.push(...activites.map((activity) => activity._id));
      await feed.save();

      return feed;
    } else {
      const newFeed = await Feed.create({
        user: user,
        activites: activites.map((activity) => activity._id),
      });

      return newFeed;
    }
  } catch (error) {
    console.log("Could not get feed of user....", error);
    return [];
  }
};

export const fetchFeedAsPagination = async (userId, page) => {
  try {
    const feed = await Feed.find({
      userId: userId,
    })
      .skip(page * 10)
      .limit(10)
      .lean();

    console.log("User feed: ", feed);
    return feed;
  } catch (error) {
    console.log("Could not get feed for page: ", page, error);
    return [];
  }
};
