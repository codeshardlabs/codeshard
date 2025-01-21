"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "./database";
import { getThreadedComments } from "@/src/utils";
import { likes } from "@/src/db/schema/likes";
import { followers, users } from "@/src/db/schema/users";
import { and, eq, or } from "drizzle-orm";
import { shards } from "@/src/db/schema/shards";
import { comments, replies } from "@/src/db/schema/comments";
import { dependencies } from "@/src/db/schema/dependencies";
import { files } from "../db/schema/files";

export const handleRouteShift = () => {
  revalidateTag("shards");
  redirect("/your-work");
};

export const saveUserMetadeta = async (userId) => {
  const existingUser = await db.query.users.findFirst({
    where: (users) => eq(users.id, userId),
  });
  if (existingUser) return null;
  return await db
    .insert(users)
    .values({
      id: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
};

export const handleRoomRouteShift = () => {
  revalidateTag("rooms");
  redirect("/rooms-list");
};

export const incLikes = async (shardId, userId) => {
  try {
    await db.insert(likes).values({
      shardId: shardId,
      likedBy: userId,
    });
    console.log("likes incremented successfully", shardId, userId);
  } catch (error) {
    console.log("could not increment likes", error);
  }
};

export const handleFollowersOfUser = async (
  mainUserId,
  guestUserId,
  hasFollowed,
) => {
  try {
    if (!hasFollowed) {
      await db.insert(followers).values(
        {
          id: mainUserId,
          followerId: guestUserId,
        },
        {
          id: guestUserId,
          followingId: mainUserId,
        },
      );
    } else {
      // unfollowing user
      await db
        .delete(followers)
        .where(
          or(
            and(
              eq(followers.id, mainUserId),
              eq(followers.followerId, guestUserId),
            ),
            and(
              eq(followers.id, guestUserId),
              eq(followers.followingId, mainUserId),
            ),
          ),
        );
    }
  } catch (error) {
    console.log("Could not handle followers of user");
    console.log(error.message);
  }
};

export const addDependency = async (
  dependencyName,
  version,
  isDevDependency,
) => {
  await db.insert(dependencies).values({
    name: dependencyName,
    version: version,
    isDevDependency: isDevDependency,
  });
};

// TODO: optimize the queries
export const saveTemplateToDB = async (
  id,
  filesList,
  dependenciesList,
  devDependenciesList,
) => {
  const fileContent = Object.entries(filesList).map(
    ([fileName, fileConfig]) => {
      return {
        name: fileName,
        shardId: id,
        ...fileConfig,
      };
    },
  );

  const nonDevDepContent = Object.entries(dependenciesList).map(
    ([depName, version]) => {
      return {
        shardId: id,
        name: depName,
        version,
        isDevDependency: false,
      };
    },
  );
  const devDepContent = Object.entries(devDependenciesList).map(
    ([depName, version]) => {
      return {
        shardId: id,
        name: depName,
        version,
        isDevDependency: true,
      };
    },
  );

  const dependencyContent = [...nonDevDepContent, ...devDepContent];

  try {
    await db.transaction(async (tx) => {
      if (fileContent.length > 0)
        await tx
          .insert(files)
          .values(fileContent)
          .onConflictDoUpdate({ target: files.id, set: fileContent });
      if (dependencyContent.length > 0)
        await tx.insert(dependencies).values(dependencyContent);
    });

    return { status: 200 };
  } catch (error) {
    console.log("Could not update template: ", id, error);
    return { status: 500 };
  }
};

export const saveShardName = async (id, shardName) => {
  try {
    await db
      .update(shards)
      .set({
        title: shardName,
      })
      .where({
        id: id,
      });
  } catch (error) {
    console.log("Could not save shards...", error);
  }
};

export const updateLikes = async (shardId, userId, likeStatus) => {
  try {
    if (likeStatus === "liked") {
      await db.insert(likes).values({
        shardId: shardId,
        likedBy: userId,
      });
    } else if (likeStatus === "unliked") {
      await db.delete(likes).where(eq(likes.shardId, shardId));
    }
  } catch (error) {
    console.log("Could not update likes...", error);
  }
};

export const addCommentToShard = async (
  msg,
  shardId,
  userId,
  parent = null,
) => {
  try {
    const comment = await db
      .insert(comments)
      .values({
        userId: userId,
        message: msg,
        shardId: shardId,
      })
      .returning();

    if (parent != null) {
      await db.insert(replies).values({
        repliedTo: parent,
        repliedBy: comment[0].id,
      });
    }
    return comment[0];
  } catch (error) {
    console.log("Could not add comment...", error);
    throw error;
  }
};

export const getCommentsOfShard = async (shardId) => {
  try {
    const comments = await db.query.comments.findMany({
      where: eq(comments.shardId, shardId),
      with: {
        replies: {
          comment: true,
        },
      },
    });

    return JSON.stringify(getThreadedComments(comments));
  } catch (error) {
    console.log("Could not get new comment...", error);
    return JSON.stringify([]);
  }
};

export const deleteShard = async (id) => {
  try {
    const x = await db.delete(shards).where(eq(shards.id, id)).returning();
    if (!x) throw new Error("could not delete shard");

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.log("delete shard error: ", error);
    return {
      error: error,
      success: false,
    };
  }
};

export const updateShardType = async (id, type) => {
  try {
    const x = await db
      .update(shards)
      .set({
        type: type,
      })
      .where(eq(shards.id, id))
      .returning();
    if (!x) throw new Error("could not update shard");

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.log("update shard error: ", error);
    return {
      error: error,
      success: false,
    };
  }
};
// export const getRecentActivityofFollowing = async (following) => {
//   try {
//     const currentDate = new Date();
//     const lastHourDate = currentDate.setDate(currentDate.getHours() - 1);
//     const activities = await Activity.find({
//       user: { $in: following },
//       createdAt: { $gte: lastHourDate },
//     })
//       .sort({
//         createdAt: 1,
//       })
//       .lean();

//     return activities;
//   } catch (error) {
//     console.log("Could not get recent activites: ", error);
//     return [];
//   }
// };

// export const getFeedOfUser = async (user) => {
//   try {
//     const existingUser = await User.find({ name: user });
//     const activites = await getRecentActivityofFollowing(
//       existingUser.following,
//     );
//     const feed = await Feed.findOne({
//       user: user,
//     });

//     if (feed) {
//       feed.activites.push(...activites.map((activity) => activity._id));
//       await feed.save();

//       return feed;
//     } else {
//       const newFeed = await Feed.create({
//         user: user,
//         activites: activites.map((activity) => activity._id),
//       });

//       return newFeed;
//     }
//   } catch (error) {
//     console.log("Could not get feed of user....", error);
//     return [];
//   }
// };

// export const fetchFeedAsPagination = async (userId, page) => {
//   try {
//     const feed = await Feed.find({
//       userId: userId,
//     })
//       .skip(page * 10)
//       .limit(10)
//       .lean();

//     console.log("User feed: ", feed);
//     return feed;
//   } catch (error) {
//     console.log("Could not get feed for page: ", page, error);
//     return [];
//   }
// };
