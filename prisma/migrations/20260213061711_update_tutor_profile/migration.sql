-- AlterTable
ALTER TABLE "TutorProfile" ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "experience" INTEGER,
ADD COLUMN     "timeSlots" JSONB,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0;
