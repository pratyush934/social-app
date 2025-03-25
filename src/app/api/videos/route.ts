import { authOptions } from "@/lib/auth";
import { connectToDB } from "@/lib/db";
import Video, { VideoI } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDB();

    const allVideos = await Video.find({}).sort({ createdAt: -1 }).lean();

    if (!allVideos || allVideos.length == 0) {
      return NextResponse.json(
        {
          message: "No videos found",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(allVideos);
  } catch (e) {
    return NextResponse.json(
      {
        error: "There is an error while getting all the videos",
        e,
      },
      {
        status: 400,
      }
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    const isUserAuthenticated = await getServerSession(authOptions);

    if (!isUserAuthenticated) {
      return NextResponse.json(
        {
          message: "The user is not authenticated",
        },
        {
          status: 401,
        }
      );
    }

    await connectToDB();

    const body: VideoI = await req.json();

    if (
      !body.title ||
      !body.description ||
      !body.videourl ||
      !body.thumbnailurl
    ) {
      return NextResponse.json(
        {
          message: "there is an issue as we are not getting not proper videos",
        },
        {
          status: 401,
        }
      );
    }

    const videoData = {
      ...body,
      controls: body.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    };
    const newVideo = await Video.create(videoData);
    return NextResponse.json(newVideo);
  } catch (e) {
    return NextResponse.json(
      {
        error: "there is an issue while posting the videos",
        e,
      },
      {
        status: 401,
      }
    );
  }
}
