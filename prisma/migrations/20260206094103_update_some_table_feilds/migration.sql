/*
  Warnings:

  - You are about to drop the column `department` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `sessionDate` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `sessionTime` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `availability` on the `TutorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `averageRating` on the `TutorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `expertise` on the `TutorProfile` table. All the data in the column will be lost.
  - You are about to drop the column `totalStudents` on the `TutorProfile` table. All the data in the column will be lost.
  - You are about to drop the `Categories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tutorId,studentId,startTime]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tutorId,studentId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'COMPLETED', 'CANCELLED');

-- DropIndex
DROP INDEX "TutorProfile_id_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "department",
DROP COLUMN "price",
DROP COLUMN "sessionDate",
DROP COLUMN "sessionTime",
DROP COLUMN "subject",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
ADD COLUMN     "studentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "text",
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "rating" INTEGER NOT NULL,
ADD COLUMN     "studentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TutorProfile" DROP COLUMN "availability",
DROP COLUMN "averageRating",
DROP COLUMN "expertise",
DROP COLUMN "totalStudents";

-- DropTable
DROP TABLE "Categories";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TutorCategory" (
    "tutorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "TutorCategory_pkey" PRIMARY KEY ("tutorId","categoryId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_tutorId_studentId_startTime_key" ON "Booking"("tutorId", "studentId", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "Review_tutorId_studentId_key" ON "Review"("tutorId", "studentId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorCategory" ADD CONSTRAINT "TutorCategory_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "TutorProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TutorCategory" ADD CONSTRAINT "TutorCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
