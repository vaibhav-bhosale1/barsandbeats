import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    console.log("===== GET /api/streams STARTED =====");
    
    // 1. Get session
    const session = await getServerSession(authOptions);
    console.log("[Session] User email:", session?.user?.email);
    
    if (!session?.user?.email) {
      console.log("Authentication failed: No session or email");
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    // 2. Find user in DB
    const user = await prismaClient.user.findFirst({
      where: { email: session.user.email },
      select: { id: true }
    });
    
    console.log("[User] Found user ID:", user?.id);
    
    if (!user) {
      console.log("User not found in database");
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 3. Get creator ID
    const creatorId = req.nextUrl.searchParams.get("creatorId") || user.id;
    console.log("Using creator ID:", creatorId);

    // 4. Fetch streams with error handling
    let streams;
    try {
      streams = await prismaClient.stream.findMany({
        where: { 
          userId: creatorId,
          active: true 
        },
        include: {
          _count: { 
            select: { 
              upvotes: true 
            } 
          },
          upvotes: { 
            where: { 
              userId: user.id 
            },
            select: { 
              id: true 
            } 
          },
          user: { 
            select: { 
              email: true 
            } 
          }
        }
      });
    } catch (prismaError) {
      console.error("Prisma query error:", prismaError);
      return NextResponse.json({
        message: "Database query failed",
        error: prismaError.message
      }, { status: 500 });
    }

    console.log(`Found ${streams.length} streams`);

    // 5. Transform data safely
    const transformedStreams = streams.map(stream => {
      try {
        return {
          id: stream.id,
          title: stream.title || 'Untitled Stream',
          thumbnail: stream.bigImage || `https://img.youtube.com/vi/${stream.extractedId}/maxresdefault.jpg`,
          duration: '0:00',
          votes: stream._count?.upvotes || 0,
          submittedBy: stream.user?.email || 'Unknown',
          extractedId: stream.extractedId,
          haveUpvoted: (stream.upvotes?.length || 0) > 0
        };
      } catch (transformError) {
        console.error("Transform error for stream:", stream.id, transformError);
        return {
          id: stream.id,
          title: 'Error loading stream',
          thumbnail: '',
          duration: '0:00',
          votes: 0,
          submittedBy: 'System',
          extractedId: '',
          haveUpvoted: false
        };
      }
    });

    console.log("Successfully transformed streams");
    return NextResponse.json({ streams: transformedStreams });
    
  } catch (error) {
    console.error("TOP LEVEL ERROR:", error);
    return NextResponse.json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}