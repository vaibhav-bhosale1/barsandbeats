import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    // 1. Find and delete the currently playing stream, if one exists
    if (user.currentlyPlayingStreamId) {
      await prismaClient.stream.delete({
        where: { id: user.currentlyPlayingStreamId }
      }).catch(err => console.log("Tried to delete an already deleted stream, which is okay."));
    }

    // 2. Get the remaining streams, ordered by vote count, to find the next one
    const remainingStreams = await prismaClient.stream.findMany({
      where: { creatorId: user.id },
      orderBy: { upvotes: { _count: 'desc' } },
      take: 1
    });
    const nextStream = remainingStreams[0] || null;

    // 3. Update the user's state to the next video (or null if the queue is empty)
    await prismaClient.user.update({
      where: { id: user.id },
      data: {
        currentlyPlayingStreamId: nextStream ? nextStream.id : null,
        playbackStartTime: nextStream ? new Date() : null,
        isPaused: false,
        pausedAt: null,
      },
    });

    // 4. Notify all clients about the change
    await pusherServer.trigger(`stream-${user.id}`, 'new-video-playing', {});
    await pusherServer.trigger(`stream-${user.id}`, 'playlist-updated', {});

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Play Next API Error:", e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}