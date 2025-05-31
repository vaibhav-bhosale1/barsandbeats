// app/api/db-test/route.ts
import { NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";

export async function GET() {
  try {
    console.log("Testing database connection...");
    
    // Test simple query
    const userCount = await prismaClient.user.count();
    console.log("User count:", userCount);
    
    // Test stream query
    const streamCount = await prismaClient.stream.count();
    console.log("Stream count:", streamCount);
    
    return NextResponse.json({
      success: true,
      userCount,
      streamCount
    });
  } catch (error) {
    console.error("Database test failed:", error);
    return NextResponse.json({
      success: false,

    }, { status: 500 });
  }
}