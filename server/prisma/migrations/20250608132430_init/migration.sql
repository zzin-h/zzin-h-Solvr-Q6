-- CreateTable
CREATE TABLE "SleepEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "sleepTime" DATETIME NOT NULL,
    "wakeTime" DATETIME NOT NULL,
    "quality" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
