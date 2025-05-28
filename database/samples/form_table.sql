-- SQL CREATE TABLE statement for form tables

-- User form table structure
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `status` ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
  `role` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_username` (`username`),
  UNIQUE KEY `unique_email` (`email`)
);

-- Product form table structure
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `description` TEXT NULL,
  `in_stock` TINYINT(1) DEFAULT 1,
  `tags` JSON NULL,
  `created_by` INT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

-- Generic form submissions table structure
CREATE TABLE `form_data` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `form_id` VARCHAR(100) NOT NULL,
  `data` JSON NOT NULL,
  `created_by` INT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_form_id` (`form_id`)
);

-- Sample INSERT statement for users
INSERT INTO `users` (
  `username`,
  `email`,
  `name`,
  `status`,
  `role`,
  `description`
) VALUES (
  'johndoe',
  'john@example.com',
  'John Doe',
  'active',
  'Admin',
  'System administrator'
);

-- Sample INSERT statement for products
INSERT INTO `products` (
  `product_name`,
  `price`,
  `category`,
  `description`,
  `in_stock`,
  `tags`,
  `created_by`
) VALUES (
  'Smartphone X',
  799.99,
  'Electronics',
  'Latest smartphone with advanced features',
  1,
  JSON_ARRAY('electronics', 'smartphone', 'new'),
  1
);

-- Sample INSERT statement for form_data
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for form_designs
-- ----------------------------
DROP TABLE IF EXISTS `form_designs`;
CREATE TABLE `form_designs`  (
                                 `id` int NOT NULL AUTO_INCREMENT,
                                 `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
                                 `fields_data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
                                 `settings_data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
                                 `crud_options_data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
                                 `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
                                 `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                 `table` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
                                 PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 0 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;