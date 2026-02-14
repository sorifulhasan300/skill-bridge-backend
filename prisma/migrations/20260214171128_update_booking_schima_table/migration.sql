/*
  Warnings:

  - A unique constraint covering the columns `[tutorId,slotId,day]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Booking_tutorId_studentId_startTime_key";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "day" TEXT NOT NULL DEFAULT 'temp-day',
ADD COLUMN     "slotId" TEXT NOT NULL DEFAULT 'temp-id',
ALTER COLUMN "endTime" SET DATA TYPE TEXT,
ALTER COLUMN "startTime" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_tutorId_slotId_day_key" ON "Booking"("tutorId", "slotId", "day");
