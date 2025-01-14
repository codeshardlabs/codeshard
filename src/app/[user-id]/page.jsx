import { redirect } from "next/navigation";
import Profile from "../../components/profile/Profile";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/src/lib/database";
import { Suspense } from "react";
import NextTopLoader from "nextjs-toploader";
import { eq } from "drizzle-orm";

export const fetchUserDetails = async (userId) => {
  try {
    const user = await db.query.users.findFirst({
      where: (users) => eq(users.id, userId),
    });
    console.log("user: ", user);

    return user;
  } catch (error) {
    console.log("could not fetch user details", error);
    return null;
  }
};

export default async function UserProfile({ params }) {
  const { userId } = await auth();
  let loginnedUser = await currentUser();

  if (!loginnedUser) {
    redirect("/");
  }
  const user = params["user-id"];
  const userDetails = await fetchUserDetails(user);
  if (!userDetails) {
    redirect("/");
  }
  const isOwner = session ? (userId === userDetails.id ? true : false) : false;

  console.log("user Details: ", userDetails);
  // let { user, shards } = userDetails;

  return (
    <>
      <Suspense fallback={<NextTopLoader />}>
        {/* <Profile
        shards={shards}
        followers={user?.followers}
        followersCount={user?.followers?.length}
        following={user?.following?.length}
        name={user?.name}
        id={user?._id.toString()}
      /> */}
      </Suspense>
    </>
  );
}
