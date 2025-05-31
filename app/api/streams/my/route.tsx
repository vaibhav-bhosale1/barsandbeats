import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    const session=await getServerSession();    
    const user=await prismaClient.user.findFirst({
            where:{
                email:session?.user?.email ?? ""
            }
        })
    
    
         if(!user){
            return NextResponse.json({
                message:"Unauthenticated"
            },{
                status:401
            })
        }
           const creatorId=req.nextUrl.searchParams.get("creatorId")
            const streams=await prismaClient.stream.findMany({
                where:{
                    userId:creatorId ?? ""
                },
                include:{
                    _count:{
                        select:{
                            upvotes:true
                        }
                    },
                    upvotes:{
                        where:{
                             userId:user.id
                        }
                       
                    }
                }
            })
        
          return NextResponse.json({
            streams: streams.map(({ _count, ...rest }) => ({
                ...rest,
                upvotes: _count.upvotes,
            })),
          });

}