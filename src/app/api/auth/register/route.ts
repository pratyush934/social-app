import { connectToDB } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and Password is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already available" },
        { status: 400 }
      );
    }

    await User.create({ email, password });

    return NextResponse.json(
      { message: "User is finally registered" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "There is an Error ", err },
      { status: 400 }
    );
  }
}
