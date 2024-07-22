/*
  Warnings:

  - You are about to drop the column `categoryId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `product` table. All the data in the column will be lost.
  - Made the column `productId` on table `image` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `subcategoryId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `Image_productId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_categoryId_fkey`;

-- AlterTable
ALTER TABLE `category` ADD COLUMN `imageUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `image` MODIFY `productId` INTEGER NOT NULL,
    MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `product` DROP COLUMN `categoryId`,
    DROP COLUMN `imageUrl`,
    ADD COLUMN `colors` JSON NULL,
    ADD COLUMN `sizes` JSON NULL,
    ADD COLUMN `subcategoryId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Subcategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Subcategory` ADD CONSTRAINT `Subcategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_subcategoryId_fkey` FOREIGN KEY (`subcategoryId`) REFERENCES `Subcategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
