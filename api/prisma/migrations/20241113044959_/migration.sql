/*
  Warnings:

  - You are about to drop the column `cover_letter_url` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `portfolio_url` on the `JobApplication` table. All the data in the column will be lost.
  - You are about to drop the column `applications_count` on the `JobListing` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `JobListing` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `JobListing` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `JobCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobProviderProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JobSeekerProfile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `JobListing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `education` to the `JobListing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience` to the `JobListing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobApplicationId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "JobApplication" DROP CONSTRAINT "JobApplication_jobId_fkey";

-- DropForeignKey
ALTER TABLE "JobApplication" DROP CONSTRAINT "JobApplication_seekerId_fkey";

-- DropForeignKey
ALTER TABLE "JobListing" DROP CONSTRAINT "JobListing_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "JobListing" DROP CONSTRAINT "JobListing_providerId_fkey";

-- DropForeignKey
ALTER TABLE "JobProviderProfile" DROP CONSTRAINT "JobProviderProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "JobSeekerProfile" DROP CONSTRAINT "JobSeekerProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- AlterTable
ALTER TABLE "JobApplication" DROP COLUMN "cover_letter_url",
DROP COLUMN "portfolio_url",
ALTER COLUMN "jobId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "JobListing" DROP COLUMN "applications_count",
DROP COLUMN "categoryId",
DROP COLUMN "location",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "education" TEXT NOT NULL,
ADD COLUMN     "experience" TEXT NOT NULL,
ADD COLUMN     "profileId" INTEGER;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "createdAt",
DROP COLUMN "read",
DROP COLUMN "title",
DROP COLUMN "type",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "jobApplicationId" INTEGER NOT NULL,
ADD COLUMN     "jobId" INTEGER NOT NULL,
ADD COLUMN     "providerId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "JobCategory";

-- DropTable
DROP TABLE "JobProviderProfile";

-- DropTable
DROP TABLE "JobSeekerProfile";

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "skills" JSONB,
    "education" TEXT,
    "phone_number" TEXT,
    "jobtitle" TEXT,
    "experience" TEXT,
    "jobtype" TEXT,
    "resume" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobListing" ADD CONSTRAINT "JobListing_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobListing" ADD CONSTRAINT "JobListing_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_seekerId_fkey" FOREIGN KEY ("seekerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "JobListing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
