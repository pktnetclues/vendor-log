-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 06, 2024 at 06:26 AM
-- Server version: 8.2.0
-- PHP Version: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `log_manager`
--

-- --------------------------------------------------------

--
-- Table structure for table `process_status`
--

DROP TABLE IF EXISTS `process_status`;
CREATE TABLE IF NOT EXISTS `process_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vendor_name` varchar(200) NOT NULL,
  `status` enum('success','failed') NOT NULL,
  `total_inserted` int DEFAULT NULL,
  `total_updated` int DEFAULT NULL,
  `total_skipped` int DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `process_status`
--

INSERT INTO `process_status` (`id`, `vendor_name`, `status`, `total_inserted`, `total_updated`, `total_skipped`, `time`) VALUES
(1, 'pankaj', 'success', 2, 2, 96, '2024-06-06 05:37:39'),
(2, 'pankaj', 'success', 0, 0, 100, '2024-06-06 05:47:24'),
(3, 'pankaj', 'success', 0, 0, 100, '2024-06-06 06:05:32'),
(4, 'pankaj', 'success', 0, 0, 100, '2024-06-06 06:09:31'),
(5, 'pankaj', 'success', 0, 0, 100, '2024-06-06 06:09:49'),
(6, 'pankaj', 'success', 0, 0, 100, '2024-06-06 06:12:02'),
(7, 'pankaj', 'success', 0, 0, 100, '2024-06-06 06:19:28'),
(8, 'pankaj', 'failed', 0, 0, 100, '2024-06-06 06:19:49');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `price` int NOT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `quantity`) VALUES
(1, 'iphone', 50000, 10),
(2, 'galaxy s12', 60000, 30),
(3, 'oppo f17', 20000, 50),
(4, 'Laptop', 500, 40),
(5, 'Smartphone', 600, 20),
(6, 'Tablet', 400, 50),
(7, 'Headphones', 100, 30),
(8, 'Keyboard', 50, 25),
(9, 'Mouse', 30, 35),
(10, 'Monitor', 300, 12),
(11, 'External Hard Drive', 120, 18),
(12, 'Printer', 200, 8),
(13, 'Speakers', 150, 10),
(14, 'Web Camera', 75, 40),
(15, 'USB Flash Drive', 20, 50),
(16, 'Router', 80, 22),
(17, 'External Battery Pack', 35, 28),
(18, 'Desk Lamp', 45, 19),
(19, 'Microphone', 60, 15),
(20, 'Gaming Chair', 250, 5),
(21, 'VR Headset', 350, 7),
(22, 'Smartwatch', 200, 14),
(23, 'Digital Camera', 400, 9),
(24, 'E-Reader', 130, 17),
(25, 'Projector', 600, 4),
(26, 'Bluetooth Speaker', 90, 23),
(27, 'Fitness Tracker', 70, 16),
(28, 'Drone', 800, 3),
(29, 'Graphics Tablet', 150, 11),
(30, 'Portable SSD', 120, 20),
(31, 'Gaming Console', 400, 8),
(32, 'Action Camera', 300, 6),
(33, 'Smart Glasses', 250, 2),
(34, 'Noise Cancelling Headphones', 200, 13),
(35, 'Home Assistant', 100, 21),
(36, 'Streaming Device', 50, 18),
(37, 'Smart Light Bulb', 25, 30),
(38, 'Robot Vacuum', 400, 5),
(39, 'Electric Toothbrush', 60, 22),
(40, 'Hair Dryer', 40, 27),
(41, 'Coffee Maker', 80, 10),
(42, 'Air Purifier', 150, 12),
(43, 'Kitchen Scale', 30, 19),
(44, 'Pressure Cooker', 100, 14),
(45, 'Blender', 70, 18),
(46, 'Toaster', 40, 21),
(47, 'Microwave Oven', 200, 7),
(48, 'Refrigerator', 800, 3),
(49, 'Washing Machine', 700, 2),
(50, 'Dishwasher', 600, 4),
(51, 'Vacuum Cleaner', 150, 16),
(52, 'Iron', 50, 25),
(53, 'Sewing Machine', 120, 8),
(54, 'Air Conditioner', 300, 9),
(55, 'Water Heater', 250, 6),
(56, 'Ceiling Fan', 70, 18),
(57, 'Table Fan', 40, 22),
(58, 'Heater', 100, 15),
(59, 'Electric Kettle', 30, 30),
(60, 'Induction Cooktop', 50, 27),
(61, 'Rice Cooker', 60, 19),
(62, 'Sandwich Maker', 25, 31),
(63, 'Juicer', 70, 12),
(64, 'Food Processor', 100, 10),
(65, 'Hand Mixer', 30, 28),
(66, 'Stand Mixer', 200, 5),
(67, 'Slow Cooker', 50, 20),
(68, 'Deep Fryer', 80, 14),
(69, 'Bread Maker', 100, 9),
(70, 'Ice Cream Maker', 70, 8),
(71, 'Waffle Maker', 40, 13),
(72, 'Pizza Oven', 150, 7),
(73, 'Soda Maker', 60, 18),
(74, 'Electric Grill', 120, 10),
(75, 'Popcorn Maker', 30, 29),
(76, 'Electric Skillet', 50, 17),
(77, 'Meat Grinder', 80, 11),
(78, 'Food Dehydrator', 100, 6),
(79, 'Yogurt Maker', 50, 24),
(80, 'Pasta Maker', 80, 15),
(81, 'Electric Knife', 30, 28),
(82, 'Salad Spinner', 20, 32),
(83, 'Cheese Grater', 15, 35),
(84, 'Butter Churner', 50, 12),
(85, 'Spice Grinder', 40, 27),
(86, 'Espresso Machine', 150, 8),
(87, 'Coffee Grinder', 30, 31),
(88, 'Tea Kettle', 25, 28),
(89, 'Milk Frother', 20, 30),
(90, 'Egg Cooker', 15, 33),
(91, 'Ice Maker', 120, 9),
(92, 'Water Dispenser', 200, 7),
(93, 'Humidifier', 50, 22),
(94, 'Dehumidifier', 100, 11),
(95, 'Clothes Steamer', 80, 16),
(96, 'Treadmill', 500, 3),
(97, 'Exercise Bike', 300, 5),
(98, 'Rowing Machine', 400, 4),
(99, 'Dumbbells', 100, 20),
(100, 'Kettlebell', 50, 25),
(101, 'Yoga Mat', 20, 32),
(102, 'Resistance Bands', 15, 40),
(103, 'Foam Roller', 30, 18),
(104, 'Bulb', 600, 20),
(105, 'HeatWave', 600, 20),
(106, 'Pankaj', 600, 20),
(107, 'Hello Brother', 600, 20),
(108, 'Vivo v17', 600, 20),
(109, 'Macbook', 70000, 25);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
