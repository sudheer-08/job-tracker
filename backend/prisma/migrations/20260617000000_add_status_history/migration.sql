-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "StatusHistory" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "fromStatus" "ApplicationStatus" NOT NULL,
    "toStatus" "ApplicationStatus" NOT NULL,
    "note" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StatusHistory_pkey" PRIMARY KEY ("id")
);

-- Migrate Application.status from TEXT to ApplicationStatus
ALTER TABLE "Application" ADD COLUMN "status_new" "ApplicationStatus";

UPDATE "Application"
SET "status_new" = CASE
    WHEN UPPER("status") IN ('APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN')
        THEN UPPER("status")::"ApplicationStatus"
    WHEN LOWER("status") IN ('pending', 'applied') THEN 'APPLIED'::"ApplicationStatus"
    WHEN LOWER("status") LIKE '%screen%' THEN 'SCREENING'::"ApplicationStatus"
    WHEN LOWER("status") LIKE '%interview%' THEN 'INTERVIEW'::"ApplicationStatus"
    WHEN LOWER("status") LIKE '%offer%' THEN 'OFFER'::"ApplicationStatus"
    WHEN LOWER("status") LIKE '%reject%' THEN 'REJECTED'::"ApplicationStatus"
    WHEN LOWER("status") LIKE '%withdraw%' THEN 'WITHDRAWN'::"ApplicationStatus"
    ELSE 'APPLIED'::"ApplicationStatus"
END;

ALTER TABLE "Application" DROP COLUMN "status";
ALTER TABLE "Application" RENAME COLUMN "status_new" TO "status";
ALTER TABLE "Application" ALTER COLUMN "status" SET NOT NULL;
ALTER TABLE "Application" ALTER COLUMN "status" SET DEFAULT 'APPLIED';

-- AddForeignKey
ALTER TABLE "StatusHistory" ADD CONSTRAINT "StatusHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
