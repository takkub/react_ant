CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `username` VARCHAR(50) NOT NULL,
  `role` VARCHAR(50) NOT NULL,
  `department` VARCHAR(100) NULL,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `lastLogin` DATETIME NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `permissions` JSON NULL,
  `profileImage` VARCHAR(255) NULL,
  `phone` VARCHAR(20) NULL,
  `address` TEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  INDEX `role_idx` (`role` ASC),
  INDEX `status_idx` (`status` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data insertion based on the provided user data
INSERT INTO `users` 
(`key`, `id`, `name`, `email`, `username`, `role`, `department`, `status`, 
 `lastLogin`, `createdAt`, `updatedAt`, `permissions`, `profileImage`, `phone`, `address`)
VALUES
('1', 1, 'John Doe', 'john.doe@example.com', 'johndoe', 'admin', 'IT', 'active',
 '2023-10-15 08:30:00', '2023-01-10 09:00:00', '2023-09-28 14:45:00', 
 JSON_ARRAY('read', 'write', 'delete'), 'https://randomuser.me/api/portraits/men/1.jpg', 
 '+66812345678', '123 Bangkok Street, Silom, Bangkok 10500'),

('2', 2, 'Jane Smith', 'jane.smith@example.com', 'janesmith', 'manager', 'Marketing', 'active',
 '2023-10-14 15:20:00', '2023-02-15 10:30:00', '2023-09-20 11:15:00',
 JSON_ARRAY('read', 'write'), 'https://randomuser.me/api/portraits/women/2.jpg',
 '+66823456789', '456 Chiang Mai Road, Nimman, Chiang Mai 50200'),

('3', 3, 'David Johnson', 'david.johnson@example.com', 'davidj', 'user', 'Finance', 'inactive',
 '2023-09-30 12:45:00', '2023-03-05 08:15:00', '2023-10-01 09:30:00',
 JSON_ARRAY('read'), 'https://randomuser.me/api/portraits/men/3.jpg',
 '+66834567890', '789 Phuket Beach, Patong, Phuket 83150'),

('4', 4, 'Sarah Lee', 'sarah.lee@example.com', 'sarahlee', 'manager', 'Sales', 'active',
 '2023-10-16 09:10:00', '2023-04-20 14:00:00', '2023-10-10 16:45:00',
 JSON_ARRAY('read', 'write'), 'https://randomuser.me/api/portraits/women/4.jpg',
 '+66845678901', '101 Sukhumvit Road, Asoke, Bangkok 10110'),

('5', 5, 'Michael Wang', 'michael.wang@example.com', 'michaelw', 'developer', 'IT', 'active',
 '2023-10-15 18:30:00', '2023-05-12 11:30:00', '2023-09-15 13:20:00',
 JSON_ARRAY('read', 'write', 'delete'), 'https://randomuser.me/api/portraits/men/5.jpg',
 '+66856789012', '222 Hua Hin Beach Road, Hua Hin, Prachuap Khiri Khan 77110'),

('6', 6, 'Emily Chen', 'emily.chen@example.com', 'emilyc', 'designer', 'Creative', 'active',
 '2023-10-14 10:45:00', '2023-06-08 09:15:00', '2023-10-05 14:30:00',
 JSON_ARRAY('read', 'write'), 'https://randomuser.me/api/portraits/women/6.jpg',
 '+66867890123', '333 Pattaya Beach Road, Pattaya, Chonburi 20150'),

('7', 7, 'Robert Kim', 'robert.kim@example.com', 'robertk', 'analyst', 'Finance', 'inactive',
 '2023-09-20 16:15:00', '2023-07-25 08:45:00', '2023-09-28 11:10:00',
 JSON_ARRAY('read'), 'https://randomuser.me/api/portraits/men/7.jpg',
 '+66878901234', '444 Khao San Road, Banglamphu, Bangkok 10200'),

('8', 8, 'Olivia Martinez', 'olivia.martinez@example.com', 'oliviam', 'hr', 'Human Resources', 'active',
 '2023-10-16 11:00:00', '2023-08-03 13:30:00', '2023-10-12 09:45:00',
 JSON_ARRAY('read', 'write', 'delete'), 'https://randomuser.me/api/portraits/women/8.jpg',
 '+66889012345', '555 Ayutthaya Historical Park, Ayutthaya 13000'),

('9', 9, 'William Brown', 'william.brown@example.com', 'williambrown', 'user', 'Operations', 'active',
 '2023-10-13 14:20:00', '2023-09-10 10:00:00', '2023-10-08 15:30:00',
 JSON_ARRAY('read'), 'https://randomuser.me/api/portraits/men/9.jpg',
 '+66890123456', '666 Doi Suthep Road, Chiang Mai 50200'),

('10', 10, 'Sophia Garcia', 'sophia.garcia@example.com', 'sophiag', 'manager', 'Marketing', 'active',
 '2023-10-15 09:45:00', '2023-10-01 08:00:00', '2023-10-14 12:15:00',
 JSON_ARRAY('read', 'write'), 'https://randomuser.me/api/portraits/women/10.jpg',
 '+66901234567', '777 Samui Beach Road, Koh Samui, Surat Thani 84140');
