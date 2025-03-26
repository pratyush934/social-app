import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function GET() {
  try {
    console.log("Everything is working fine");
    return NextResponse.json(imagekit.getAuthenticationParameters());
  } catch (er) {
    console.log("there is an error in imagekit-auth/route.ts", er);
    return NextResponse.json(
      {
        message: "There is an error",
      },
      {
        status: 400,
      }
    );
  }
}
