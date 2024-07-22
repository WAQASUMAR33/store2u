-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_subcategoryId_fkey`;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `imageUrl` VARCHAR(191) NULL,
    MODIFY `subcategoryId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_subcategoryId_fkey` FOREIGN KEY (`subcategoryId`) REFERENCES `Subcategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
