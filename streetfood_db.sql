-- MySQL dump 10.13  Distrib 9.3.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: streetfood_db
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `expense_date` date NOT NULL,
  `pwesto_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pwesto_id` (`pwesto_id`),
  CONSTRAINT `expenses_ibfk_2` FOREIGN KEY (`pwesto_id`) REFERENCES `pwesto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (12,'Allowance',100.00,'2025-07-04',2,'2025-07-04 10:18:13'),(13,'Gasolina',50.00,'2025-07-04',2,'2025-07-04 10:18:46'),(14,'TESTING',123.00,'2025-07-05',2,'2025-07-05 11:34:02');
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paninda`
--

DROP TABLE IF EXISTS `paninda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paninda` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_name` varchar(100) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paninda`
--

LOCK TABLES `paninda` WRITE;
/*!40000 ALTER TABLE `paninda` DISABLE KEYS */;
INSERT INTO `paninda` VALUES (1,'Fishball',5.00),(2,'Kikiam',5.00),(3,'Squid Ball',4.00),(4,'Siomai',5.00),(5,'Hotdog',17.00),(6,'Nuggets',10.00),(7,'Lumpia',5.00),(8,'Dynamite',7.00),(9,'Pugo',6.00),(10,'Sugok',20.00),(11,'Palamig',250.00),(12,'Mix',0.00),(13,'Squid Ball (Luto)',4.00);
/*!40000 ALTER TABLE `paninda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pwesto`
--

DROP TABLE IF EXISTS `pwesto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pwesto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tindera_id` int DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tindera_id` (`tindera_id`),
  CONSTRAINT `pwesto_ibfk_1` FOREIGN KEY (`tindera_id`) REFERENCES `tindera` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pwesto`
--

LOCK TABLES `pwesto` WRITE;
/*!40000 ALTER TABLE `pwesto` DISABLE KEYS */;
INSERT INTO `pwesto` VALUES (2,2,'Calauag'),(3,3,'Francia');
/*!40000 ALTER TABLE `pwesto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_logs`
--

DROP TABLE IF EXISTS `sales_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tindera_id` int NOT NULL,
  `pwesto_id` int NOT NULL,
  `paninda_id` int NOT NULL,
  `quantity` int DEFAULT NULL,
  `leftover` int DEFAULT NULL,
  `total_sales` decimal(10,2) DEFAULT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `tindera_id` (`tindera_id`),
  KEY `paninda_logs_ibfk_1` (`paninda_id`),
  KEY `pwesto_logs_ibfk_1` (`pwesto_id`),
  CONSTRAINT `paninda_logs_ibfk_1` FOREIGN KEY (`paninda_id`) REFERENCES `paninda` (`id`),
  CONSTRAINT `pwesto_logs_ibfk_1` FOREIGN KEY (`pwesto_id`) REFERENCES `pwesto` (`id`),
  CONSTRAINT `sales_logs_ibfk_1` FOREIGN KEY (`tindera_id`) REFERENCES `tindera` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_logs`
--

LOCK TABLES `sales_logs` WRITE;
/*!40000 ALTER TABLE `sales_logs` DISABLE KEYS */;
INSERT INTO `sales_logs` VALUES (14,3,3,2,100,10,150.00,'2025-06-30 02:53:40'),(15,2,2,2,1030,78,1586.00,'2025-06-30 15:41:47'),(16,2,2,1,1127,112,845.00,'2025-06-30 15:47:56'),(17,2,2,3,93,33,240.00,'2025-06-30 15:54:17'),(18,2,2,5,27,9,306.00,'2025-06-30 15:55:07'),(19,2,2,6,22,0,220.00,'2025-06-30 15:55:32'),(20,2,2,7,38,13,125.00,'2025-06-30 15:55:52'),(21,2,2,8,43,15,196.00,'2025-06-30 15:57:09'),(22,2,2,10,30,7,460.00,'2025-06-30 15:57:48'),(23,2,2,9,300,3,1782.00,'2025-06-30 15:58:24'),(24,2,2,11,2,0,530.00,'2025-06-30 15:59:51'),(25,2,2,12,0,0,60.00,'2025-06-30 16:01:49'),(26,2,2,13,10,0,40.00,'2025-06-30 16:03:59'),(27,3,3,1,1127,112,845.00,'2025-06-30 17:25:01'),(29,3,3,2,12,0,20.00,'2025-06-30 17:37:21'),(31,3,3,3,12,0,48.00,'2025-06-30 18:22:56'),(34,2,2,2,500,2,830.00,'2025-07-03 20:29:59'),(37,2,2,1,1131,55,895.00,'2025-07-04 18:01:02'),(38,2,2,2,350,0,580.00,'2025-07-04 18:10:08'),(39,2,2,5,5,0,85.00,'2025-07-04 18:11:01'),(40,2,2,11,0,0,1200.00,'2025-07-05 19:59:33'),(41,2,2,12,0,0,60.00,'2025-07-05 19:59:46'),(42,2,2,2,90,0,150.00,'2025-07-05 20:00:11'),(43,2,2,12,0,0,21321.00,'2025-07-05 20:44:22');
/*!40000 ALTER TABLE `sales_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tindera`
--

DROP TABLE IF EXISTS `tindera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tindera` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `contact` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tindera`
--

LOCK TABLES `tindera` WRITE;
/*!40000 ALTER TABLE `tindera` DISABLE KEYS */;
INSERT INTO `tindera` VALUES (2,'Shiela','09123456789'),(3,'Sarah','09123456789'),(4,'Aling Nena','09123456789'),(5,'Mang Berto','09987654321'),(6,'Aling Nena','09123456789'),(7,'Mang Berto','09987654321');
/*!40000 ALTER TABLE `tindera` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-05 21:01:27
