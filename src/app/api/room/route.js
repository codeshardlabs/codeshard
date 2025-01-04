import connectToDB from "@/src/lib/database";
import { Shard } from "@/src/models/Shard";
import { NextResponse } from "next/server";

export const revalidate = true;

const getSearchParams = (req) => {
  const { searchParams } = new URL(req.url);
  return searchParams;
};

export async function GET(req, res) {
  const searchParams = getSearchParams(req);
  try {
    connectToDB();
    const creator = searchParams.get("creator");

    if (!creator) {
      return NextResponse.json(
        { message: "creator not found" },
        { status: 400 },
      );
    }

    const collaborativeShards = await Shard.find({
      mode: "collaboration",
      creator: creator,
    });
    return NextResponse.json(collaborativeShards, { status: 200 });
  } catch (error) {
    console.log("Could not fetch rooms list", error.message);
    return NextResponse.json(
      { message: "Could not fetch rooms list" },
      { status: 500 },
    );
  }
}
