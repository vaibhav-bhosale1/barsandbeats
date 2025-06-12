import { NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

type Context = {
  params: {
    streamId: string;
  };
};

export async function DELETE(
  request: Request,
  context: Context
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthenticated" },
        { status: 403 }
      );
    }

    const { streamId } = context.params;

    const existingStream = await prismaClient.stream.findUnique({
      where: { id: streamId }
    });

    if (!existingStream) {
      return NextResponse.json(
        { message: "Stream not found" },
        { status: 404 }
      );
    }

    await prismaClient.upvote.deleteMany({
      where: { streamId }
    });

    await prismaClient.stream.delete({
      where: { id: streamId },
    });

    return NextResponse.json({
      message: "Stream deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting stream:", error);
    return NextResponse.json(
      { message: "Error deleting stream" },
      { status: 500 }
    );
  }
}
