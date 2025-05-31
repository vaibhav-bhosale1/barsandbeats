import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth" // Make sure this path is correct

export async function GET(req: NextRequest) {
    try {
        console.log('My route called');
        
        const session = await getServerSession(authOptions);
        console.log('Session:', session);
        
        if (!session?.user?.email) {
            console.log('No session or email');
            return NextResponse.json({
                message: "Unauthenticated"
            }, {
                status: 401
            });
        }
        
        const user = await prismaClient.user.findFirst({
            where: {
                email: session.user.email
            }
        });
        
        console.log('User found:', user);

        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, {
                status: 401
            });
        }

        // Get creatorId from query params, or default to current user
        const creatorId = req.nextUrl.searchParams.get("creatorId") || user.id;
        console.log('Creator ID:', creatorId);
        
        const streams = await prismaClient.stream.findMany({
            where: {
                userId: creatorId
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
                    }
                },
                user: {
                    select: {
                        email: true
                    }
                }
            },
            orderBy: [
                {
                    upvotes: {
                        _count: 'desc'
                    }
                }
            ]
        });

        console.log('Raw streams from DB:', streams);

        const transformedStreams = streams.map(({ _count, upvotes, user, ...rest }) => ({
            ...rest,
            upvotes: _count.upvotes,
            haveUpvoted: upvotes.length > 0,
            submittedBy: user.email
        }));

        console.log('Transformed streams:', transformedStreams);

        return NextResponse.json({
            streams: transformedStreams
        });

    } catch (error) {
        console.error('Error in my route:', error);
        return NextResponse.json({
            message: "Internal server error",
           
        }, {
            status: 500
        });
    }
}