/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payment" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "transaction_amount" REAL NOT NULL,
    "payer" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "message" TEXT NOT NULL DEFAULT ' ',
    "payment_code" TEXT NOT NULL,
    "base64_payment_code" TEXT NOT NULL
);
INSERT INTO "new_Payment" ("base64_payment_code", "created_at", "id", "payer", "payment_code", "status", "to", "transaction_amount") SELECT "base64_payment_code", "created_at", "id", "payer", "payment_code", "status", "to", "transaction_amount" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "wallet" REAL NOT NULL DEFAULT 0
);
INSERT INTO "new_User" ("email", "id", "identifier", "password", "wallet") SELECT "email", "id", "identifier", "password", "wallet" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
