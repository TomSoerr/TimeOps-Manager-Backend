-- CreateTable
CREATE TABLE "RunningEntry" (
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "startTimeUtc" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "RunningEntry_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "RunningEntry" ADD CONSTRAINT "RunningEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunningEntry" ADD CONSTRAINT "RunningEntry_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
