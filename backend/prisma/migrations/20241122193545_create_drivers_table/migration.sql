-- CreateTable
CREATE TABLE "Drivers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "car" TEXT NOT NULL,
    "assessment" DOUBLE PRECISION NOT NULL,
    "rateKM" DOUBLE PRECISION NOT NULL,
    "minKM" INTEGER NOT NULL,

    CONSTRAINT "Drivers_pkey" PRIMARY KEY ("id")
);
