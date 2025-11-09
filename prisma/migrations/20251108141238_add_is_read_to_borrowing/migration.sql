-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Borrowing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "borrowedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATETIME NOT NULL,
    "returnedAt" DATETIME,
    "fineAmount" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'BORROWED',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Borrowing_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Borrowing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Borrowing" ("bookId", "borrowedAt", "dueDate", "fineAmount", "id", "returnedAt", "status", "userId") SELECT "bookId", "borrowedAt", "dueDate", "fineAmount", "id", "returnedAt", "status", "userId" FROM "Borrowing";
DROP TABLE "Borrowing";
ALTER TABLE "new_Borrowing" RENAME TO "Borrowing";
CREATE INDEX "Borrowing_userId_idx" ON "Borrowing"("userId");
CREATE INDEX "Borrowing_bookId_idx" ON "Borrowing"("bookId");
CREATE TABLE "new_Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reservedAt" DATETIME NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    CONSTRAINT "Reservation_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reservation" ("bookId", "expiresAt", "id", "reservedAt", "status", "userId") SELECT "bookId", "expiresAt", "id", "reservedAt", "status", "userId" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
CREATE INDEX "Reservation_userId_idx" ON "Reservation"("userId");
CREATE INDEX "Reservation_bookId_idx" ON "Reservation"("bookId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
