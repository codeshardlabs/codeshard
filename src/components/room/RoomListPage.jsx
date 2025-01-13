import RoomsList from "@/src/components/room/RoomsList";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/src/lib/database";
import { and, eq } from "drizzle-orm";

const fetchRooms = async (userId) => {
  const collaborativeShards = await db.query.shards.findMany({
    where: (shards) =>
      and(eq(shards.mode, "collaboration"), eq(shards.userId, userId)),
  });

  return collaborativeShards;
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
      <Suspense fallback={<p>Loading...</p>}>
        <RoomsList rooms={rooms} />
      </Suspense>
    </div>
  );
};

export default RoomListPage;
