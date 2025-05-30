import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import { prismaClient } from "@/lib/db";
import youtubesearchapi from "youtube-search-api";
const CreateStreamSchema=z.object({
    creatorId:z.string(),
    url:z.string()
})

const YT_REGEX=/^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/ 

export async function POST(req: NextRequest){
    try{
         const data=CreateStreamSchema.parse(await req.json());
         const isYt=data.url.match(YT_REGEX)

         if(!isYt){
             return NextResponse.json({
                messages:"Wrong URL"
            },{
                status:411
            })
         }

         const extractedId=data.url.split("?v=")[1]
         const res=await youtubesearchapi.GetVideoDetails(extractedId)
         console.log(res.title);
         console.log(res.thumbnail.thumbnails);
         console.log(JSON.stringify (res.thumbnail.thumbnails));

         const stream=await prismaClient.stream.create({
            data:{
                userId:data.creatorId,
                url:data.url,
                extractedId,
                type:"Youtube"
            }
         })

         return NextResponse.json({
            message:"Added stream",
            id:stream.id
         })
    }catch(e){
        return NextResponse.json({
            messages:"Error while adding a stream"
        },{
            status:411
        })
    }
  
    
}


export async function GET(req:NextRequest){
    const creatorId=req.nextUrl.searchParams.get("creatorId")
    const streams=await prismaClient.stream.findMany({
        where:{
            userId:creatorId ?? ""
        }
    })

    return NextResponse.json({
        streams
    })
}