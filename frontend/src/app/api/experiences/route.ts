import { NextResponse } from "next/server";
import { getAllExperiences } from "@/lib/api/experiences";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const limitParam = url.searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : undefined

    if (limit !== undefined && (isNaN(limit) || limit <= 0)) {
      return NextResponse.json({ error: 'Invalid limit parameter' }, { status: 400 })
    }

    const experiences = await getAllExperiences(limit);
    return NextResponse.json(experiences, { status: 200 });
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 });
  }
}
