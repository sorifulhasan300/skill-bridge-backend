/*
  Warnings:

  - You are about to drop the column `status` on the `TutorProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TutorProfile" DROP COLUMN "status",
ADD COLUMN     "availability" "TutorStatus" NOT NULL DEFAULT 'AVAILABLE';
