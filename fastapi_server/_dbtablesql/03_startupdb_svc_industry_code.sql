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
-- Table structure for table `svc_industry_code`
--

DROP TABLE IF EXISTS `svc_industry_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `svc_industry_code` (
  `sic_code` char(8) NOT NULL COMMENT '코드',
  `sic_industry_group` varchar(20) NOT NULL COMMENT '업종구분(업종그룹)',
  `sic_svc_industry` varchar(20) NOT NULL,
  `sic_report` varchar(255) NOT NULL COMMENT '설명',
  PRIMARY KEY (`sic_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `svc_industry_code`
--

LOCK TABLES `svc_industry_code` WRITE;
/*!40000 ALTER TABLE `svc_industry_code` DISABLE KEYS */;
INSERT INTO `svc_industry_code` VALUES ('CS100001','한식음식점','한식음식점',''),('CS100002','중식음식점','중식음식점',''),('CS100003','일식음식점','일식음식점',''),('CS100004','양식음식점','양식음식점',''),('CS100005','제과점','제과점',''),('CS100006','패스트푸드점','패스트푸드점',''),('CS100007','치킨전문점','치킨전문점',''),('CS100008','분식전문점','분식전문점',''),('CS100009','호프-간이주점','호프-간이주점',''),('CS100010','커피-음료','커피-음료',''),('CS200001','일반교습학원','일반교습학원',''),('CS200002','외국어학원','외국어학원',''),('CS200003','예술학원','예술학원',''),('CS200005','스포츠강습','스포츠강습',''),('CS200006','일반의원','일반의원',''),('CS200007','치과의원','치과의원',''),('CS200008','한의원','한의원',''),('CS200016','당구장','당구장',''),('CS200017','골프연습장','골프연습장',''),('CS200019','PC방','PC방',''),('CS200024','스포츠클럽','스포츠클럽',''),('CS200025','자동차수리','자동차수리',''),('CS200026','자동차미용','자동차미용',''),('CS200028','미용실','미용실',''),('CS200029','네일숍','네일숍',''),('CS200030','피부관리실','피부관리실',''),('CS200031','세탁소','세탁소',''),('CS200032','가전제품수리','가전제품수리',''),('CS200033','부동산중개업','부동산중개업',''),('CS200034','여관','여관',''),('CS200036','고시원','고시원',''),('CS200037','노래방','노래방',''),('CS300001','슈퍼마켓','슈퍼마켓',''),('CS300002','편의점','편의점',''),('CS300003','컴퓨터및주변장치판매','컴퓨터및주변장치판매',''),('CS300004','핸드폰','핸드폰',''),('CS300006','미곡판매','미곡판매',''),('CS300007','육류판매','육류판매',''),('CS300008','수산물판매','수산물판매',''),('CS300009','청과상','청과상',''),('CS300010','반찬가게','반찬가게',''),('CS300011','일반의류','일반의류',''),('CS300014','신발','신발',''),('CS300015','가방','가방',''),('CS300016','안경','안경',''),('CS300017','시계및귀금속','시계및귀금속',''),('CS300018','의약품','의약품',''),('CS300019','의료기기','의료기기',''),('CS300020','서적','서적',''),('CS300021','문구','문구',''),('CS300022','화장품','화장품',''),('CS300024','운동/경기용품','운동/경기용품',''),('CS300025','자전거및기타운송장비','자전거및기타운송장비',''),('CS300026','완구','완구',''),('CS300027','섬유제품','섬유제품',''),('CS300028','화초','화초',''),('CS300029','애완동물','애완동물',''),('CS300031','가구','가구',''),('CS300032','가전제품','가전제품',''),('CS300033','철물점','철물점',''),('CS300035','인테리어','인테리어',''),('CS300036','조명용품','조명용품',''),('CS300043','전자상거래업','전자상거래업','');
/*!40000 ALTER TABLE `svc_industry_code` ENABLE KEYS */;
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
