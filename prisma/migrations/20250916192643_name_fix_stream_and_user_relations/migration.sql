/*
  Warnings:

  - You are about to drop the column `smallImage` on the `Stream` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Stream` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[currentlyPlayingStreamId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `submittedById` to the `Stream` table without a default value. This is not possible if the table is not empty.
  - Made the column `creatorId` on table `Stream` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Stream" DROP CONSTRAINT "Stream_userId_fkey";

-- DropForeignKey
ALTER TABLE "Upvote" DROP CONSTRAINT "Upvote_userId_fkey";

-- AlterTable
ALTER TABLE "Stream" DROP COLUMN "smallImage",
DROP COLUMN "userId",
ADD COLUMN     "duration" TEXT NOT NULL DEFAULT '0:00',
ADD COLUMN     "submittedById" TEXT NOT NULL,
ALTER COLUMN "creatorId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_currentlyPlayingStreamId_key" ON "User"("currentlyPlayingStreamId");

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "Stream_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "Stream_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
