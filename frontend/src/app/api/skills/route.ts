import { NextResponse } from "next/server";
import { getAllSkills } from "@/lib/api/skills";

export async function GET() {
  try {
    const skills = await getAllSkills();

    return NextResponse.json(skills, { status: 200 });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}
