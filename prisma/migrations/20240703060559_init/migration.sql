-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Full_Name` VARCHAR(191) NOT NULL,
    `Passport_No` VARCHAR(191) NOT NULL,
    `CNIC_No` VARCHAR(191) NOT NULL,
    `Father_Name` VARCHAR(191) NOT NULL,
    `Nationality` VARCHAR(191) NOT NULL,
    `City` VARCHAR(191) NOT NULL,
    `Address` VARCHAR(191) NOT NULL,
    `Phone_No1` VARCHAR(191) NOT NULL,
    `Phone_No2` VARCHAR(191) NULL,
    `Gender` VARCHAR(191) NOT NULL,
    `Age` INTEGER NULL,
    `Email` VARCHAR(191) NULL,
    `Interested_Country` VARCHAR(191) NULL,
    `Educational_Actitvity` VARCHAR(191) NULL,
    `List_degree_completed` DATETIME(3) NULL,
    `Marital_Status` VARCHAR(191) NULL,
    `NTN_N0` VARCHAR(191) NULL,
    `Employment_Status` VARCHAR(191) NULL,
    `Parents_CNIC_No` VARCHAR(191) NULL,
    `Birth_Place` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `branch` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AdminUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Branches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
