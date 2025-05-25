"use client";
import { writeToClipboard } from "@/src/utils";
import React, { useState } from "react";
import CopyLink from "../ui/icons/Link";
import Delete from "../ui/icons/Delete";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { deleteShardById } from "@/src/lib/actions";
import { useUser } from "@clerk/nextjs";

const RoomListCard = ({
  index,
  id,
  isTemplate,
  template,
  setRooms,
  title,
  onLinkCopy,
}) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handleDelete = async (id) => {
    const isConfirmed = confirm(
      "Are you sure you want to proceed with this action?",
    );
    if (isConfirmed) {
      setIsDeleted(true);
      setRooms((prev) => {
        return prev.filter((room) => room?.id !== id);
      });
      const { error, data } = await deleteShardById(user.id,id);
      if (error) {
        console.log("response error: ", error);
        setIsDeleted(false);
      } else {
        console.log("response data: ", data);
      }
    }
  };
  return (
    <li className={clsx("flex justify-center text-sm", isDeleted && "hidden")}>
      <span className="border border-r-0 p-2  border-white">{index + 1}. </span>
      <span className="border p-2 border-r-0 border-white">{title}</span>
      <span className="border p-2  border-r-0 border-white">{id}</span>
      {isTemplate && (
        <span className="border p-2 capitalize border-r-0 border-white">
          {template}
        </span>
      )}
      <span
        onClick={() => {
          writeToClipboard(id);
          onLinkCopy();
        }}
        className="border p-2 cursor-pointer   border-white"
      >
        <CopyLink fill="white" className={"size-4"} />
      </span>
      <span
        onClick={() => handleDelete(id)}
        className="cursor-pointer flex items-center border border-l-0  hover:bg-red-500 p-2"
      >
        {" "}
        <Delete className="size-4 fill-white" />
      </span>
    </li>
  );
};

export default RoomListCard;
