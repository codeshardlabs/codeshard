import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/database";
import { shards } from "@/db/schema/shards";
import { eq } from "drizzle-orm";


export const PUT = async (req, { params }) => {
  const slug = params.slug;

  console.log("Parameters: ", params);
  const {userId} = await auth();

  if (!userId) {
    return NextResponse.json(
      { message: "Unauthenticated request" },
      { status: 401 },
    );
  }

  try {
    const { title } = await req.json();
    console.log("Title: ", title);
    console.log("Slug: ", slug);

    let fields = {
      id: slug
    };
    if(title) {
      fields["title"] = title;
    }

    await db.update(shards).set(fields);
    return NextResponse.json(
      { message: "Shard updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log("Shard updation error: ", error.message);
    return NextResponse.json(
      { message: "Shard updation error" },
      { status: 500 },
    );
  }
};

export const DELETE = async (req, { params }) => {
  const slug = params.slug;
  // const session = req.auth;
  const {userId} = await auth();

  if (!userId) {
    return NextResponse.json(
      { message: "Unauthenticated request" },
      { status: 401 },
    );
  }

  console.log("Slug: ", slug);

  try {
    await db.delete(shards).where(eq(shards.id, slug));
    return NextResponse.json(
      { message: "Shard deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log("Shard deletion error: ", error.message);
    return NextResponse.json(
      { message: "Shard deletion error" },
      { status: 500 },
    );
  }
};

export const PATCH = auth(async (req, { params }) => {
  const slug = params.slug;
  const session = req.auth;

  if (!session?.user) {
    return NextResponse.json(
      { message: "Unauthenticated request" },
      { status: 401 },
    );
  }

  const { mode, type } = await req.json();

  console.log("Shard Mode: ", mode);
  console.log("shard type: ", type);
  const user = session?.user;
  console.log("Slug: ", slug);
  console.log("User: ", user);

  try {
    connectToDB();

    const existingShard = await Shard.findById(slug);
    if (!existingShard) {
      return NextResponse.json({ message: "Shard not found" }, { status: 404 });
    }

    console.log("existing shard: ", existingShard);
    const existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // existingShard.type = existingShard.type === 'public' ? 'private': "public";
    if (type) existingShard.type = type;
    if (mode) existingShard.mode = mode;

    await existingShard.save();
    console.log("Shard: ", existingShard);
    return NextResponse.json(
      { message: "Shard patched successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log("Shard patch error: ", error.message);
    return NextResponse.json({ message: "Shard patch error" }, { status: 500 });
  }
});
