
// import { Shard } from "@/src/models/Shard";
import { NextResponse } from "next/server";
import {db} from "@/lib/database";
import { and } from "drizzle-orm";


export const revalidate = true;

const getSearchParams = (req) => {
  const { searchParams } = new URL(req.url);
  return searchParams;
};


export async function GET(req, res) {
  const searchParams = getSearchParams(req);
  try {
    const creator = searchParams.get("userId");

    if (!creator) {
      return NextResponse.json(
        { message: "creator not found" },
        { status: 400 },
      );
    }

   const collaborativeShards =  await db.query.shards.findMany({
      where: (shards) => and(
        eq(shards.mode, "collaboration"),
        eq(shards.userId, creator)
      )
    });
    
    // const collaborativeShards = await Shard.find({
    //   mode: "collaboration",
    //   creator: creator,
    // });
    return NextResponse.json(collaborativeShards, { status: 200 });
  } catch (error) {
    console.log("Could not fetch rooms list", error.message);
    return NextResponse.json(
      { message: "Could not fetch rooms list" },
      { status: 500 },
    );
  }
}
