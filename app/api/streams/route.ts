import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    console.log("===== GET /api/streams STARTED =====");

    const session = await getServerSession(authOptions);
    console.log("[Session] User email:", session?.user?.email);

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

    // ✅ Get creatorId from query or default to user.id
    const creatorId = req.nextUrl.searchParams.get("creatorId") || user.id;
    console.log("[GET] Using creatorId:", creatorId);

    const streams = await prismaClient.stream.findMany({
      where: {
        userId: creatorId,
        active: true,
      },
      include: {
        _count: {
          select: {
            upvotes: true,
          },
        },
        upvotes: {
          where: {
            userId: user.id,
          },
          select: {
            id: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        upvotes: {
          _count: "desc",
        },
      },
    });

    const transformedStreams = streams.map((stream) => ({
      id: stream.id,
      title: stream.title || "Untitled Stream",
      thumbnail:
        stream.bigImage || `https://img.youtube.com/vi/${stream.extractedId}/maxresdefault.jpg`,
      duration: "0:00", // You can enhance this
      votes: stream._count?.upvotes || 0,
      submittedBy: stream.user?.email || "Unknown",
      extractedId: stream.extractedId,
      haveUpvoted: (stream.upvotes?.length || 0) > 0,
    }));

    return NextResponse.json({ streams: transformedStreams });
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("===== POST /api/streams STARTED =====");

    const session = await getServerSession(authOptions);
    console.log("[Session] User email:", session?.user?.email);

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
    console.log("[POST] Request body:", body);

    const { url, title, thumbnail, duration, creatorId } = body;

    if (!url) {
      return NextResponse.json({ message: "URL is required" }, { status: 400 });
    }

    const extractVideoId = (url: string) => {
      const regex =
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    const extractedId = extractVideoId(url);
    if (!extractedId) {
      return NextResponse.json({ message: "Invalid YouTube URL" }, { status: 400 });
    }

    // FIXED: Use the authenticated user's ID, not the creatorId from request
    // This ensures the video is added to the current user's queue
    const actualCreatorId = user.id; // Changed from: creatorId || user.id;
    console.log("[POST] Using actualCreatorId:", actualCreatorId);

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

    console.log("✅ Created stream:", stream.id);
    
    // ENHANCED: Return more complete stream data for immediate UI update
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
        duration: duration || "0:00"
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