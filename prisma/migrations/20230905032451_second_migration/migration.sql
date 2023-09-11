-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "ownerID" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_ownerID_fkey" FOREIGN KEY ("ownerID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
