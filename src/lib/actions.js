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
    // connectToDB();
    // const mainUserDetails = await User.findOne({ name: mainUser });
    // const guestUserDetails = await User.findOne({ name: guestUser });

    // if (!mainUserDetails || !guestUserDetails) {
    //   throw new Error("Main user or guest user not found");
    // }

    // let isValidActivity = false;

    // if (!hasFollowed) {
    //   mainUserDetails.followers.push(guestUser);
    //   guestUserDetails.following.push(mainUser);

    //   isValidActivity = true;
    // }

    // if (hasFollowed) {
    //   if (mainUserDetails.followers.length > 0)
    //     mainUserDetails.followers.pull(guestUser);
    //   if (guestUserDetails.following.length > 0)
    //     guestUserDetails.following.pull(mainUser);
    // }

    // await Promise.all([mainUserDetails.save(), guestUserDetails.save()]);
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

export const saveTemplateToDB = async (
  id,
  files,
  dependencies,
  devDependencies,
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
    await db.transaction(async (tx) => {
      await tx.insert(files).values(...fileContent);
      await tx.insert(dependencies).values(...dependencyContent);
    });

    // updatedDoc.files = fileContent;
    // updatedDoc.dependencies = dependencyContent;
    // await updatedDoc.save();
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
    // const existingShard = await Shard.findById({ _id: id });
    // existingShard.title = shardName;
    // await existingShard.save();
  } catch (error) {
    console.log("Could not save shards...", error);
  }
};

export const updateLikes = async (shardId, userId, likeStatus) => {
  try {
    // const existingShard = await Shard.findById({ _id: id });
    // const user = await User.findOne({ email: email });

    if (likeStatus === "liked") {
      await db.insert(likes).values({
        shardId: shardId,
        likedBy: userId,
      });
      // existingShard.likes++;
      // existingShard.likedBy?.push(user._id);

      // await existingShard.save();
    } else if (likeStatus === "unliked") {
      // existingShard.liked--;
      // existingShard.likedBy?.pop(user._id);
      // await existingShard.save();
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
    // const commentDoc = await Comment.create({
    //   user: user,
    //   message: msg,
    //   parentId: parent,
    //   shardId: shardId,
    // });

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

    // commentDoc.threadId = shardId;
    // await Shard.findOneAndUpdate(
    //   {
    //     _id: shardId,
    //   },
    //   {
    //     $set: {
    //       commentThread: shardId,
    //     },
    //   },
    // );
    // }

    // const commentObj = await Comment.findById(commentDoc._id).lean();
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

export const deleteShard = (id) => {
  await 
}
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
