-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "toolName" TEXT NOT NULL,
    "departmentOwner" TEXT NOT NULL,
    "renewalDate" TIMESTAMP(3) NOT NULL,
    "monthlyCost" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);
