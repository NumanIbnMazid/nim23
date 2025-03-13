import { NextResponse } from "next/server";
import { getAllSnippets } from "@/lib/api/snippets/snippets";
import { jsonBigIntReplacer } from "@/lib/utils/helpers"; // ✅ Handle BigInt serialization

export async function GET() {
  try {
    const snippets = await getAllSnippets();
    return new NextResponse(JSON.stringify(snippets, jsonBigIntReplacer), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return NextResponse.json({ error: "Failed to fetch snippets" }, { status: 500 });
  }
}
