-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: startupdb
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `year_quarter_code`
--

DROP TABLE IF EXISTS `year_quarter_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `year_quarter_code` (
  `yqc_code` char(5) NOT NULL COMMENT '코드',
  `yqc_year` char(4) NOT NULL COMMENT '년',
  `yqc_quarter` char(1) NOT NULL COMMENT '분기',
  `yqc_report` varchar(255) NOT NULL COMMENT '설명',
  PRIMARY KEY (`yqc_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `year_quarter_code`
--

LOCK TABLES `year_quarter_code` WRITE;
/*!40000 ALTER TABLE `year_quarter_code` DISABLE KEYS */;
INSERT INTO `year_quarter_code` VALUES ('20191','2019','1',''),('20192','2019','2',''),('20193','2019','3',''),('20194','2019','4',''),('20201','2020','1',''),('20202','2020','2',''),('20203','2020','3',''),('20204','2020','4',''),('20211','2021','1',''),('20212','2021','2',''),('20213','2021','3',''),('20214','2021','4',''),('20221','2022','1',''),('20222','2022','2',''),('20223','2022','3',''),('20224','2022','4',''),('20231','2023','1',''),('20232','2023','2',''),('20233','2023','3',''),('20234','2023','4',''),('20241','2024','1',''),('20242','2024','2',''),('20243','2024','3',''),('20244','2024','4','');
/*!40000 ALTER TABLE `year_quarter_code` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-04 18:11:41
