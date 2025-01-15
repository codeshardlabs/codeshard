import { redirect } from "next/navigation";
import Profile from "../../components/profile/Profile";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { db } from "@/src/lib/database";
import { Suspense } from "react";
import NextTopLoader from "nextjs-toploader";
import { eq } from "drizzle-orm";


export const fetchUserDetails = async (userId) => {
  try {
    const user = await db.query.users.findFirst({
      where: (users) => eq(users.id, userId),
      with: {
        shards: true,
        followers: true,
        following: true
      }
    });
    console.log("user: ", user);

    return user;
  } catch (error) {
    console.log("could not fetch user details", error);
    return null;
  }
};

export const fetchClerkUser = async (userId) => {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
   return user;
  } catch (error) {
    return null;
  }
}

export default async function UserProfile({ params }) {
  const { userId } = await auth();
  let loginnedUser = await currentUser();

  if (!loginnedUser) {
    redirect("/");
  }
  const user = params["user-id"];
  const userDetails = await fetchUserDetails(user);
  const clerkUser = await fetchClerkUser(user);

  if (!userDetails || !clerkUser) {
    redirect("/");
  }
  const isOwner = userId === userDetails.id ? true  : false;

  console.log("user Details: ", userDetails);
  let { followers, following, shards } = userDetails;

  return (
    <>
      <Suspense fallback={<NextTopLoader />}>
        <Profile
        shards={shards}
        followers={followers}
        followersCount={followers?.length}
        following={following?.length}
        name={clerkUser.fullName}
        id={user?._id.toString()}
        isOwner={isOwner}
      />
      </Suspense>
    </>
  );
}
