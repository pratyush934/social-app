import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const isUserAuthenticated = await getServerSession(authOptions);

  if (!isUserAuthenticated)
    return NextResponse.json(
      {
        message: "Error here",
      },
      {
        status: 400,
      }
    );

  try {
    await connectToDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Video ID is required" },
        { status: 400 }
      );
    }

    const video = await Video.findById(id).lean();

    if (!video) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { error: "There was an error fetching the video" },
      { status: 500 }
    );
  }
}
