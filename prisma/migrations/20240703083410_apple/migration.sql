/*
  Warnings:

  - Made the column `Age` on table `customer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `customer` MODIFY `Age` VARCHAR(191) NOT NULL;
