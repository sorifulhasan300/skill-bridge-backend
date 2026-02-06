/*
  Warnings:

  - You are about to drop the column `studentId` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the `StudentProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_studentId_fkey";

-- DropForeignKey
ALTER TABLE "StudentProfile" DROP CONSTRAINT "StudentProfile_userId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "studentId";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "studentId";

-- DropTable
DROP TABLE "StudentProfile";

-- CreateTable
CREATE TABLE "Categories" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);
