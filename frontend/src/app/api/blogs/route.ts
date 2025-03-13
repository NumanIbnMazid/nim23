import { NextResponse } from "next/server";
import { getAllBlogs } from "@/lib/api/blogs/blogs";
import {  jsonBigIntReplacer } from "@/lib/utils/helpers";

export async function GET() {
  try {
    const blogs = await getAllBlogs();
    return new NextResponse(JSON.stringify(blogs, jsonBigIntReplacer), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}
