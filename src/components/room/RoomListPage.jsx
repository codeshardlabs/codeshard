import RoomsList from "@/src/components/room/RoomsList";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import NextTopLoader from "nextjs-toploader";
import { fetchAllRooms, handleFailureCase, throwFailureCb } from "@/src/lib/actions";

const fetchRooms = async (userId) => {
  try {
    const out = await fetchAllRooms(userId, 10, 0);
    handleFailureCase(out, ["rooms"], {
      src: "fetchRooms()"
    }, throwFailureCb);
  
    return out.data.rooms;
    
  } catch (error) {
    console.log("could not fetchRooms()", error)
    return null;
  }
};
const RoomListPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  let rooms = await fetchRooms(userId);
  console.log("Rooms: ", rooms);
  return (
    <div>
      <Suspense fallback={<NextTopLoader/>}>
        <RoomsList rooms={rooms} />
      </Suspense>
    </div>
  );
};

export default RoomListPage;
