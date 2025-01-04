import { redirect } from "next/navigation";
import Profile from "@/src/components/Profile";
import Navbar from "../Navbar";
import { auth } from "@/auth";
import { marshalUsername } from "@/src/utils";

export const fetchUserDetails = async (username) => {
  const response = await fetch(`${process.env.HOST_URL}/api/${username}`, {
    cache: "no-cache",
    next: {
      tags: [`${username}`],
    },
  });

  if (!response.ok) {
    const errorObj = await response.json();
    console.log("error message: ", errorObj.message);
    return null;
  }

  const data = await response.json();
  return data;
};

export default async function UserProfile({ params }) {
  const session = await auth();
  const username = params.username;
  const userDetails = await fetchUserDetails(username);
  const isOwner = session
    ? marshalUsername(session?.user?.name) === marshalUsername(username)
      ? true
      : false
    : false;

  if (!userDetails) {
    redirect("/");
  }

  console.log("user Details: ", userDetails);
  let { user, shards } = userDetails;

  // let shards = isOwner
  //   ? userDetails.shards
  //   : userDetails.shards.filter(
  //       (shard) => shard.mode === "normal" && shard.type === "public",
  //     );

  return (
    <>
      <Navbar />
      <Profile
        shards={shards}
        followers={user?.followers}
        followersCount={user?.followers?.length}
        following={user?.following?.length}
        name={user?.name}
        id={user?._id.toString()}
      />
    </>
  );
}
