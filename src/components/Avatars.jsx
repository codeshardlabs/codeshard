"use client";
import { useOthers, useSelf } from "@/liveblocks.config";

import Avatar from "react-avatar";
import { useState } from "react";

export const Avatars = () => {
  const currentUser = useSelf();
  const users = useOthers();

  return (
    <div className="flex p-0">
      {users.map(({ connectionId, info }) => {
        return (
          <UserAvatar key={connectionId} name={info.name} color={info.color} />
        );
      })}

      {currentUser && (
        <div className="relative  ml-0">
          <UserAvatar
            name={currentUser.info.name}
            color={currentUser.info.color}
          />
        </div>
      )}
    </div>
  );
};

const UserAvatar = ({ color, name }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div className="-ml-4" onClick={() => setIsHovered(true)}>
        <Avatar name={name} round={true} size="40" />
      </div>
    </>
  );
};
