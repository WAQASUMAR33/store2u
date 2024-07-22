/*
  Warnings:

  - You are about to drop the column `Educational_Actitvity` on the `customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `customer` DROP COLUMN `Educational_Actitvity`,
    ADD COLUMN `Educational_Activity` VARCHAR(191) NULL;
