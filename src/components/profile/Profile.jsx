"use client";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import ProfileIcon from "../ui/icons/Profile";
import { followUser, handleFollowersOfUser, unfollowUser } from "../../lib/actions";
import { useOptimistic } from "react";
import ProfileContainer from "./ProfileContainer";
import { useUser } from "@clerk/nextjs";

const Profile = ({
  shards,
  name: initialName,
  followers: initialFollowers,
  followersCount: initialFollowerCount,
  following: initialFollowing,
  id,
}) => {
  const { user, isSignedIn } = useUser();
  const [name] = useState(initialName);
  const [followers, setFollowers] = useState(initialFollowerCount);
  const [optimisticFollowers, setOptimisticFollowers] =
    useOptimistic(followers);
  const [following, setFollowing] = useState(initialFollowing);
  let [hasFollowed, setHasFollowed] = useState(false);
  let [optimisticHasFollowed, setOptimisticHasFollowed] =
    useOptimistic(hasFollowed);

  if (!isSignedIn) {
    return null;
  }

  useEffect(() => {
    setHasFollowed(initialFollowers.includes(user.username));
  }, [user, initialFollowers]);

  useEffect(() => {
    setFollowers(initialFollowerCount);
    setFollowing(initialFollowing);
  }, [initialFollowerCount, initialFollowing]);

  const handleFollowersAction = async () => {
    setOptimisticHasFollowed((prev) => !prev);
    if (optimisticHasFollowed) {
      setOptimisticFollowers((prev) => prev - 1);
    }

    if (!optimisticHasFollowed) {
      setOptimisticFollowers((prev) => prev + 1);
    }

    if(optimisticHasFollowed) {
      await unfollowUser(user.id, id);
    } else {
      await followUser(user.id, id);
    }
  };

  return (
    <>
      <div className="text-white flex items-center gap-4 p-4">
        <Avatar name={name} round={true} size="100" />
        <div className="flex flex-col justify-center gap-1">
          <span>{name}</span>
          {user.username !== name && (
            <form action={handleFollowersAction}>
              <button
                type="submit"
                className=" bg-white text-black  w-full cursor-pointer rounded-md text-center hover:bg-white/60"
              >
                {optimisticHasFollowed ? "Unfollow" : "Follow"}{" "}
              </button>
            </form>
          )}
          <p className="flex gap-2 items-center">
            <ProfileIcon fill={"white"} className="size-4" />
            <span>{optimisticFollowers} </span> Follower |{" "}
            <span>{following}</span> Following{" "}
          </p>
        </div>
        <div></div>
      </div>
      <ProfileContainer shards={shards} id={id} />
    </>
  );
};

export default Profile;
