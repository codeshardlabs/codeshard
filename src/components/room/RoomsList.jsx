"use client";
import { Toaster, toast } from "sonner";
import RoomListCard from "./RoomListCard";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
const RoomsList = ({ rooms: initialRooms }) => {
  const [rooms, setRooms] = useState(initialRooms ?? []);
  const router = useRouter();

  useEffect(() => {
    setRooms(initialRooms);
  }, [initialRooms]);

  const onLinkCopy = () => {
    toast.info("Link Copied Successfully");
  };

  if (rooms?.length === 0) {
    return <p>No Rooms Yet...</p>;
  }

  const roomList = rooms.map((room, index) => (
    <RoomListCard
      setRooms={setRooms}
      title={room.title}
      index={index}
      template={room.templateType}
      key={room.id}
      onLinkCopy={onLinkCopy}
      id={room.id}
    />
  ));
  return (
    <>
      <h1 className="text-lg text-center mb-2"> Rooms List</h1>

      <ul className="flex flex-col gap-1">{roomList}</ul>
      <Toaster position="top-center" richColors />
    </>
  );
};

export default RoomsList;
