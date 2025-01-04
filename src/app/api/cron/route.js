import { getFeedOfUser } from "@/src/lib/actions";
import connectToDB from "@/src/lib/database";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    connectToDB();
    const session = req.auth;

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthenticated request" },
        { status: 401 },
      );
    }

    const user = session?.user;
    console.log("User: ", user);

    const feed = await getFeedOfUser(user.name);
    return NextResponse.json(feed, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Could not execute shard" },
      { status: 500 },
    );
  }
};
