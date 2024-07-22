/*
  Warnings:

  - You are about to drop the column `NTN_N0` on the `customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `customer` DROP COLUMN `NTN_N0`,
    ADD COLUMN `NTN_No` VARCHAR(191) NULL;
