/*
 Navicat Premium Data Transfer

 Source Server         : Localhost All
 Source Server Type    : MySQL
 Source Server Version : 80404 (8.4.4)
 Source Host           : localhost:3306
 Source Schema         : WSOL

 Target Server Type    : MySQL
 Target Server Version : 80404 (8.4.4)
 File Encoding         : 65001

 Date: 16/06/2025 16:47:24
*/

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
  `table` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `crud_options_data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- Table structure for master_branch_detail
-- ----------------------------
DROP TABLE IF EXISTS `master_branch_detail`;
CREATE TABLE `master_branch_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `branch_id` varchar(255) NOT NULL,
  `branch_name_thai` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `branch_detail` varchar(255) NOT NULL,
  `manager` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `status` varchar(100) NOT NULL,
  `created_by` varchar(255) NOT NULL,
  `created_at` date NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `branch_type` varchar(255) NOT NULL,
  `branch_name_eng` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for master_category
-- ----------------------------
DROP TABLE IF EXISTS `master_category`;
CREATE TABLE `master_category` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` VARCHAR(255) NOT NULL,
  `status` VARCHAR(100) NOT NULL,
  `category_name_thai` VARCHAR(255) NOT NULL,
  `category_name_eng` VARCHAR(255) NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Sample INSERT statement
INSERT INTO `master_category` (
  `category_id`,
  `status`,
  `category_name_thai`,
  `category_name_eng`
) VALUES (
  ?,
  ?,
  ?,
  ?
);

-- ----------------------------
-- Table structure for master_sub_category
-- ----------------------------
DROP TABLE IF EXISTS `master_sub_category`;
CREATE TABLE `master_sub_category` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sub_category_id` VARCHAR(255) NOT NULL,
  `status` VARCHAR(100) NOT NULL,
  `sub_category_name_thai` VARCHAR(255) NOT NULL,
  `sub_category_name_eng` VARCHAR(255) NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Sample INSERT statement
INSERT INTO `master_sub_category` (
  `sub_category_id`,
  `status`,
  `sub_category_name_thai`,
  `sub_category_name_eng`
) VALUES (
  ?,
  ?,
  ?,
  ?
);

-- ----------------------------
-- Table structure for master_product
-- ----------------------------
DROP TABLE IF EXISTS `master_product`;
CREATE TABLE `master_product` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` VARCHAR(255) NOT NULL,
  `status` VARCHAR(100) NOT NULL,
  `product_name_thai` VARCHAR(255) NOT NULL,
  `product_name_eng` VARCHAR(255) NOT NULL,
  `normal_price` INT NOT NULL,
  `employee_price` INT NOT NULL,
  `tax` VARCHAR(50) NOT NULL,
  `sub_category` VARCHAR(100) NOT NULL,
  `stock` VARCHAR(50) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `total_stock` INT NOT NULL,
  `created_by` VARCHAR(255) NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Sample INSERT statement
INSERT INTO `master_product` (
  `product_id`,
  `status`,
  `product_name_thai`,
  `product_name_eng`,
  `normal_price`,
  `employee_price`,
  `tax`,
  `sub_category`,
  `stock`,
  `category`,
  `total_stock`,
  `created_by`
) VALUES (
  ?,
  ?,
  ?,
  ?,
  ?,
  ?,
  ?,
  ?,
  ?,
  ?,
  ?,
  ?
);


