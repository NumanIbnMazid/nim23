import { NextResponse } from "next/server";
import { getProfileInfo } from "@/lib/api/profileInfo";

export async function GET() {
  try {
    const profile = await getProfileInfo();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile info:", error);
    return NextResponse.json({ error: "Failed to fetch profile info" }, { status: 500 });
  }
}
