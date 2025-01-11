import RoomsList from "@/src/components/room/RoomsList";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

const fetchRooms = async (userId) => {
  const url = process.env.HOST_URL;
  console.log("url: ", url);
  const res = await fetch(`${url}/api/room?userId=${userId}`, {
    cache: "no-store",
    headers: {
      "Accept" : "application/json"
    }
  });

  const data = await res.text();
  return data;
};
const RoomListPage = async () => {
  const {userId} = await auth();

  if (!userId) {
    redirect("/login");
  }

  let rooms = await fetchRooms(userId);
  // console.log("Rooms: ", rooms);
  return (
    <div>
      {/* <Suspense fallback={<p>Loading...</p>}>
        <RoomsList rooms={rooms} />
      </Suspense> */}
    </div>
  );
};

export default RoomListPage;
