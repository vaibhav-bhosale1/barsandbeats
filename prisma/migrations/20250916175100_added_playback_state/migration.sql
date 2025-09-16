-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentlyPlayingStreamId" TEXT,
ADD COLUMN     "isPaused" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pausedAt" DOUBLE PRECISION,
ADD COLUMN     "playbackStartTime" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currentlyPlayingStreamId_fkey" FOREIGN KEY ("currentlyPlayingStreamId") REFERENCES "Stream"("id") ON DELETE SET NULL ON UPDATE CASCADE;
