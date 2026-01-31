/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `TutorProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TutorProfile_id_key" ON "TutorProfile"("id");
