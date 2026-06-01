-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: jdztravel
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Current Database: `jdztravel`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `jdztravel` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `jdztravel`;

--
-- Table structure for table `admin_logs`
--

DROP TABLE IF EXISTS `admin_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_logs` (
  `log_id` int NOT NULL AUTO_INCREMENT COMMENT '日志ID，主键',
  `admin_id` int NOT NULL COMMENT '管理员ID，外键参照user_info表',
  `action_type` varchar(50) NOT NULL COMMENT '操作类型',
  `action_target` varchar(50) DEFAULT NULL COMMENT '操作目标',
  `target_id` int DEFAULT NULL COMMENT '目标ID',
  `action_details` text COMMENT '操作详情',
  `ip_address` varchar(50) DEFAULT NULL COMMENT '操作IP',
  `action_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`log_id`),
  KEY `admin_id` (`admin_id`),
  CONSTRAINT `admin_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='管理员操作日志表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `browse_history`
--

DROP TABLE IF EXISTS `browse_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `browse_history` (
  `history_id` int NOT NULL AUTO_INCREMENT COMMENT '历史ID，主键',
  `user_id` int NOT NULL COMMENT '用户ID，外键参照user_info表',
  `related_id` int NOT NULL COMMENT '关联的景点ID或店铺ID或帖子ID',
  `related_type` enum('spot','shop','post','food') NOT NULL,
  `browse_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '浏览时间',
  PRIMARY KEY (`history_id`),
  KEY `idx_user_related` (`user_id`,`related_id`,`related_type`) COMMENT '用户和关联项目索引',
  CONSTRAINT `browse_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户浏览历史表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ceramic_knowledge`
--

DROP TABLE IF EXISTS `ceramic_knowledge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ceramic_knowledge` (
  `knowledge_id` int NOT NULL AUTO_INCREMENT COMMENT '知识ID，主键',
  `title` varchar(200) NOT NULL COMMENT '知识标题',
  `content` text NOT NULL COMMENT '知识内容',
  `category` varchar(50) DEFAULT NULL COMMENT '知识分类',
  `keywords` varchar(255) DEFAULT NULL COMMENT '关键词，用于搜索',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`knowledge_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='陶瓷知识库表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT COMMENT '评论ID，主键',
  `post_id` int NOT NULL COMMENT '关联的帖子ID，外键参照posts表',
  `user_id` int NOT NULL COMMENT '评论用户ID，外键参照user_info表',
  `parent_id` int DEFAULT NULL COMMENT '父评论ID，用于回复评论',
  `content` text NOT NULL COMMENT '评论内容',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`comment_id`),
  KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`comment_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='帖子评论表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `experience_shop`
--

DROP TABLE IF EXISTS `experience_shop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `experience_shop` (
  `shop_id` int NOT NULL AUTO_INCREMENT COMMENT '店铺ID，主键',
  `shop_name` varchar(100) NOT NULL COMMENT '店铺名称',
  `shop_description` text COMMENT '店铺详细介绍',
  `shop_address` varchar(200) NOT NULL COMMENT '店铺地址',
  `business_hours` varchar(100) DEFAULT NULL COMMENT '营业时间',
  `experience_type` varchar(50) DEFAULT NULL COMMENT '体验类型(如拉坯、绘画等)',
  `price_range` varchar(50) DEFAULT NULL COMMENT '价格区间',
  `longitude` decimal(10,6) NOT NULL COMMENT '经度',
  `latitude` decimal(10,6) NOT NULL COMMENT '纬度',
  `average_rating` decimal(3,1) DEFAULT '0.0' COMMENT '平均评分(0-5)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `image_id` int DEFAULT NULL,
  PRIMARY KEY (`shop_id`),
  KEY `es_image_id` (`image_id`),
  CONSTRAINT `es_image_id` FOREIGN KEY (`image_id`) REFERENCES `spot_shop_images` (`image_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=220004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='非遗体验店信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `food_culture`
--

DROP TABLE IF EXISTS `food_culture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food_culture` (
  `food_id` int NOT NULL AUTO_INCREMENT COMMENT '美食ID，主键',
  `food_name` varchar(100) NOT NULL COMMENT '美食名称',
  `food_description` text COMMENT '美食介绍',
  `food_address` varchar(200) NOT NULL COMMENT '美食地址',
  `business_hours` varchar(100) DEFAULT NULL COMMENT '营业时间',
  `price_range` varchar(50) DEFAULT NULL COMMENT '价格区间',
  `longitude` decimal(10,6) NOT NULL COMMENT '经度',
  `latitude` decimal(10,6) NOT NULL COMMENT '纬度',
  `average_rating` decimal(3,1) DEFAULT '0.0' COMMENT '平均评分(0-5)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `image_id` int DEFAULT NULL,
  PRIMARY KEY (`food_id`),
  KEY `fk_food_image_id` (`image_id`),
  CONSTRAINT `fk_food_image_id` FOREIGN KEY (`image_id`) REFERENCES `spot_shop_images` (`image_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=330009 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='景德镇美食文化表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `like_id` int NOT NULL AUTO_INCREMENT COMMENT '点赞ID，主键',
  `post_id` int NOT NULL COMMENT '关联的帖子ID，外键参照posts表',
  `user_id` int NOT NULL COMMENT '点赞用户ID，外键参照user_info表',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
  PRIMARY KEY (`like_id`),
  UNIQUE KEY `uk_post_user` (`post_id`,`user_id`) COMMENT '确保用户对同一帖子只能点赞一次',
  KEY `user_id` (`user_id`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='帖子点赞表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `post_images`
--

DROP TABLE IF EXISTS `post_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_images` (
  `image_id` int NOT NULL AUTO_INCREMENT COMMENT '图片ID，主键',
  `post_id` int NOT NULL COMMENT '关联的帖子ID，外键参照posts表',
  `image_url` varchar(255) NOT NULL COMMENT '图片URL',
  `upload_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  PRIMARY KEY (`image_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `post_images_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='帖子图片表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `post_id` int NOT NULL AUTO_INCREMENT COMMENT '帖子ID，主键',
  `user_id` int NOT NULL COMMENT '发布用户ID，外键参照user_info表',
  `title` varchar(100) NOT NULL COMMENT '帖子标题',
  `content` text NOT NULL COMMENT '帖子内容',
  `view_count` int DEFAULT '0' COMMENT '浏览数',
  `like_count` int DEFAULT '0' COMMENT '点赞数',
  `comment_count` int DEFAULT '0' COMMENT '评论数',
  `post_status` enum('published','deleted') DEFAULT 'published' COMMENT '帖子状态',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `main_image_id` int DEFAULT NULL,
  PRIMARY KEY (`post_id`),
  KEY `user_id` (`user_id`),
  KEY `fk_main_image` (`main_image_id`),
  CONSTRAINT `fk_main_image` FOREIGN KEY (`main_image_id`) REFERENCES `post_images` (`image_id`) ON DELETE SET NULL,
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='社区帖子表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `qa_records`
--

DROP TABLE IF EXISTS `qa_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `qa_records` (
  `record_id` int NOT NULL AUTO_INCREMENT COMMENT '记录ID，主键',
  `user_id` int NOT NULL COMMENT '用户ID，外键参照user_info表',
  `question` text NOT NULL COMMENT '用户提问',
  `answer` text COMMENT 'AI回答',
  `ask_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提问时间',
  `answer_time` timestamp NULL DEFAULT NULL COMMENT '回答时间',
  `is_satisfied` tinyint(1) DEFAULT NULL COMMENT '用户是否满意',
  `feedback` text COMMENT '用户反馈',
  PRIMARY KEY (`record_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `qa_records_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='AI问答记录表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `route_plans`
--

DROP TABLE IF EXISTS `route_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `route_plans` (
  `plan_id` int NOT NULL AUTO_INCREMENT COMMENT '规划ID，主键',
  `user_id` int NOT NULL COMMENT '用户ID，外键参照user_info表',
  `start_longitude` decimal(10,6) NOT NULL COMMENT '起点经度',
  `start_latitude` decimal(10,6) NOT NULL COMMENT '起点纬度',
  `end_longitude` decimal(10,6) NOT NULL COMMENT '终点经度',
  `end_latitude` decimal(10,6) NOT NULL COMMENT '终点纬度',
  `waypoints` text COMMENT '途径点JSON数据',
  `route_data` text COMMENT '路线数据(JSON格式)',
  `distance` decimal(10,2) DEFAULT NULL COMMENT '路线距离(米)',
  `duration` int DEFAULT NULL COMMENT '预计时间(秒)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`plan_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `route_plans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户路线规划表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `scenic_spot`
--

DROP TABLE IF EXISTS `scenic_spot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scenic_spot` (
  `spot_id` int NOT NULL AUTO_INCREMENT COMMENT '景点ID，主键',
  `spot_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '景点名称',
  `spot_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT '景点详细介绍',
  `spot_address` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '景点地址',
  `opening_hours` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '开放时间',
  `ticket_price` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '门票价格',
  `longitude` decimal(10,6) NOT NULL COMMENT '经度',
  `latitude` decimal(10,6) NOT NULL COMMENT '纬度',
  `average_rating` decimal(3,1) DEFAULT '0.0' COMMENT '平均评分(0-5)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `image_id` int DEFAULT NULL COMMENT '关联的图片ID',
  PRIMARY KEY (`spot_id`) USING BTREE,
  KEY `fk_image_id` (`image_id`) USING BTREE,
  CONSTRAINT `fk_image_id` FOREIGN KEY (`image_id`) REFERENCES `spot_shop_images` (`image_id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `chk_average_rating` CHECK ((`average_rating` between 0 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=110014 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='景德镇景点信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `spot_shop_images`
--

DROP TABLE IF EXISTS `spot_shop_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `spot_shop_images` (
  `image_id` int NOT NULL AUTO_INCREMENT COMMENT '图片ID，主键',
  `related_id` int NOT NULL COMMENT '关联的景点ID或店铺ID',
  `related_type` enum('spot','shop','food') NOT NULL,
  `image_url` varchar(255) NOT NULL COMMENT '图片URL',
  `is_main` tinyint(1) DEFAULT '0' COMMENT '是否为主图',
  `upload_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  `image_index` int NOT NULL DEFAULT '1' COMMENT '图片在轮播图中的索引',
  PRIMARY KEY (`image_id`),
  KEY `idx_related` (`related_id`,`related_type`) COMMENT '关联ID和类型索引'
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='景点和店铺图片表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_favorites`
--

DROP TABLE IF EXISTS `user_favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_favorites` (
  `favorite_id` int NOT NULL AUTO_INCREMENT COMMENT '收藏ID，主键',
  `user_id` int NOT NULL COMMENT '用户ID，外键参照user_info表',
  `related_id` int NOT NULL COMMENT '关联的景点ID或店铺ID',
  `related_type` enum('spot','shop','food') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  PRIMARY KEY (`favorite_id`),
  UNIQUE KEY `uk_user_related` (`user_id`,`related_id`,`related_type`) COMMENT '确保用户对同一项目只能收藏一次',
  CONSTRAINT `user_favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户收藏表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_info` (
  `user_id` int NOT NULL AUTO_INCREMENT COMMENT '用户ID，主键',
  `openid` varchar(100) DEFAULT NULL COMMENT '微信openid',
  `username` varchar(50) DEFAULT NULL COMMENT '用户名',
  `avatar_url` varchar(255) DEFAULT NULL COMMENT '头像URL',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `user_type` enum('normal','admin') DEFAULT 'normal' COMMENT '用户类型(普通用户/管理员)',
  `registration_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `last_login_time` timestamp NULL DEFAULT NULL COMMENT '最后登录时间',
  `status` enum('active','inactive') DEFAULT 'active' COMMENT '账号状态',
  `password` varchar(64) DEFAULT NULL COMMENT '用户密码（加密存储）',
  `nickname` varchar(50) DEFAULT '',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `openid` (`openid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_locations`
--

DROP TABLE IF EXISTS `user_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_locations` (
  `location_id` int NOT NULL AUTO_INCREMENT COMMENT '位置ID，主键',
  `user_id` int NOT NULL COMMENT '用户ID，外键参照user_info表',
  `longitude` decimal(10,6) NOT NULL COMMENT '经度',
  `latitude` decimal(10,6) NOT NULL COMMENT '纬度',
  `location_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录时间',
  PRIMARY KEY (`location_id`),
  KEY `idx_user_time` (`user_id`,`location_time`) COMMENT '用户和时间索引',
  CONSTRAINT `user_locations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户位置记录表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_ratings`
--

DROP TABLE IF EXISTS `user_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_ratings` (
  `rating_id` int NOT NULL AUTO_INCREMENT COMMENT '评分ID，主键',
  `user_id` int NOT NULL COMMENT '用户ID，外键参照user_info表',
  `related_id` int NOT NULL COMMENT '关联的景点ID或店铺ID',
  `related_type` enum('spot','shop','food') NOT NULL,
  `rating_value` decimal(2,1) NOT NULL COMMENT '评分值(0-5)',
  `rating_comment` text COMMENT '评分评论',
  `rating_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '评分时间',
  PRIMARY KEY (`rating_id`),
  KEY `user_id` (`user_id`),
  KEY `idx_related` (`related_id`,`related_type`) COMMENT '关联ID和类型索引',
  CONSTRAINT `user_ratings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户对景点和店铺的评分表';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-02 16:05:05
