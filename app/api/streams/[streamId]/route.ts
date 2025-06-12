import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ streamId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthenticated" },
        { status: 403 }
      );
    }

    // Await the params since it's now a Promise
    const { streamId } = await params;
    
    // Check if stream exists
    const existingStream = await prismaClient.stream.findUnique({
      where: { id: streamId }
    });

    if (!existingStream) {
      return NextResponse.json(
        { message: "Stream not found" },
        { status: 404 }
      );
    }

    // Delete upvotes first (cascade delete)
    await prismaClient.upvote.deleteMany({
      where: { streamId }
    });

    // Then delete the stream
    await prismaClient.stream.delete({
      where: { id: streamId },
    });
    
    return NextResponse.json({ 
      message: "Stream deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting stream:", error);
    return NextResponse.json(
      { message: "Error deleting stream" },
      { status: 500 }
    );
  }
}