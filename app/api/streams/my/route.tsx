import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
        }
        
        const user = await prismaClient.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 401 });
        }

        // The "my" route should always fetch streams created by the logged-in user.
        const creatorId = user.id;
        
        const streams = await prismaClient.stream.findMany({
            where: {
                // ✨ FIX: Use 'creatorId' instead of the old 'userId'
                creatorId: creatorId 
            },
            include: {
                _count: {
                    select: { upvotes: true }
                },
                upvotes: {
                    where: { userId: user.id }
                },
                // ✨ FIX: Use the correct relation name 'submittedBy'
                submittedBy: {
                    select: { email: true }
                }
            },
            orderBy: {
                upvotes: { _count: 'desc' }
            }
        });

        const transformedStreams = streams.map(({ _count, upvotes, submittedBy, ...rest }) => ({
            ...rest,
            votes: _count.upvotes,
            haveUpvoted: upvotes.length > 0,
            // ✨ FIX: Access the email from the correct 'submittedBy' object
            submittedBy: submittedBy.email 
        }));

        return NextResponse.json({
            streams: transformedStreams
        });

    } catch (error) {
        console.error('Error in my route:', error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}