import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { z } from "zod";
import { prismaClient } from "@/lib/db";

const playbackSchema = z.object({
  creatorId: z.string(),
  isPlaying: z.boolean(),
  currentTime: z.number(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const data = playbackSchema.parse(await req.json());

    // Update the creator's pause state in the database
    await prismaClient.user.update({
        where: { id: data.creatorId },
        data: {
            isPaused: !data.isPlaying,
            pausedAt: data.isPlaying ? null : data.currentTime,
            // If we are unpausing, adjust the start time
            playbackStartTime: data.isPlaying 
              ? new Date(new Date().getTime() - data.currentTime * 1000) 
              : undefined,
        }
    });

    // Broadcast the playback state to all viewers
    await pusherServer.trigger(`stream-${data.creatorId}`, 'playback-update', {
      isPlaying: data.isPlaying,
      currentTime: data.currentTime,
    });

    return NextResponse.json({ success: true, message: "Playback state updated" });

  } catch (e) {
    return NextResponse.json({ message: "Error updating playback state" }, { status: 500 });
  }
}