import RoomsList from "@/components/RoomsList";
import Navbar from "../src/app/Navbar";
import { auth } from "@/auth";
import { Suspense } from "react";
import { redirect } from "next/navigation";

const fetchRooms = async (username) => {
  const url = process.env.HOST_URL;
  const res = await fetch(`${url}/api/room?creator=${username}`, {
    cache: "no-store",
  });

  const data = await res.json();
  return data;
};
const RoomListPage = async () => {
  const session = await auth();
  // connectToDB();

  if (!session) {
    redirect("/login");
  }

  let rooms = await fetchRooms(session?.user.name);
  console.log("Rooms: ", rooms);
  return (
    <div>
      <Navbar />
      <Suspense fallback={<p>Loading...</p>}>
        <RoomsList rooms={rooms} />
      </Suspense>
    </div>
  );
};

export default RoomListPage;
