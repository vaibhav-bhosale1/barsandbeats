import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const playSchema = z.object({
  streamId: z.string().nullable(), // Allow null to signal that nothing is playing
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }
    
    const user = await prismaClient.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const data = playSchema.parse(await req.json());

    // Update the user's state in the database
    await prismaClient.user.update({
      where: { id: user.id },
      data: {
        currentlyPlayingStreamId: data.streamId,
        playbackStartTime: data.streamId ? new Date() : null,
        isPaused: false,
        pausedAt: null,
      },
    });

    // Notify all viewers that a new video is playing (or that the player is stopping)
    await pusherServer.trigger(`stream-${user.id}`, 'new-video-playing', {
      streamId: data.streamId
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}