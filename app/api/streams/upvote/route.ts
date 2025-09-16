import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "../../../../lib/auth";
import { pusherServer } from "@/lib/pusher";

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
    const stream = await prismaClient.stream.findUnique({
      where: { id: data.streamId },
    });
    if (!stream) {
      return NextResponse.json({ message: "Stream not found" }, { status: 404 });
    }

    await prismaClient.upvote.create({
      data: {
        userId: user.id,
        streamId: data.streamId,
      },
    });

    // ✨ FIX: Trigger event using the correct creatorId from the stream
    await pusherServer.trigger(`stream-${stream.creatorId}`, 'playlist-updated', {});

    return NextResponse.json({ success: true, message: "Upvoted successfully" });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
    }
    return NextResponse.json({ message: "Error while upvoting" }, { status: 500 });
  }
}