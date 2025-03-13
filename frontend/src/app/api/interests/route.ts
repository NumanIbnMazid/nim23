import { NextResponse } from "next/server";
import { getAllInterests } from "@/lib/api/interests";

export async function GET() {
  try {
    const interests = await getAllInterests();

    return NextResponse.json(interests, { status: 200 });
  } catch (error) {
    console.error("Error fetching interests:", error);
    return NextResponse.json({ error: "Failed to fetch interests" }, { status: 500 });
  }
}
