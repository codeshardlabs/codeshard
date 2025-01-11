import { users } from "@/db/schema/users";
import { db } from "@/lib/database";
import { Shard } from "@/src/models/Shard";
import { User } from "@/src/models/User";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const username = params.username;

  if (!username) {
    return NextResponse.json(
      { message: "Username not found" },
      { status: 404 },
    );
  }

  try {
    const name = username.split("-").join(" ");
    const existingUser = await db.query.users.findFirst({
      where: eq(users.name, name),
    });
    // let existingUser = await User.findOne({
    //   name: name,
    // });

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    // const shards = await Shard.find({ creator: name });
    const shards = await db.query.shards.findMany({
      userId: existingUser.id,
    });

    return NextResponse.json(
      {
        user: existingUser,
        shards: shards,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Could not fetch user  details by username" },
      { status: 500 },
    );
  }
}
