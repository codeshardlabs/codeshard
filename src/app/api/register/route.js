import connectToDB from "@/src/lib/database";
// import User from "@/models/User";
import { User } from "@/src/models/User";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    console.log("Name: ", name);
    console.log("Email: ", email);
    console.log("Password: ", password);
    connectToDB();

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { message: "User already registered" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { message: "User Registration error" },
      { status: 500 },
    );
  }
}
