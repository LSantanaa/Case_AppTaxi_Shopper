-- CreateTable
CREATE TABLE "TravelsHistory" (
    "id" SERIAL NOT NULL,
    "custumer_id" INTEGER NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "distance" INTEGER NOT NULL,
    "duration" TEXT NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "driver_name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TravelsHistory_pkey" PRIMARY KEY ("id")
);
