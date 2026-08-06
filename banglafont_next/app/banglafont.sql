-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 06, 2026 at 04:00 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `banglafont`
--

-- --------------------------------------------------------

--
-- Table structure for table `adminuser`
--

CREATE TABLE `adminuser` (
  `id` int(11) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(200) NOT NULL,
  `name` varchar(200) NOT NULL,
  `role` enum('ADMIN','SUPERADMIN') NOT NULL DEFAULT 'ADMIN',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `adminuser`
--

INSERT INTO `adminuser` (`id`, `email`, `password`, `name`, `role`, `createdAt`, `updatedAt`) VALUES
(1, 'admin@fontbd.com', '$2b$10$Do/o.PMiwV8fBGUhEHO4KOAeBJ4Jg44DxQJe51rm/S4LdLuolyGuu', 'Admin', 'SUPERADMIN', '2026-07-30 10:47:35.563', '2026-07-30 10:47:35.563');

-- --------------------------------------------------------

--
-- Table structure for table `designer`
--

CREATE TABLE `designer` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `photo` varchar(500) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `socialLinks` text DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `banglaName` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `designer`
--

INSERT INTO `designer` (`id`, `name`, `slug`, `photo`, `bio`, `socialLinks`, `email`, `createdAt`, `updatedAt`, `banglaName`) VALUES
(1, 'Jayed Ahsan Sad', 'jayed-ahsan-sad', '/uploads/images/placeholder-designer.jpg', 'Founder of Codepotro', NULL, NULL, '2026-07-30 10:47:35.612', '2026-08-06 12:32:54.401', 'জায়েদ আহসান সাদ'),
(2, 'Ahmad Tofayel', 'ahmad-tofayel', '/uploads/images/placeholder-designer.jpg', 'বাংলা টাইপোগ্রাফি ডিজাইনার', NULL, NULL, '2026-07-30 10:47:35.620', '2026-08-06 12:32:54.404', 'আহমদ তোফায়েল'),
(3, 'Masuda Akter Lima', 'masuda-akter-lima', '/uploads/images/placeholder-designer.jpg', 'Typography Designer', NULL, NULL, '2026-07-30 10:47:35.622', '2026-08-06 12:32:54.409', 'মাসুদা আক্তার লিমা'),
(4, 'Codepotro Fonts', 'codepotro-fonts', NULL, 'বাংলা ফন্ট ডেভেলপমেন্ট টিম', NULL, NULL, '2026-07-30 10:47:35.625', '2026-08-06 12:32:54.450', 'কোডপত্র ফন্টস'),
(5, 'Jyotish Sonowal', 'jyotish-sonowal', '/uploads/images/jyotish-sonowal.png', 'Jyotish Sonowal is a Graphic Design graduate from the National Institute of Design, Ahmedabad. While working on his final (diploma) project, he developed a keen interest in typeface design.\n\nHe joined ITF in 2011 while working on his maiden type design project and has been designing and developing fonts since 2012 as a full-time Type designer. He specializes in Bengali, Assamese and Odiya scripts.\n\nLoves scribbling with calligraphy pens, cooking and travelling during his free time.', '', '', '2026-08-06 08:45:29.563', '2026-08-06 08:45:29.563', NULL),
(7, 'Black Foundry', 'black-foundry', '', 'Black Foundry, a type design foundry based in Paris, France.', '', '', '2026-08-06 09:38:45.996', '2026-08-06 09:38:45.996', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `developer`
--

CREATE TABLE `developer` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `photo` varchar(500) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `socialLinks` text DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `banglaName` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `developer`
--

INSERT INTO `developer` (`id`, `name`, `slug`, `photo`, `bio`, `socialLinks`, `email`, `createdAt`, `updatedAt`, `banglaName`) VALUES
(1, 'Ehsan Al Mahfuz', 'ehsan-al-mahfuz', '/uploads/images/placeholder-developer.jpg', 'Font Developer', NULL, NULL, '2026-07-30 10:47:35.651', '2026-08-06 12:32:54.462', 'এহসান আল মাহফুজ'),
(2, 'Codepotro Dev', 'codepotro-dev', NULL, 'Software Development Team', NULL, NULL, '2026-07-30 10:47:35.653', '2026-08-06 12:32:54.463', 'কোডপত্র দেব');

-- --------------------------------------------------------

--
-- Table structure for table `download`
--

CREATE TABLE `download` (
  `id` int(11) NOT NULL,
  `fontId` int(11) NOT NULL,
  `ipHash` varchar(64) DEFAULT NULL,
  `userAgent` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `font`
--

CREATE TABLE `font` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `fontType` enum('FREE','PREMIUM') NOT NULL DEFAULT 'FREE',
  `style` enum('HANDWRITING','HEADING','PARAGRAPH','STYLISH','GENERAL') NOT NULL DEFAULT 'GENERAL',
  `encoding` text NOT NULL DEFAULT '[]',
  `price` double DEFAULT NULL,
  `salePrice` double DEFAULT NULL,
  `downloadCount` int(11) NOT NULL DEFAULT 0,
  `viewCount` int(11) NOT NULL DEFAULT 0,
  `fontFileUrl` varchar(500) NOT NULL,
  `previewImageUrl` varchar(500) DEFAULT NULL,
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `published` tinyint(1) NOT NULL DEFAULT 1,
  `designerId` int(11) NOT NULL,
  `developerId` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `detailsDescription` text DEFAULT NULL,
  `banglaName` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `font`
--

INSERT INTO `font` (`id`, `name`, `slug`, `description`, `fontType`, `style`, `encoding`, `price`, `salePrice`, `downloadCount`, `viewCount`, `fontFileUrl`, `previewImageUrl`, `featured`, `published`, `designerId`, `developerId`, `createdAt`, `updatedAt`, `detailsDescription`, `banglaName`) VALUES
(1, 'Borno Bangla', 'borno-bangla', 'বর্ণ বাংলা একটি ফ্রি বাংলা ফন্ট। ইউনিকোড এবং ANSI সাপোর্টেড।', 'FREE', 'GENERAL', '[\"UNICODE\",\"ANSI\"]', NULL, NULL, 549, 0, '/uploads/fonts/Atma-preview.ttf', '', 1, 1, 2, NULL, '2026-07-30 10:47:35.689', '2026-08-06 12:32:54.480', NULL, 'বর্ণ বাংলা'),
(2, 'Abu Sayed', 'abu-sayed', 'শহীদ আবু সাঈদ একটি হেডিং বাংলা ফন্ট।', 'FREE', 'HEADING', '[\"UNICODE\"]', NULL, NULL, 149398, 0, '/uploads/fonts/abu-sayed-preview.ttf', '/uploads/fonts/abu-sayed-preview.ttf', 1, 1, 1, NULL, '2026-07-30 10:47:35.710', '2026-08-06 12:32:54.518', 'শহীদ আবু সাঈদ একটি বিশেষ বাংলা ফন্ট, ফন্টটিতে রয়েছে ইউনিকোড এনকোডিং সমর্থন। ফন্টটি ডিজাইন এবং ডেভেলপ করেছেন জায়েদ আহসান সা\'দ এবং কোডপত্র ফন্টস এর ডিজাইনারস।', 'শহীদ আবু সাঈদ'),
(3, 'Hadi', 'hadi', 'হাদি একটি সাধারণ বাংলা ফন্ট। ইউনিকোড সাপোর্টেড।', 'FREE', 'GENERAL', '[\"UNICODE\"]', NULL, NULL, 49646, 0, '/uploads/fonts/Hind-Siliguri-preview.ttf', '', 1, 1, 4, NULL, '2026-07-30 10:47:35.723', '2026-08-06 12:32:54.544', NULL, 'হাদি'),
(4, 'Lima Bosonto', 'lima-bosonto', 'লিমা বসন্ত একটি ফ্রি বাংলা ফন্ট, ইউনিকোড, আনসি এবং বর্ণ এনকোডিং সমর্থন।', 'FREE', 'GENERAL', '[\"UNICODE\",\"ANSI\",\"BORNA\"]', NULL, NULL, 261663, 0, '/uploads/fonts/lima-bosonto-preview.ttf', '/uploads/fonts/lima-bosonto-preview.ttf', 1, 1, 3, 1, '2026-07-30 10:47:35.735', '2026-08-06 12:32:54.572', 'লিমা বসন্ত একটি ফ্রি বাংলা ফন্ট, ফন্টটিতে রয়েছে ইউনিকোড, আন্সি এবং বর্ণ এনকোডিং সমর্থন। এছাড়াও ফন্টটিতে আমাদের মাত্রালতা সুবিধাও রয়েছে, এখনিই ডাউনলোড করে নিন লিমা বসন্ত।', 'লিমা বসন্ত'),
(5, 'Mahin Dui Dashok', 'mahin-dui-dashok', 'মাহিন দুই দশক একটি স্টাইলিশ বাংলা ফন্ট।', 'FREE', 'STYLISH', '[\"UNICODE\"]', NULL, NULL, 100322, 0, '/uploads/fonts/Atma-preview.ttf', NULL, 1, 1, 1, 2, '2026-07-30 10:47:35.750', '2026-08-06 12:32:54.605', NULL, 'মাহিন দুই দশক'),
(6, 'Noto Serif Bengali', 'Noto-Serif-Bengali', 'পরিবারের সকল সদস্যের সমান', 'FREE', 'GENERAL', '[\"UNICODE\"]', NULL, NULL, 0, 0, '/uploads/fonts/Noto-Serif-Bengali.zip', '/uploads/fonts/Noto-Serif-Bengali-preview.ttf', 0, 1, 2, NULL, '2026-08-04 09:32:37.255', '2026-08-04 11:29:39.809', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `fontvariant`
--

CREATE TABLE `fontvariant` (
  `id` int(11) NOT NULL,
  `weight` varchar(50) NOT NULL,
  `fileUrl` varchar(500) NOT NULL,
  `fontId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `fontvariant`
--

INSERT INTO `fontvariant` (`id`, `weight`, `fileUrl`, `fontId`) VALUES
(46, 'Regular', '/uploads/fonts/Atma-preview.ttf', 1),
(47, 'Medium', '/uploads/fonts/Atma-preview.ttf', 1),
(48, 'Bold', '/uploads/fonts/Atma-preview.ttf', 1),
(49, 'Regular', '/uploads/fonts/abu-sayed-preview.ttf', 2),
(50, 'Medium', '/uploads/fonts/abu-sayed-preview.ttf', 2),
(51, 'Bold', '/uploads/fonts/abu-sayed-preview.ttf', 2),
(52, 'Regular', '/uploads/fonts/Hind-Siliguri-preview.ttf', 3),
(53, 'Medium', '/uploads/fonts/Hind-Siliguri-preview.ttf', 3),
(54, 'Bold', '/uploads/fonts/Hind-Siliguri-preview.ttf', 3),
(55, 'Regular', '/uploads/fonts/lima-bosonto-preview.ttf', 4),
(56, 'Medium', '/uploads/fonts/lima-bosonto-preview.ttf', 4),
(57, 'Bold', '/uploads/fonts/lima-bosonto-preview.ttf', 4),
(58, 'Regular', '/uploads/fonts/Atma-preview.ttf', 5),
(59, 'Medium', '/uploads/fonts/Atma-preview.ttf', 5),
(60, 'Bold', '/uploads/fonts/Atma-preview.ttf', 5);

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `fontId` int(11) NOT NULL,
  `customerEmail` varchar(200) NOT NULL,
  `customerName` varchar(200) NOT NULL,
  `amount` double NOT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'BDT',
  `paymentMethod` varchar(50) DEFAULT NULL,
  `paymentId` varchar(200) DEFAULT NULL,
  `transactionId` varchar(200) DEFAULT NULL,
  `status` enum('PENDING','COMPLETED','REFUNDED','FAILED') NOT NULL DEFAULT 'PENDING',
  `downloadToken` varchar(64) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adminuser`
--
ALTER TABLE `adminuser`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `AdminUser_email_key` (`email`);

--
-- Indexes for table `designer`
--
ALTER TABLE `designer`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Designer_slug_key` (`slug`);

--
-- Indexes for table `developer`
--
ALTER TABLE `developer`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Developer_slug_key` (`slug`);

--
-- Indexes for table `download`
--
ALTER TABLE `download`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Download_fontId_idx` (`fontId`),
  ADD KEY `Download_createdAt_idx` (`createdAt`);

--
-- Indexes for table `font`
--
ALTER TABLE `font`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Font_slug_key` (`slug`),
  ADD KEY `Font_fontType_idx` (`fontType`),
  ADD KEY `Font_style_idx` (`style`),
  ADD KEY `Font_designerId_idx` (`designerId`),
  ADD KEY `Font_downloadCount_idx` (`downloadCount`),
  ADD KEY `Font_developerId_fkey` (`developerId`);

--
-- Indexes for table `fontvariant`
--
ALTER TABLE `fontvariant`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FontVariant_fontId_idx` (`fontId`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Order_downloadToken_key` (`downloadToken`),
  ADD UNIQUE KEY `Order_paymentId_key` (`paymentId`),
  ADD KEY `Order_fontId_idx` (`fontId`),
  ADD KEY `Order_status_idx` (`status`),
  ADD KEY `Order_customerEmail_idx` (`customerEmail`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adminuser`
--
ALTER TABLE `adminuser`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `designer`
--
ALTER TABLE `designer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `developer`
--
ALTER TABLE `developer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `download`
--
ALTER TABLE `download`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `font`
--
ALTER TABLE `font`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `fontvariant`
--
ALTER TABLE `fontvariant`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `download`
--
ALTER TABLE `download`
  ADD CONSTRAINT `Download_fontId_fkey` FOREIGN KEY (`fontId`) REFERENCES `font` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `font`
--
ALTER TABLE `font`
  ADD CONSTRAINT `Font_designerId_fkey` FOREIGN KEY (`designerId`) REFERENCES `designer` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Font_developerId_fkey` FOREIGN KEY (`developerId`) REFERENCES `developer` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `fontvariant`
--
ALTER TABLE `fontvariant`
  ADD CONSTRAINT `FontVariant_fontId_fkey` FOREIGN KEY (`fontId`) REFERENCES `font` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `Order_fontId_fkey` FOREIGN KEY (`fontId`) REFERENCES `font` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
