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
-- Table structure for table `insight_post`
--

DROP TABLE IF EXISTS `insight_post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insight_post` (
  `ip_id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
  `ip_title` varchar(200) NOT NULL COMMENT '타이틀',
  `ip_content` text NOT NULL COMMENT '게시글',
  `ip_writer` varchar(50) NOT NULL COMMENT '작성자',
  `ip_view_count` int DEFAULT '0' COMMENT '조회수',
  `ip_created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '작성일',
  `ip_updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
  `ip_pw` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ip_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insight_post`
--

LOCK TABLES `insight_post` WRITE;
/*!40000 ALTER TABLE `insight_post` DISABLE KEYS */;
INSERT INTO `insight_post` VALUES (11,'창업 준비중인데 어떤 종목을 창업하는게 성공 확률이 높을까요...?','몇일째 알아보고 있는데 장사를 할지 온라인 스토어를 할지 걱정이네요\n\n돈이 5천정도 있고 부족하면 대출 알아보려고 합니다..','창업 희망자',13,'2025-12-12 02:43:26','2025-12-12 08:45:38','1234'),(12,'특수상권 입점 문의','안녕하세요\n자영업을 준비 중인 예비 창업자입니다\n특수상권 입점을 검토하고 있는데, 실제 입점 절차나 조건이 궁금해서 글 남깁니다','예비 창업자',18,'2025-12-12 02:45:56','2025-12-12 07:49:29','1234'),(13,'음식점 하는 사장님들 마진율 몇프로인가요?','대략 몇 % 정도 마진을 보고 계신가요? 정말 궁금합니다','요식업 준비 창업 희망',30,'2025-12-12 02:49:25','2025-12-12 07:51:04','1234'),(14,'1인 네일샵 요즘 어떤가요?','국비 지원 받아서 네일 자격증 따고 한참 연습하다가 최근에 작게 1인 네일샵을 오픈했어요\n\n요즘 날씨도 그렇고 전반적으로 장사가 쉽지 않은 분위기라서요\n혹시 네일샵 운영하고 계신 사장님들\n요즘 상황은 어떤지 궁금합니다','네일샵 창업 하고 싶은 1인',5,'2025-12-12 03:15:55','2025-12-12 03:20:47','1234'),(15,'프랜차이즈 창업 알아보는중 질문','안녕하세요 창업 준비 중인 예비 사장입니다. 요즘 소자본 프랜차이즈 창업 광고에서 월순익 500만 원 같은 문구가 많이 보이는데요.\n실제로 운영하시는 분들은 어느 정도 수익이 나시는지 궁금합니다. 광고처럼 가능한 건가요?','프차 창업 가보자고~!',10,'2025-12-12 03:18:40','2025-12-12 05:56:15','000000'),(16,'여름철 과일가게 장사, 다들 어떠세요?','요즘 너무 힘드네요ㅠㅠ\n저는 과일 로드매장을 운영 중인데, 손님 발길이 정말 뚝 끊긴 느낌입니다.\n\n사실 과일은 지금이 한창 성수기라 기대도 컸는데… 다들 더운 날씨 탓에 시원한 매장만 찾으시는 건지\n \n\n하루하루 현타가 올 정도로 매출이 최악이에요.','과일가게 사장',7,'2025-12-12 04:15:34','2025-12-12 07:41:27','1234'),(17,'이번 주말 매출 완전 죽었네요… 다들 어떠신가요?','저번 주까지만 해도 그래도 잘 버텨서\n‘휴가 시즌은 큰 타격 없이 지나가나 보다’ 했거든요.\n\n그런데 이번 주 들어서 배달이 아예 없네요ㅠㅠ\n어제는 그나마 홀 매출이 조금 버텨줬는데,\n오늘은 홀도 배달도 전부 평일 수준으로 뚝 떨어졌습니다…\n\n괜히 혼자 힘 빠지네요.\n사장님들 가게 상황은 이번 주말 어떠신가요?','얼죽아',10,'2025-12-12 04:30:31','2025-12-12 07:56:27','1234'),(19,'편의점 창업 할려면','gs cu 세븐일레븐 본사에 전화하면 되나요? 경험자 있으신가요?','편의점 창업 해볼까...',8,'2025-12-12 05:42:09','2025-12-12 08:57:46','1234'),(21,'고기집 창업','요즘 고기집 창업에 관심이\n생겨서 이것저것 알아보는 중이에요.\n프랜차이즈 쪽으로도 눈길이 가다 보니\n관련 정보들을 하나씩 찾아보고 있는데요,\n\n요즘 같은 때엔 본사에서 마케팅이나\n홍보 쪽으로 어느 정도 지원을 해준다면\n고기집 창업이 훨씬 수월할 것 같다는\n생각도 들고요.\n\n그리고 고기집 창업 할 때 가장 중요한 건\n역시 고기 퀄리티 아닐까 싶어요.\n맛과 품질이 어느 정도 안정적으로 유지돼야\n손님도 만족하고, 단골도 생기고, 재방문율도\n높아질 테니까요..\n\n혹시 저처럼 고기집 창업 준비하고 계신 분들이나,\n한우88도매장 쪽으로 하고 계신 분 있으시면,\n정보 좀 부탁드리겠습니다!!!','배고픔',1,'2025-12-12 08:57:24','2025-12-12 08:57:29','1234');
/*!40000 ALTER TABLE `insight_post` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-12 18:01:20
