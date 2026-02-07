-- CreateEnum
CREATE TYPE "TutorStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- AlterTable
ALTER TABLE "TutorProfile" ADD COLUMN     "status" "TutorStatus" NOT NULL DEFAULT 'AVAILABLE';

-- DropEnum
DROP TYPE "Availability";
