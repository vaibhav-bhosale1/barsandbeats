import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

// GET function remains the same...
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }
    const user = await prismaClient.user.findFirst({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const creatorId = req.nextUrl.searchParams.get("creatorId") || user.id;
    const streams = await prismaClient.stream.findMany({
      where: { userId: creatorId, active: true, },
      include: {
        _count: { select: { upvotes: true, }, },
        upvotes: { where: { userId: user.id, }, select: { id: true, }, },
        user: { select: { email: true, }, },
      },
      orderBy: { upvotes: { _count: "desc", }, },
    });
    const transformedStreams = streams.map((stream) => ({
      id: stream.id,
      title: stream.title || "Untitled Stream",
      thumbnail: stream.bigImage || `https://img.youtube.com/vi/${stream.extractedId}/maxresdefault.jpg`,
      duration: "0:00",
      votes: stream._count?.upvotes || 0,
      submittedBy: stream.user?.email || "Unknown",
      extractedId: stream.extractedId,
      haveUpvoted: (stream.upvotes?.length || 0) > 0,
    }));
    return NextResponse.json({ streams: transformedStreams });
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json( { message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error", }, { status: 500 } );
  }
}


export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }
    const user = await prismaClient.user.findFirst({
      where: { email: session.user.email },
      select: { id: true },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const body = await req.json();
    const { url, title, thumbnail, creatorId } = body;
    if (!url) {
      return NextResponse.json({ message: "URL is required" }, { status: 400 });
    }
    const extractVideoId = (url: string) => {
      const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };
    const extractedId = extractVideoId(url);
    if (!extractedId) {
      return NextResponse.json({ message: "Invalid YouTube URL" }, { status: 400 });
    }
    const actualCreatorId = creatorId || user.id;
    const existingStream = await prismaClient.stream.findFirst({
      where: {
        extractedId,
        userId: actualCreatorId,
        active: true,
      },
    });
    if (existingStream) {
      return NextResponse.json({ message: "This video is already in the queue" }, { status: 400 });
    }
    const stream = await prismaClient.stream.create({
      data: {
        userId: actualCreatorId,
        url,
        extractedId,
        title: title || "Untitled Stream",
        bigImage: thumbnail || `https://img.youtube.com/vi/${extractedId}/maxresdefault.jpg`,
        active: true,
        type: "Youtube",
      },
    });

    // ✨ Trigger a Pusher event
    await pusherServer.trigger(`stream-${actualCreatorId}`, 'playlist-updated', {
      message: 'A new song has been added.'
    });

    return NextResponse.json({
      message: "Stream added successfully",
      stream: {
        id: stream.id,
        title: stream.title,
        thumbnail: stream.bigImage,
        extractedId: stream.extractedId,
        votes: 0,
        haveUpvoted: false,
        submittedBy: session.user.email,
      },
    });
  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}