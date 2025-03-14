import { NextResponse } from "next/server";
import { getAllEducations } from "@/lib/api/educations";

export async function GET() {
  try {
    const educations = await getAllEducations() || [];

    return NextResponse.json(educations, { status: 200 });
  } catch (error) {
    console.error("Error fetching educations:", error);
    return NextResponse.json({ error: "Failed to fetch educations" }, { status: 500 });
  }
}
