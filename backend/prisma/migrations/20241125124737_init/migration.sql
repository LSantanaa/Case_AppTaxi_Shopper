-- CreateTable
CREATE TABLE "TravelsHistory" (
    "id" SERIAL NOT NULL,
    "custumer_id" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "distance" INTEGER NOT NULL,
    "duration" TEXT NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "driver_name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TravelsHistory_pkey" PRIMARY KEY ("id")
);
