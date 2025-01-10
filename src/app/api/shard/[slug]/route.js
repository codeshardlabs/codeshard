// import connectToDB from "@/src/lib/database";
// import { Shard } from "@/src/models/Shard";
import { NextResponse } from "next/server";
// import { auth } from "@/auth";
// import { User } from "@/src/models/User";
import { revalidateTag } from "next/cache";
// import { Activity } from "@/src/models/Activity";

export const PUT = async (req, { params }) => {
  const slug = params.slug;

  console.log("Parameters: ", params);
  // const session = req.auth;

  if (!session?.user) {
    return NextResponse.json(
      { message: "Unauthenticated request" },
      { status: 401 },
    );
  }

  // const user = session?.user;
  // console.log("User: ", user);

  try {
    connectToDB();
    const { title } = await req.json();
    console.log("Title: ", title);
    console.log("Slug: ", slug);

    // const existingShard = await Shard.findById(slug);
    // if (!existingShard) {
    //   return NextResponse.json({ message: "Shard not found" }, { status: 404 });
    // }
    // if (title) existingShard.title = title;
    // if (mode) existingShard.mode = mode;
    // await existingShard.save();

    // console.log("existing shard: ", existingShard);

    // const existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // const shards = existingUser.shards;
    // if (shards.includes(existingShard._id)) {
    //   return NextResponse.json(
    //     { message: "Shard already present" },
    //     { status: 200 },
    //   );
    // }
    // existingUser.shards.push(existingShard._id);

    console.log("Existing User: ", existingUser);
    await existingUser.save();
    revalidateTag(`${existingUser.name.toLowerCase().split(" ").join("-")}`);
    revalidateTag(`rooms`);

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

export const DELETE = auth(async (req, { params }) => {
  const slug = params.slug;
  const session = req.auth;

  if (!session?.user) {
    return NextResponse.json(
      { message: "Unauthenticated request" },
      { status: 401 },
    );
  }

  console.log("Slug: ", slug);

  try {
    connectToDB();

    const existingShard = await Shard.findByIdAndDelete(slug);
    if (!existingShard) {
      return NextResponse.json({ message: "Shard not found" }, { status: 404 });
    }

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
});

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
