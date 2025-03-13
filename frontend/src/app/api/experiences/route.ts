import { NextResponse } from "next/server";
import { getAllExperiences } from "@/lib/api/experiences";

export async function GET() {
  try {
    const experiences = await getAllExperiences();

    return NextResponse.json(experiences, { status: 200 });
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}
