import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

// --- GET Request Handler (for fetching streams) ---
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const creatorId = searchParams.get("creatorId");

    if (!creatorId) {
      return NextResponse.json({ message: "Creator ID is required" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const user = session ? await prismaClient.user.findUnique({ where: { email: session?.user?.email! } }) : null;

    const streams = await prismaClient.stream.findMany({
      where: { creatorId: creatorId },
      include: {
        _count: { select: { upvotes: true } },
        upvotes: user ? { where: { userId: user.id } } : false,
        submittedBy: { select: { email: true } },
      },
      orderBy: { upvotes: { _count: "desc" } },
    });

    const transformedStreams = streams.map((stream) => ({
      id: stream.id,
      title: stream.title,
      thumbnail: stream.bigImage,
      duration: stream.duration,
      votes: stream._count.upvotes,
      submittedBy: stream.submittedBy.email,
      extractedId: stream.extractedId,
      haveUpvoted: (stream.upvotes?.length || 0) > 0,
    }));

    return NextResponse.json({ streams: transformedStreams });
  } catch (error) {
    console.error("ERROR FETCHING STREAMS:", error);
    return NextResponse.json({ message: "Error fetching streams" }, { status: 500 });
  }
}

// --- POST Request Handler (for adding a song) ---
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    const submittingUser = await prismaClient.user.findUnique({ where: { email: session.user.email } });
    if (!submittingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { url, title, thumbnail, duration, creatorId } = body;

    const extractVideoId = (url: string) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        return url.match(regex)?.[1] || null;
    };
    const extractedId = extractVideoId(url);
    if (!extractedId) {
      return NextResponse.json({ message: "Invalid YouTube URL" }, { status: 400 });
    }

    // Use the new, clear schema fields
    await prismaClient.stream.create({
      data: {
        creatorId: creatorId,
        submittedById: submittingUser.id,
        url,
        extractedId,
        title: title || "Untitled Video",
        bigImage: thumbnail || `https://img.youtube.com/vi/${extractedId}/maxresdefault.jpg`,
        duration: duration || "0:00",
        active: true,
        type: "Youtube",
      },
    });

    await pusherServer.trigger(`stream-${creatorId}`, 'playlist-updated', {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ADD TO QUEUE ERROR:", error);
    return NextResponse.json({ message: "Internal server error while adding song" }, { status: 500 });
  }
}