// Add this temporary route to check raw DB data
// app/api/streams/debug/route.ts
import { NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";

export async function GET() {
  try {
    const allStreams = await prismaClient.stream.findMany();
    return NextResponse.json({ streams: allStreams });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}