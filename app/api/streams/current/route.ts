import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get('creatorId');

    if (!creatorId) {
      return NextResponse.json({ message: "creatorId is required" }, { status: 400 });
    }

    const creator = await prismaClient.user.findUnique({
      where: { id: creatorId },
      include: {
        currentlyPlaying: { // Include the related stream details
          include: {
            user: {
              select: { email: true }
            }
          }
        }
      }
    });

    if (!creator) {
      return NextResponse.json({ message: "Creator not found" }, { status: 404 });
    }

    let currentTimestamp = 0;
    if (creator.currentlyPlaying && creator.playbackStartTime) {
      if (creator.isPaused && creator.pausedAt) {
        currentTimestamp = creator.pausedAt;
      } else {
        // Calculate current time by finding difference between now and start time
        const startTime = new Date(creator.playbackStartTime).getTime();
        const now = new Date().getTime();
        currentTimestamp = (now - startTime) / 1000; // in seconds
      }
    }

    return NextResponse.json({
      currentVideo: creator.currentlyPlaying ? {
        id: creator.currentlyPlaying.extractedId,
        title: creator.currentlyPlaying.title,
        thumbnail: creator.currentlyPlaying.bigImage,
        streamId: creator.currentlyPlaying.id,
        submittedBy: creator.currentlyPlaying.user.email
      } : null,
      isPlaying: !creator.isPaused,
      timestamp: currentTimestamp,
    });

  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}