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
        currentlyPlaying: {
          // ✨ FIX: Explicitly include the 'submittedBy' user's details
          include: {
            submittedBy: {
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
        const startTime = new Date(creator.playbackStartTime).getTime();
        const now = new Date().getTime();
        currentTimestamp = (now - startTime) / 1000;
      }
    }
    
    // Check if currentlyPlaying and submittedBy exist before trying to access them
    const currentVideoData = creator.currentlyPlaying && creator.currentlyPlaying.submittedBy
      ? {
          id: creator.currentlyPlaying.extractedId,
          title: creator.currentlyPlaying.title,
          thumbnail: creator.currentlyPlaying.bigImage,
          duration: creator.currentlyPlaying.duration,
          streamId: creator.currentlyPlaying.id,
          submittedBy: creator.currentlyPlaying.submittedBy.email,
        }
      : null;

    return NextResponse.json({
      currentVideo: currentVideoData,
      isPlaying: !creator.isPaused,
      timestamp: currentTimestamp,
    });

  } catch (error) {
    console.error("ERROR FETCHING CURRENT STREAM:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}