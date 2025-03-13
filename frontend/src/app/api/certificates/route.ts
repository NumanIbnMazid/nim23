import { NextResponse } from "next/server";
import { getAllCertificates } from "@/lib/api/certificates";

export async function GET() {
  try {
    const certificates = await getAllCertificates();

    return NextResponse.json(certificates, { status: 200 });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json({ error: "Failed to fetch certificates" }, { status: 500 });
  }
}
