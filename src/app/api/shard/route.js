// import connectToDB from "@/src/lib/database";
import { db } from "@/lib/database";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
// import { User } from "@/src/models/User";
// import { Shard } from "@/src/models/Shard";

const getSearchParams = (req) => {
  const { searchParams } = new URL(req.url);
  return searchParams;
};

export const GET = async (req) => {
  const searchParams = getSearchParams(req);

  try {
    connectToDB();
    const userId = searchParams.get("userId");
    console.log(userId);

    if (!userId) {
      return NextResponse.json({ message: "UserID Not found" }, { status: 404 });
    }

    // const existingUser = await User.findOne({ email });
    const shards = await db.query.shards.findMany({
      where: (shards) => (
        and(
          eq(shards.mode, "normal"),
          eq(shards.userId, userId)
        )
      )
    });
    
    // const shards = await Shard.find({ creator: existingUser?.name });
    return NextResponse.json(shards, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error in fetching shards" },
      { status: 500 },
    );
  }
};
