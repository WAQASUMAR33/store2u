/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `product` table. All the data in the column will be lost.
  - Made the column `subcategoryId` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_subcategoryId_fkey`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `imageUrl`,
    MODIFY `subcategoryId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_subcategoryId_fkey` FOREIGN KEY (`subcategoryId`) REFERENCES `Subcategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
