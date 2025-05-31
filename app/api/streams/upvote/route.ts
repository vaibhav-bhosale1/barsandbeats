import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "../../../../lib/auth";

const UpvoteSchema = z.object({
  streamId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const user = await prismaClient.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const data = UpvoteSchema.parse(await req.json());

    // Check if stream exists
    const stream = await prismaClient.stream.findUnique({
      where: { id: data.streamId },
    });

    if (!stream) {
      return NextResponse.json({ message: "Stream not found" }, { status: 404 });
    }

    // Check if user already upvoted this stream
    const existingUpvote = await prismaClient.upvote.findUnique({
      where: {
        userId_streamId: {
          userId: user.id,
          streamId: data.streamId,
        },
      },
    });

    if (existingUpvote) {
      return NextResponse.json({ message: "Already upvoted" }, { status: 400 });
    }

    // Create the upvote
    await prismaClient.upvote.create({
      data: {
        userId: user.id,
        streamId: data.streamId,
      },
    });

    return NextResponse.json({ success: true, message: "Upvoted successfully" });

  } catch (e) {
    console.error("Upvote error:", e);
    
    if (e instanceof z.ZodError) {
      return NextResponse.json({ 
        message: "Invalid request data",
        errors: e.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      message: "Error while upvoting" 
    }, { status: 500 });
  }
}