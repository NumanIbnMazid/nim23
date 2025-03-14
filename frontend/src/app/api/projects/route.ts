import { NextResponse } from "next/server";
import { getAllProjects } from "@/lib/api/projects/projects";
import { jsonBigIntReplacer } from "@/lib/utils/helpers"; // ✅ Handle BigInt serialization

export async function GET() {
  try {
    const projects = await getAllProjects();
    return new NextResponse(JSON.stringify(projects, jsonBigIntReplacer), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
