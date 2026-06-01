/*
 Navicat Premium Data Transfer

 Source Server         : GLQ
 Source Server Type    : MySQL
 Source Server Version : 80040 (8.0.40)
 Source Host           : localhost:3306
 Source Schema         : jdztravel

 Target Server Type    : MySQL
 Target Server Version : 80040 (8.0.40)
 File Encoding         : 65001

 Date: 05/06/2025 18:39:36
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for browse_history
-- ----------------------------
DROP TABLE IF EXISTS `browse_history`;
CREATE TABLE `browse_history`  (
  `history_id` int NOT NULL AUTO_INCREMENT COMMENT '历史ID，主键',
  `user_id` int NOT NULL COMMENT '用户ID，外键参照user_info表',
  `related_id` int NOT NULL COMMENT '关联的景点ID或店铺ID或帖子ID',
  `related_type` enum('spot','shop','post','food') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `browse_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '浏览时间',
  PRIMARY KEY (`history_id`) USING BTREE,
  INDEX `idx_user_related`(`user_id` ASC, `related_id` ASC, `related_type` ASC) USING BTREE COMMENT '用户和关联项目索引',
  CONSTRAINT `browse_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 48 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户浏览历史表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of browse_history
-- ----------------------------
INSERT INTO `browse_history` VALUES (1, 2, 34, 'post', '2025-06-02 14:04:29');
INSERT INTO `browse_history` VALUES (2, 2, 32, 'post', '2025-06-02 14:04:36');
INSERT INTO `browse_history` VALUES (3, 2, 33, 'post', '2025-06-02 14:04:45');
INSERT INTO `browse_history` VALUES (4, 2, 33, 'post', '2025-06-02 14:04:55');
INSERT INTO `browse_history` VALUES (5, 2, 33, 'post', '2025-06-02 14:07:55');
INSERT INTO `browse_history` VALUES (6, 2, 34, 'post', '2025-06-02 14:08:10');
INSERT INTO `browse_history` VALUES (7, 2, 34, 'post', '2025-06-02 14:11:56');
INSERT INTO `browse_history` VALUES (8, 2, 34, 'post', '2025-06-02 14:14:35');
INSERT INTO `browse_history` VALUES (9, 2, 33, 'post', '2025-06-02 14:15:08');
INSERT INTO `browse_history` VALUES (10, 2, 31, 'post', '2025-06-02 14:15:16');
INSERT INTO `browse_history` VALUES (11, 2, 34, 'post', '2025-06-02 14:15:53');
INSERT INTO `browse_history` VALUES (12, 2, 34, 'post', '2025-06-02 14:18:27');
INSERT INTO `browse_history` VALUES (13, 2, 34, 'post', '2025-06-02 14:18:36');
INSERT INTO `browse_history` VALUES (14, 2, 33, 'post', '2025-06-02 14:18:46');
INSERT INTO `browse_history` VALUES (15, 2, 34, 'post', '2025-06-02 14:37:47');
INSERT INTO `browse_history` VALUES (16, 2, 33, 'post', '2025-06-02 14:37:51');
INSERT INTO `browse_history` VALUES (17, 2, 15, 'post', '2025-06-02 14:38:00');
INSERT INTO `browse_history` VALUES (18, 2, 34, 'post', '2025-06-02 14:39:53');
INSERT INTO `browse_history` VALUES (19, 2, 33, 'post', '2025-06-02 14:39:56');
INSERT INTO `browse_history` VALUES (20, 2, 15, 'post', '2025-06-02 14:39:58');
INSERT INTO `browse_history` VALUES (21, 2, 31, 'post', '2025-06-02 14:40:03');
INSERT INTO `browse_history` VALUES (22, 2, 32, 'post', '2025-06-02 15:02:07');
INSERT INTO `browse_history` VALUES (23, 2, 32, 'post', '2025-06-02 15:49:20');
INSERT INTO `browse_history` VALUES (24, 2, 31, 'post', '2025-06-02 16:09:29');
INSERT INTO `browse_history` VALUES (25, 2, 34, 'post', '2025-06-02 16:52:21');
INSERT INTO `browse_history` VALUES (26, 2, 31, 'post', '2025-06-02 16:52:27');
INSERT INTO `browse_history` VALUES (27, 2, 15, 'post', '2025-06-02 16:52:35');
INSERT INTO `browse_history` VALUES (28, 2, 34, 'post', '2025-06-02 17:06:20');
INSERT INTO `browse_history` VALUES (29, 2, 34, 'post', '2025-06-02 17:10:12');
INSERT INTO `browse_history` VALUES (30, 2, 15, 'post', '2025-06-02 17:10:22');
INSERT INTO `browse_history` VALUES (31, 2, 34, 'post', '2025-06-02 17:50:41');
INSERT INTO `browse_history` VALUES (32, 2, 34, 'post', '2025-06-03 08:41:49');
INSERT INTO `browse_history` VALUES (33, 2, 34, 'post', '2025-06-03 08:41:55');
INSERT INTO `browse_history` VALUES (34, 2, 34, 'post', '2025-06-03 08:42:03');
INSERT INTO `browse_history` VALUES (35, 2, 34, 'post', '2025-06-03 10:07:04');
INSERT INTO `browse_history` VALUES (36, 9, 34, 'post', '2025-06-03 10:09:35');
INSERT INTO `browse_history` VALUES (37, 9, 33, 'post', '2025-06-03 10:09:38');
INSERT INTO `browse_history` VALUES (38, 9, 33, 'post', '2025-06-03 10:10:08');
INSERT INTO `browse_history` VALUES (39, 9, 33, 'post', '2025-06-03 10:10:11');
INSERT INTO `browse_history` VALUES (40, 2, 34, 'post', '2025-06-03 11:25:49');
INSERT INTO `browse_history` VALUES (41, 2, 31, 'post', '2025-06-04 14:31:17');
INSERT INTO `browse_history` VALUES (42, 2, 15, 'post', '2025-06-04 14:31:27');
INSERT INTO `browse_history` VALUES (43, 2, 33, 'post', '2025-06-04 14:31:45');
INSERT INTO `browse_history` VALUES (44, 2, 31, 'post', '2025-06-04 14:31:50');
INSERT INTO `browse_history` VALUES (45, 2, 33, 'post', '2025-06-04 14:39:09');
INSERT INTO `browse_history` VALUES (46, 2, 34, 'post', '2025-06-05 15:06:36');
INSERT INTO `browse_history` VALUES (47, 2, 33, 'post', '2025-06-05 15:06:51');

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments`  (
  `comment_id` int NOT NULL AUTO_INCREMENT COMMENT '评论ID，主键',
  `post_id` int NOT NULL COMMENT '关联的帖子ID，外键参照posts表',
  `user_id` int NOT NULL COMMENT '评论用户ID，外键参照user_info表',
  `parent_id` int NULL DEFAULT NULL COMMENT '父评论ID，用于回复评论',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '评论内容',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`comment_id`) USING BTREE,
  INDEX `post_id`(`post_id` ASC) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  INDEX `parent_id`(`parent_id` ASC) USING BTREE,
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`comment_id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '帖子评论表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comments
-- ----------------------------
INSERT INTO `comments` VALUES (2, 15, 2, NULL, '测试评论1', '2025-06-01 00:44:47');
INSERT INTO `comments` VALUES (6, 31, 2, NULL, '期待陶博城营地！5月约上家人去烧烤🍖', '2025-06-02 12:03:49');
INSERT INTO `comments` VALUES (7, 31, 2, NULL, '月亮湖也很好看，帐篷里就可以看到湖面和山', '2025-06-02 12:03:59');
INSERT INTO `comments` VALUES (8, 31, 2, NULL, '晚上可以在那过夜吗', '2025-06-02 12:04:10');
INSERT INTO `comments` VALUES (9, 31, 2, 8, '可以的~注意安全', '2025-06-02 12:04:17');
INSERT INTO `comments` VALUES (10, 34, 2, NULL, '超想去景德镇', '2025-06-02 12:06:25');
INSERT INTO `comments` VALUES (11, 34, 2, NULL, '一天都可以逛完嘛', '2025-06-02 12:06:33');
INSERT INTO `comments` VALUES (12, 34, 2, 11, '可以嘟～', '2025-06-02 12:06:38');
INSERT INTO `comments` VALUES (13, 34, 2, NULL, '景德镇好玩吗？', '2025-06-02 13:45:22');
INSERT INTO `comments` VALUES (14, 32, 2, NULL, '你规划得真好！', '2025-06-02 15:02:23');
INSERT INTO `comments` VALUES (15, 32, 2, 14, '谢谢你的夸奖', '2025-06-02 15:02:40');
INSERT INTO `comments` VALUES (16, 33, 9, NULL, '点赞/::>👍🏻', '2025-06-03 10:09:46');

-- ----------------------------
-- Table structure for experience_shop
-- ----------------------------
DROP TABLE IF EXISTS `experience_shop`;
CREATE TABLE `experience_shop`  (
  `shop_id` int NOT NULL AUTO_INCREMENT COMMENT '店铺ID，主键',
  `shop_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '店铺名称',
  `shop_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '店铺详细介绍',
  `shop_address` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '店铺地址',
  `business_hours` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '营业时间',
  `experience_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '体验类型(如拉坯、绘画等)',
  `price_range` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '价格区间',
  `longitude` decimal(10, 6) NOT NULL COMMENT '经度',
  `latitude` decimal(10, 6) NOT NULL COMMENT '纬度',
  `average_rating` decimal(3, 1) NULL DEFAULT 0.0 COMMENT '平均评分(0-5)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `image_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`shop_id`) USING BTREE,
  INDEX `es_image_id`(`image_id` ASC) USING BTREE,
  CONSTRAINT `es_image_id` FOREIGN KEY (`image_id`) REFERENCES `spot_shop_images` (`image_id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 220004 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '非遗体验店信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of experience_shop
-- ----------------------------
INSERT INTO `experience_shop` VALUES (220001, '和小泥陶艺工坊', '提供拉胚体验，感受传统陶艺魅力。', '新厂东路雕塑瓷厂新建博物馆旁', '9:00-18:30', '拉胚', '人均100-110元', 117.260812, 29.307606, 4.6, '2025-05-27 11:29:53', '2025-05-29 11:06:50', 70);
INSERT INTO `experience_shop` VALUES (220002, '乐天陶社', '专业烧瓷体验，亲手制作独特瓷器。', '新厂东路139号（雕塑瓷厂内）', '周六上午9:00-12:00', '烧瓷', '人均300-400元', 117.261158, 29.306530, 4.7, '2025-05-27 11:29:53', '2025-05-29 11:06:50', 73);
INSERT INTO `experience_shop` VALUES (220003, '钟辉陶艺基地', '绘画体验，发挥你的艺术创造力', '迎宾大道嘉和迎宾城小区内1栋C座3楼', '9:00-12:00, 13:30-18:00', '绘画', '人均120-130元', 117.196692, 29.310382, 3.5, '2025-05-27 11:29:53', '2025-05-29 11:06:50', 75);

-- ----------------------------
-- Table structure for food_culture
-- ----------------------------
DROP TABLE IF EXISTS `food_culture`;
CREATE TABLE `food_culture`  (
  `food_id` int NOT NULL AUTO_INCREMENT COMMENT '美食ID，主键',
  `food_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '美食名称',
  `food_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '美食介绍',
  `food_address` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '美食地址',
  `business_hours` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '营业时间',
  `price_range` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '价格区间',
  `longitude` decimal(10, 6) NOT NULL COMMENT '经度',
  `latitude` decimal(10, 6) NOT NULL COMMENT '纬度',
  `average_rating` decimal(3, 1) NULL DEFAULT 0.0 COMMENT '平均评分(0-5)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `image_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`food_id`) USING BTREE,
  INDEX `fk_food_image_id`(`image_id` ASC) USING BTREE,
  CONSTRAINT `fk_food_image_id` FOREIGN KEY (`image_id`) REFERENCES `spot_shop_images` (`image_id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 330009 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '景德镇美食文化表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of food_culture
-- ----------------------------
INSERT INTO `food_culture` VALUES (330001, '乐乐大排档', '提供地道的本地海鲜大排档，新鲜美味，是品尝当地风味的绝佳选择。', '浙江路中厦金都城1号楼(温州商会对面)', '11:00-14:00, 17:00-23:30', '人均70-80元', 117.209166, 29.315952, 4.1, '2025-05-27 11:17:51', '2025-05-29 10:08:21', 50);
INSERT INTO `food_culture` VALUES (330002, '回家吃饭', '传统家常菜馆，提供温馨舒适的就餐环境和美味可口的家常菜肴。', '珠山大道长虹缤纷时代广场3层', '11:00-14:00, 17:00-20:30', '人均70-80元', 117.244403, 29.310264, 4.3, '2025-05-27 11:17:51', '2025-05-29 10:08:21', 53);
INSERT INTO `food_culture` VALUES (330003, '八度厨房', '现代烹饪技巧与经典食谱的完美结合，提供多样化的餐饮选择。', '地王大厦东南57号', '11:00-14:00, 16:30-21:00', '人均60-70元', 117.256429, 29.308391, 4.3, '2025-05-27 11:17:51', '2025-05-29 10:08:21', 56);
INSERT INTO `food_culture` VALUES (330004, '欧记大排档', '具有独特风味的大排档，以其独特的烹饪方式和丰富的菜品受到食客的喜爱。', '浙江路88号', '11:00-14:00, 17:00-22:00', '人均70-80元', 117.222629, 29.291324, 3.9, '2025-05-27 11:17:51', '2025-05-29 10:08:21', 59);
INSERT INTO `food_culture` VALUES (330005, '老屋饭店', '历史悠久的饭店，以其传统的烹饪方法和经典的菜品而闻名。', '珠山区童滨路童街83号', '9:00-21:30', '人均70-80元', 117.221786, 29.298674, 4.2, '2025-05-27 11:17:51', '2025-05-29 10:08:21', 62);
INSERT INTO `food_culture` VALUES (330006, '谭婆饺子粑', '提供各种口味的饺子，皮薄馅多，是快速简便的餐饮选择。', '珠山区中华南路168号', '6:30-11:30, 14:30-17:30', '人均10-20元', 117.216558, 29.295898, 3.8, '2025-05-27 11:17:51', '2025-05-29 10:08:21', 64);
INSERT INTO `food_culture` VALUES (330007, '樊老头樊氏牛骨粉', '特色牛骨粉，汤鲜味美，粉条爽滑，是早餐或小吃的好选择。', '景德镇珠山中路工商银行南80米路西', '8:00-22:00', '人均20-30元', 117.323355, 29.334644, 3.7, '2025-05-27 11:17:51', '2025-05-29 10:08:21', 66);
INSERT INTO `food_culture` VALUES (330008, '小毛老面汤包', '传统面点，提供各种口味的汤包，是早餐的热门选择。', '陶瓷大学湘湖校区南门西100米', '6:00-次日3:00', '人均10-20元', 117.216557, 29.298700, 4.0, '2025-05-27 11:17:51', '2025-05-29 10:08:21', 68);

-- ----------------------------
-- Table structure for likes
-- ----------------------------
DROP TABLE IF EXISTS `likes`;
CREATE TABLE `likes`  (
  `like_id` int NOT NULL AUTO_INCREMENT COMMENT '点赞ID，主键',
  `post_id` int NOT NULL COMMENT '关联的帖子ID，外键参照posts表',
  `user_id` int NOT NULL COMMENT '点赞用户ID，外键参照user_info表',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
  PRIMARY KEY (`like_id`) USING BTREE,
  UNIQUE INDEX `uk_post_user`(`post_id` ASC, `user_id` ASC) USING BTREE COMMENT '确保用户对同一帖子只能点赞一次',
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 29 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '帖子点赞表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of likes
-- ----------------------------
INSERT INTO `likes` VALUES (24, 33, 2, '2025-06-02 13:50:21');
INSERT INTO `likes` VALUES (26, 32, 2, '2025-06-02 15:02:11');
INSERT INTO `likes` VALUES (27, 34, 2, '2025-06-02 17:06:23');
INSERT INTO `likes` VALUES (28, 15, 2, '2025-06-02 17:10:25');

-- ----------------------------
-- Table structure for post_images
-- ----------------------------
DROP TABLE IF EXISTS `post_images`;
CREATE TABLE `post_images`  (
  `image_id` int NOT NULL AUTO_INCREMENT COMMENT '图片ID，主键',
  `post_id` int NOT NULL COMMENT '关联的帖子ID，外键参照posts表',
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '图片URL',
  `upload_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  PRIMARY KEY (`image_id`) USING BTREE,
  INDEX `post_id`(`post_id` ASC) USING BTREE,
  CONSTRAINT `post_images_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 80 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '帖子图片表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of post_images
-- ----------------------------
INSERT INTO `post_images` VALUES (47, 31, '/uploads/1748836986688-106353014.webp', '2025-06-02 12:03:06');
INSERT INTO `post_images` VALUES (48, 31, '/uploads/1748836986683-957653136.webp', '2025-06-02 12:03:06');
INSERT INTO `post_images` VALUES (49, 31, '/uploads/1748836986694-532534766.webp', '2025-06-02 12:03:06');
INSERT INTO `post_images` VALUES (50, 31, '/uploads/1748836986703-897243317.webp', '2025-06-02 12:03:06');
INSERT INTO `post_images` VALUES (51, 31, '/uploads/1748836986711-486300834.webp', '2025-06-02 12:03:06');
INSERT INTO `post_images` VALUES (52, 31, '/uploads/1748836986718-182242837.webp', '2025-06-02 12:03:06');
INSERT INTO `post_images` VALUES (53, 31, '/uploads/1748836986726-651198620.webp', '2025-06-02 12:03:06');
INSERT INTO `post_images` VALUES (54, 31, '/uploads/1748836986734-375421394.webp', '2025-06-02 12:03:06');
INSERT INTO `post_images` VALUES (55, 31, '/uploads/1748836986742-75353960.webp', '2025-06-02 12:03:06');
INSERT INTO `post_images` VALUES (56, 32, '/uploads/1748837090591-915787530.webp', '2025-06-02 12:04:50');
INSERT INTO `post_images` VALUES (57, 32, '/uploads/1748837090598-978139760.webp', '2025-06-02 12:04:50');
INSERT INTO `post_images` VALUES (58, 32, '/uploads/1748837090604-217624087.webp', '2025-06-02 12:04:50');
INSERT INTO `post_images` VALUES (59, 32, '/uploads/1748837090612-836590065.webp', '2025-06-02 12:04:50');
INSERT INTO `post_images` VALUES (60, 32, '/uploads/1748837090620-400361840.webp', '2025-06-02 12:04:50');
INSERT INTO `post_images` VALUES (61, 32, '/uploads/1748837090626-74300127.webp', '2025-06-02 12:04:50');
INSERT INTO `post_images` VALUES (62, 32, '/uploads/1748837090633-727335907.webp', '2025-06-02 12:04:50');
INSERT INTO `post_images` VALUES (63, 32, '/uploads/1748837090640-355394954.webp', '2025-06-02 12:04:50');
INSERT INTO `post_images` VALUES (64, 33, '/uploads/1748837127043-378040969.webp', '2025-06-02 12:05:27');
INSERT INTO `post_images` VALUES (65, 33, '/uploads/1748837127052-44465326.webp', '2025-06-02 12:05:27');
INSERT INTO `post_images` VALUES (66, 33, '/uploads/1748837127060-411450507.webp', '2025-06-02 12:05:27');
INSERT INTO `post_images` VALUES (67, 33, '/uploads/1748837127067-646372292.webp', '2025-06-02 12:05:27');
INSERT INTO `post_images` VALUES (68, 33, '/uploads/1748837127075-766430024.webp', '2025-06-02 12:05:27');
INSERT INTO `post_images` VALUES (69, 33, '/uploads/1748837127082-326764011.webp', '2025-06-02 12:05:27');
INSERT INTO `post_images` VALUES (70, 33, '/uploads/1748837127090-766193310.webp', '2025-06-02 12:05:27');
INSERT INTO `post_images` VALUES (71, 33, '/uploads/1748837127096-596427090.webp', '2025-06-02 12:05:27');
INSERT INTO `post_images` VALUES (72, 33, '/uploads/1748837127104-267460477.webp', '2025-06-02 12:05:27');
INSERT INTO `post_images` VALUES (73, 34, '/uploads/1748837159577-92493748.webp', '2025-06-02 12:05:59');
INSERT INTO `post_images` VALUES (74, 34, '/uploads/1748837159584-349414473.webp', '2025-06-02 12:05:59');
INSERT INTO `post_images` VALUES (75, 34, '/uploads/1748837159592-40880235.webp', '2025-06-02 12:05:59');
INSERT INTO `post_images` VALUES (76, 34, '/uploads/1748837159599-319617511.webp', '2025-06-02 12:05:59');
INSERT INTO `post_images` VALUES (77, 34, '/uploads/1748837159608-302649747.webp', '2025-06-02 12:05:59');
INSERT INTO `post_images` VALUES (78, 34, '/uploads/1748837159616-749730186.webp', '2025-06-02 12:05:59');
INSERT INTO `post_images` VALUES (79, 34, '/uploads/1748837159623-102764596.webp', '2025-06-02 12:05:59');

-- ----------------------------
-- Table structure for posts
-- ----------------------------
DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts`  (
  `post_id` int NOT NULL AUTO_INCREMENT COMMENT '帖子ID，主键',
  `user_id` int NOT NULL COMMENT '发布用户ID，外键参照user_info表',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '帖子标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '帖子内容',
  `view_count` int NULL DEFAULT 0 COMMENT '浏览数',
  `like_count` int NULL DEFAULT 0 COMMENT '点赞数',
  `comment_count` int NULL DEFAULT 0 COMMENT '评论数',
  `post_status` enum('published','deleted') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'published' COMMENT '帖子状态',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `main_image_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`post_id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  INDEX `fk_main_image`(`main_image_id` ASC) USING BTREE,
  CONSTRAINT `fk_main_image` FOREIGN KEY (`main_image_id`) REFERENCES `post_images` (`image_id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 35 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '社区帖子表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of posts
-- ----------------------------
INSERT INTO `posts` VALUES (15, 2, '南昌→景德镇2天1夜超详大学生细穷游攻略', '📅 行程总览\n周五晚出发 → 周六全天景德镇市区 → 周日上午周边游 → 周日下午返程\n🚄 交通规划\n1. 南昌→景德镇\n- 去程：周五晚18:00-19:30高铁（南昌西→景德镇北，二等座¥104，车程1.5h）\n- 返程：周日晚18:30-20:00高铁（景德镇北→南昌西，票价同¥104）\n2. 市内交通\n- 公交：景德镇北站出站后坐901路（1元）直达市区，覆盖陶溪川、人民广场等景点\n- 电动车：租小电动¥30/天，灵活穿梭古巷（推荐陶溪川、三宝村骑行）\n- 打车：起步价¥6，3人拼车更划算（夜间到站建议提前打车）\n🏠 住宿推荐\n- 陶溪川附近青旅：人均¥50/晚，步行5分钟到夜市（如陶溪川国际青年旅舍）\n- 人民广场民宿：人均¥40/晚，近抚州弄美食街（适合夜宵党）\n---\n🗺 详细路线规划\nDay 1（周六）：\n上午\n- 8:00-9:00 早餐：抚州弄口油条包麻糍（¥5，脆油条+糯叽叽暴击）\n- 9:00-11:30 雕塑瓷厂：\n- 周六上午乐天市集（9-12点），学生证砍价¥10淘瑕疵陶瓷\n下午\n- 12:30-13:30午餐：吴记牛骨粉（¥20，辣到过瘾）+冷粉', 31, 0, 0, 'published', '2025-05-31 21:42:14', '2025-06-04 14:31:27', NULL);
INSERT INTO `posts` VALUES (31, 2, '🌿本地人私藏的4大景德镇露营公园！', '1⃣️西河湾沙滩公园\n🌟🌟🌟🌟\n✅推荐理由：唯一沙滩露营！绝美日落+浅滩玩水天花板，遛娃党&拍照党闭眼冲~\n⚠️避雷点：节假日人很多！卫生维护一般\n📌Tips：夏季全天暴晒注意防晒，适合带帐篷露营~\n2⃣️陶博城草坪营地\n🌟🌟🌟🌟🌟\n✅推荐理由：冷门宝藏地实锤！自带遮阳棚的懒人友好营地，逛完陶瓷交易中心直接来喝下午茶~\n✨隐藏玩法：打卡研学中心艺术建筑！\n📍陶博城研学中心\n3⃣️陶博城房车营地\n🌟🌟🌟🌟🌟🌟\n✅推荐理由：简直就是景德镇最最最完善的露营地！！具备天幕休闲区、自驾游露营区、帐篷区、儿童乐园/健身区！露天观影区以及烧烤区！！完善的生活功能区（晾晒区、淋浴房、厕所、洗车区..）4月底就正式完工啦！！不体验一趟遗憾一辈子...\n✨隐藏玩法：周末免费玩泥，领取鸡缸杯，自驾还能免费充电；交易中心逛品牌瓷！还有市集捡漏！晚上夜景很美，简直是灯光视觉盛宴~\n📍定位TBC自驾游营地\n4⃣️城市森林公园\n🌟🌟🌟🌟🌟\n✅推荐理由：森系露营天花板！手机直出《小森林》电影感~\n森林覆盖率非常高，天然氧吧，很适合带上小朋友野餐~\n💡终极建议：\n夏季记得', 36, 0, 0, 'published', '2025-06-02 12:03:06', '2025-06-04 14:31:50', 47);
INSERT INTO `posts` VALUES (32, 2, '景德镇已回武汉，3天2夜我的建议是、、、', '去景德镇不做攻略等于白来\n这是我熬夜整理的攻略\n希望给你们一些建议  帮到你们\n#武汉 #景德镇陶瓷 #景德镇 #景德镇旅游 #景德镇攻略 #景德镇三宝村 #景德镇 #景德镇旅行 #无滤镜旅行攻略 #值得N刷的宝藏出游地 #旅游小众城市 #极限特种兵旅游 #穷游攻略 #避开人挤人', 33, 0, 0, 'published', '2025-06-02 12:04:50', '2025-06-02 18:01:28', 56);
INSERT INTO `posts` VALUES (33, 2, '南昌→景德镇2天1夜超详大学生细穷游攻略', '📅 行程总览\n周五晚出发 → 周六全天景德镇市区 → 周日上午周边游 → 周日下午返程\n🚄 交通规划\n1. 南昌→景德镇\n- 去程：周五晚18:00-19:30高铁（南昌西→景德镇北，二等座¥104，车程1.5h）\n- 返程：周日晚18:30-20:00高铁（景德镇北→南昌西，票价同¥104）\n2. 市内交通\n- 公交：景德镇北站出站后坐901路（1元）直达市区，覆盖陶溪川、人民广场等景点\n- 电动车：租小电动¥30/天，灵活穿梭古巷（推荐陶溪川、三宝村骑行）\n- 打车：起步价¥6，3人拼车更划算（夜间到站建议提前打车）\n🏠 住宿推荐\n- 陶溪川附近青旅：人均¥50/晚，步行5分钟到夜市（如陶溪川国际青年旅舍）\n- 人民广场民宿：人均¥40/晚，近抚州弄美食街（适合夜宵党）\n---\n🗺 详细路线规划\nDay 1（周六）：\n上午\n- 8:00-9:00 早餐：抚州弄口油条包麻糍（¥5，脆油条+糯叽叽暴击）\n- 9:00-11:30 雕塑瓷厂：\n- 周六上午乐天市集（9-12点），学生证砍价¥10淘瑕疵陶瓷\n下午\n- 12:30-13:30午餐：吴记牛骨粉（¥20，辣到过瘾）+冷粉', 84, 0, 0, 'published', '2025-06-02 12:05:27', '2025-06-05 15:10:27', 64);
INSERT INTO `posts` VALUES (34, 2, '景德镇一日游攻略 ｜ 🔥CityWalk路线', '景德镇citywalk一日游不能错过这条线路🦌这里不仅景色美🏠还可以淘陶瓷，打卡热门景点哦~🗺\n·\n✅路线：陶瓷博物馆➡抚州弄➡御窑厂➡陶溪川➡雕塑瓷厂➡三宝村➡陶阳新村\n1⃣陶瓷博物馆：很火的无语佛在六楼，建议先去看无语佛，因为排队的人很多～\n2⃣抚州弄：景德镇美食集合地，必吃的油条包麻糍还有牛骨粉～\n3⃣御窑博物馆：博物馆建筑风格独特，获得了建筑大奖，拍照建议穿黑白配色或者新中式风格的衣服，很出片～\n4⃣陶溪川：陶溪川会审核摊位作者的资质和产品，所以作品质量很高。如果想拍照，可以直接去月亮广场，怎么拍都是大片～\n5⃣雕塑瓷厂：有很多宝藏小店，打卡点主要是涂鸦墙和木马，想拍照的宝子可以直接导航“不睡觉捏捏公园”～\n6⃣三宝村：打卡受气瓶，景德镇墙和楼梯，9494美学空间，三宝蓬艺术聚落，三宝国际陶艺村博物馆\n7⃣陶阳新村：景德镇小义乌，有很多有趣的小玩意，十元三串手链，瓷花等等，可以讲价～\n·\n✅好吃的美食\n👍小梁园·地道赣菜\n👍瓷厂印象·景德味道\n👍小毛老面汤包\n👍诚信油条\n👍陶姐冷粉\n👍谭婆饺子耙\n👍樊氏牛骨粉\n·\n#景德镇#景德镇旅游#景德镇旅游攻略#景德镇', 120, 0, 0, 'published', '2025-06-02 12:05:59', '2025-06-05 15:06:36', 73);

-- ----------------------------
-- Table structure for scenic_spot
-- ----------------------------
DROP TABLE IF EXISTS `scenic_spot`;
CREATE TABLE `scenic_spot`  (
  `spot_id` int NOT NULL AUTO_INCREMENT COMMENT '景点ID，主键',
  `spot_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '景点名称',
  `spot_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '景点详细介绍',
  `spot_address` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '景点地址',
  `opening_hours` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '开放时间',
  `ticket_price` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '门票价格',
  `longitude` decimal(10, 6) NOT NULL COMMENT '经度',
  `latitude` decimal(10, 6) NOT NULL COMMENT '纬度',
  `average_rating` decimal(3, 1) NULL DEFAULT 0.0 COMMENT '平均评分(0-5)',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `image_id` int NULL DEFAULT NULL COMMENT '关联的图片ID',
  PRIMARY KEY (`spot_id`) USING BTREE,
  INDEX `fk_image_id`(`image_id` ASC) USING BTREE,
  CONSTRAINT `fk_image_id` FOREIGN KEY (`image_id`) REFERENCES `spot_shop_images` (`image_id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `chk_average_rating` CHECK (`average_rating` between 0 and 5)
) ENGINE = InnoDB AUTO_INCREMENT = 110014 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '景德镇景点信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of scenic_spot
-- ----------------------------
INSERT INTO `scenic_spot` VALUES (110001, '陶溪川/陶阳里', '陶溪川/陶阳里是景德镇的文化新地标，集陶瓷艺术、文化体验和创意市集于一体，是游客体验景德镇陶瓷文化的好去处。', '景德镇市珠山区新厂西路150号', '8:00-20:00', '免费', 117.206909, 29.294850, 4.8, '2025-05-27 14:10:43', '2025-05-29 09:56:55', 18);
INSERT INTO `scenic_spot` VALUES (110002, '御窑博物馆', '御窑博物馆展示了景德镇御窑的历史和精品瓷器，是了解中国古代陶瓷艺术的重要场所。', '景德镇御窑博物馆，珠山区珠山中路187号', '8:00-22:00, 21:30停止入园', '免费', 117.071221, 29.296595, 4.8, '2025-05-27 14:10:43', '2025-05-29 10:00:22', 21);
INSERT INTO `scenic_spot` VALUES (110004, '皇窑', '皇窑是一个集陶瓷制作、展示和销售为一体的陶瓷文化园，游客可以亲手体验陶瓷制作过程。', '景德镇浮梁县高岭大道668号', '8:00-16:30', '45元', 117.302163, 29.323637, 4.5, '2025-05-27 14:10:43', '2025-05-29 10:00:22', 28);
INSERT INTO `scenic_spot` VALUES (110005, '瑶里', '瑶里古镇以其古朴的建筑风格和丰富的陶瓷文化而闻名，是探索景德镇陶瓷历史的好地方。', '景德镇市浮梁县瑶里镇', '8:00-20:00', '免费', 117.532931, 29.503664, 4.8, '2025-05-27 14:10:43', '2025-05-29 10:00:22', 31);
INSERT INTO `scenic_spot` VALUES (110006, '寒溪村', '寒溪村是一个宁静的乡村，以其美丽的自然风光和陶瓷文化而受到游客的喜爱。', '景德镇浮梁县臧湾乡寒溪村', '8:00-20:00', '免费', 117.414776, 29.463462, 4.5, '2025-05-27 14:10:43', '2025-05-29 10:00:22', 34);
INSERT INTO `scenic_spot` VALUES (110007, '雕塑瓷厂', '雕塑瓷厂是景德镇著名的陶瓷制作基地，以其精美的雕塑瓷器而闻名。', '景德镇新厂东路139号', '8:00-20:00', '免费', 117.254675, 29.302853, 4.9, '2025-05-27 14:10:43', '2025-05-29 10:00:22', 36);
INSERT INTO `scenic_spot` VALUES (110008, '瓷宫', '瓷宫展示了景德镇陶瓷艺术的精华，以其独特的建筑风格和丰富的陶瓷展品而受到赞誉。', '景德镇浮梁县031乡道新平村', '8:30-17:30', '25元', 117.262166, 29.382752, 4.8, '2025-05-27 14:10:43', '2025-05-29 10:00:22', 39);
INSERT INTO `scenic_spot` VALUES (110009, '中国陶瓷博物馆', '中国陶瓷博物馆收藏了从古至今的陶瓷艺术品，是学习和欣赏陶瓷艺术的绝佳场所。', '景德镇市昌江区紫晶北路1号', '9:00-17:00 (16:30停止入场)', '免费', 117.182152, 29.298589, 4.9, '2025-05-27 14:10:43', '2025-05-29 10:00:22', 42);
INSERT INTO `scenic_spot` VALUES (110010, '三宝村', '三宝村是景德镇的陶瓷艺术村，以其独特的陶瓷工作室和艺术氛围而受到艺术家和游客的喜爱。', '景德镇市珠山区三宝村四家里', '8:00-20:00', '免费', 117.269290, 29.262089, 4.6, '2025-05-27 14:10:43', '2025-05-29 10:00:22', 45);
INSERT INTO `scenic_spot` VALUES (110011, '陶阳新村', '陶阳新村是景德镇的陶瓷文化新区，汇集了众多陶瓷工作室和艺术展览，是体验现代陶瓷艺术的好去处。', '江西省景德镇市珠山区陶艺街', '8:00-20:00', '免费', 117.217883, 29.314630, 4.8, '2025-05-27 14:10:43', '2025-05-29 10:00:22', 49);
INSERT INTO `scenic_spot` VALUES (110012, '乐天集市', '乐天集市是景德镇著名的陶瓷市集，每周六上午开放，汇集了众多陶瓷艺术家和手工艺人的作品。', '景德镇雕塑瓷厂内', '每周六上午9点——12点 其他9:00—18:00', '25元', 117.250937, 29.302263, 4.7, '2025-05-27 14:10:43', '2025-05-29 10:00:22', 24);

-- ----------------------------
-- Table structure for spot_shop_images
-- ----------------------------
DROP TABLE IF EXISTS `spot_shop_images`;
CREATE TABLE `spot_shop_images`  (
  `image_id` int NOT NULL AUTO_INCREMENT COMMENT '图片ID，主键',
  `related_id` int NOT NULL COMMENT '关联的景点ID或店铺ID',
  `related_type` enum('spot','shop','food') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '图片URL',
  `is_main` tinyint(1) NULL DEFAULT 0 COMMENT '是否为主图',
  `upload_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  `image_index` int NOT NULL DEFAULT 1 COMMENT '图片在轮播图中的索引',
  PRIMARY KEY (`image_id`) USING BTREE,
  INDEX `idx_related`(`related_id` ASC, `related_type` ASC) USING BTREE COMMENT '关联ID和类型索引'
) ENGINE = InnoDB AUTO_INCREMENT = 77 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '景点和店铺图片表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of spot_shop_images
-- ----------------------------
INSERT INTO `spot_shop_images` VALUES (18, 110001, 'spot', 'https://vcg00.cfp.cn/creative/vcg/800/new/VCG211335042628.jpg', 1, '2025-05-27 15:14:38', 1);
INSERT INTO `spot_shop_images` VALUES (19, 110001, 'spot', 'https://vcg00.cfp.cn/creative/vcg/800/new/VCG211335042628.jpg', 0, '2025-05-27 15:14:38', 2);
INSERT INTO `spot_shop_images` VALUES (20, 110001, 'spot', 'https://vcg00.cfp.cn/creative/vcg/800/new/VCG211335042628.jpg', 0, '2025-05-27 15:14:38', 3);
INSERT INTO `spot_shop_images` VALUES (21, 110002, 'spot', 'https://img0.baidu.com/it/u=1050799846,295304534&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 1, '2025-05-27 15:14:38', 1);
INSERT INTO `spot_shop_images` VALUES (22, 110002, 'spot', 'https://img1.baidu.com/it/u=989392764,228111759&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=652', 0, '2025-05-27 15:14:38', 2);
INSERT INTO `spot_shop_images` VALUES (23, 110002, 'spot', 'https://img2.baidu.com/it/u=2703535341,3898692203&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', 0, '2025-05-27 15:14:38', 3);
INSERT INTO `spot_shop_images` VALUES (24, 110012, 'spot', 'https://img0.baidu.com/it/u=2059788143,3929426137&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 1, '2025-05-27 15:14:38', 1);
INSERT INTO `spot_shop_images` VALUES (25, 110012, 'spot', 'https://img0.baidu.com/it/u=2882998041,400256235&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 0, '2025-05-27 15:14:38', 2);
INSERT INTO `spot_shop_images` VALUES (26, 110012, 'spot', 'https://img2.baidu.com/it/u=772980349,59327063&fm=253&fmt=auto&app=138&f=JPEG?w=475&h=634', 0, '2025-05-27 15:14:38', 3);
INSERT INTO `spot_shop_images` VALUES (27, 110012, 'spot', 'https://img2.baidu.com/it/u=3698881074,1701013193&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 0, '2025-05-27 15:14:38', 4);
INSERT INTO `spot_shop_images` VALUES (28, 110004, 'spot', 'https://img2.baidu.com/it/u=428685713,627645291&fm=253&fmt=auto&app=138&f=JPEG?w=1025&h=634', 1, '2025-05-27 15:14:38', 1);
INSERT INTO `spot_shop_images` VALUES (29, 110004, 'spot', 'https://img1.baidu.com/it/u=830678009,2222030435&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500', 0, '2025-05-27 15:14:38', 2);
INSERT INTO `spot_shop_images` VALUES (30, 110004, 'spot', 'https://img2.baidu.com/it/u=2788507310,4148610685&fm=253&fmt=auto?w=1200&h=800', 0, '2025-05-27 15:14:38', 3);
INSERT INTO `spot_shop_images` VALUES (31, 110005, 'spot', 'https://img0.baidu.com/it/u=3624209036,3883007970&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067', 1, '2025-05-27 15:14:38', 1);
INSERT INTO `spot_shop_images` VALUES (32, 110005, 'spot', 'https://img1.baidu.com/it/u=1188477898,168050274&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1422', 0, '2025-05-27 15:14:38', 2);
INSERT INTO `spot_shop_images` VALUES (33, 110005, 'spot', 'https://img1.baidu.com/it/u=3978369638,3265216902&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 0, '2025-05-27 15:14:38', 3);
INSERT INTO `spot_shop_images` VALUES (34, 110006, 'spot', 'https://img1.baidu.com/it/u=2012836245,3138860022&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=656', 1, '2025-05-27 15:14:38', 1);
INSERT INTO `spot_shop_images` VALUES (35, 110006, 'spot', 'https://img0.baidu.com/it/u=1868865695,281677792&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=735', 0, '2025-05-27 15:14:38', 2);
INSERT INTO `spot_shop_images` VALUES (36, 110007, 'spot', 'https://img1.baidu.com/it/u=2099468184,3146495879&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1061', 1, '2025-05-27 15:14:38', 1);
INSERT INTO `spot_shop_images` VALUES (37, 110007, 'spot', 'https://img1.baidu.com/it/u=1146790861,1382850714&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 0, '2025-05-27 15:14:38', 2);
INSERT INTO `spot_shop_images` VALUES (38, 110007, 'spot', 'https://img2.baidu.com/it/u=1736132187,1626379822&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 0, '2025-05-27 15:14:38', 3);
INSERT INTO `spot_shop_images` VALUES (39, 110008, 'spot', 'https://img2.baidu.com/it/u=547403524,168604639&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=653', 1, '2025-05-27 15:14:38', 1);
INSERT INTO `spot_shop_images` VALUES (40, 110008, 'spot', 'https://img2.baidu.com/it/u=691712566,1618229235&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1200', 0, '2025-05-27 15:14:38', 2);
INSERT INTO `spot_shop_images` VALUES (41, 110008, 'spot', 'https://img0.baidu.com/it/u=2000950745,2592762352&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=664', 0, '2025-05-27 15:14:38', 3);
INSERT INTO `spot_shop_images` VALUES (42, 110009, 'spot', 'https://img0.baidu.com/it/u=2675836045,1160069498&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067', 1, '2025-05-27 15:14:38', 1);
INSERT INTO `spot_shop_images` VALUES (43, 110009, 'spot', 'https://img1.baidu.com/it/u=313583677,1195577387&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 0, '2025-05-27 15:14:38', 2);
INSERT INTO `spot_shop_images` VALUES (44, 110009, 'spot', 'https://img2.baidu.com/it/u=3164057292,1002082102&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500', 0, '2025-05-27 15:14:38', 3);
INSERT INTO `spot_shop_images` VALUES (45, 110010, 'spot', 'https://img0.baidu.com/it/u=3899263554,3553410986&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=640', 1, '2025-05-27 15:14:38', 1);
INSERT INTO `spot_shop_images` VALUES (46, 110010, 'spot', 'https://img0.baidu.com/it/u=2028637999,3449284042&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067', 0, '2025-05-27 15:14:38', 2);
INSERT INTO `spot_shop_images` VALUES (47, 110010, 'spot', 'https://img0.baidu.com/it/u=3691943597,3836233998&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=737', 0, '2025-05-27 15:14:38', 3);
INSERT INTO `spot_shop_images` VALUES (48, 110010, 'spot', 'https://img0.baidu.com/it/u=657067391,2273777160&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=653', 0, '2025-05-27 15:14:38', 4);
INSERT INTO `spot_shop_images` VALUES (49, 110011, 'spot', 'https://img0.baidu.com/it/u=1402168634,3162162086&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=667', 1, '2025-05-27 15:14:38', 1);
INSERT INTO `spot_shop_images` VALUES (50, 330001, 'food', 'https://img1.baidu.com/it/u=2316187037,4006979068&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 1, '2025-05-29 09:39:25', 1);
INSERT INTO `spot_shop_images` VALUES (51, 330001, 'food', 'https://img1.baidu.com/it/u=1959418261,1273305168&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 0, '2025-05-29 09:39:25', 2);
INSERT INTO `spot_shop_images` VALUES (52, 330001, 'food', 'https://img0.baidu.com/it/u=130093190,2944843483&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 0, '2025-05-29 09:39:25', 3);
INSERT INTO `spot_shop_images` VALUES (53, 330002, 'food', 'https://img2.baidu.com/it/u=3915857269,3761648598&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 1, '2025-05-29 09:39:25', 1);
INSERT INTO `spot_shop_images` VALUES (54, 330002, 'food', 'https://img0.baidu.com/it/u=180522640,250461105&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500', 0, '2025-05-29 09:39:25', 2);
INSERT INTO `spot_shop_images` VALUES (55, 330002, 'food', 'https://img0.baidu.com/it/u=1771114253,2221738794&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750', 0, '2025-05-29 09:39:25', 3);
INSERT INTO `spot_shop_images` VALUES (56, 330003, 'food', 'https://img1.baidu.com/it/u=784652931,102411413&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 1, '2025-05-29 09:39:25', 1);
INSERT INTO `spot_shop_images` VALUES (57, 330003, 'food', 'https://img1.baidu.com/it/u=3994938990,1993226024&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 0, '2025-05-29 09:39:25', 2);
INSERT INTO `spot_shop_images` VALUES (58, 330003, 'food', 'https://img1.baidu.com/it/u=2412206938,1310231806&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 0, '2025-05-29 09:39:25', 3);
INSERT INTO `spot_shop_images` VALUES (59, 330004, 'food', 'https://img0.baidu.com/it/u=1533313354,3551785356&fm=253&fmt=auto&app=138&f=JPEG?w=667&h=500', 1, '2025-05-29 09:39:25', 1);
INSERT INTO `spot_shop_images` VALUES (60, 330004, 'food', 'https://img0.baidu.com/it/u=1456871836,1268827639&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 0, '2025-05-29 09:39:25', 2);
INSERT INTO `spot_shop_images` VALUES (61, 330004, 'food', 'https://img2.baidu.com/it/u=2196906930,673603338&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 0, '2025-05-29 09:39:25', 3);
INSERT INTO `spot_shop_images` VALUES (62, 330005, 'food', 'https://img0.baidu.com/it/u=3485279240,38354319&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1559', 1, '2025-05-29 09:39:25', 1);
INSERT INTO `spot_shop_images` VALUES (63, 330005, 'food', 'https://img0.baidu.com/it/u=1333641188,3197805442&fm=253&fmt=auto&app=138&f=JPEG?w=375&h=500', 0, '2025-05-29 09:39:25', 2);
INSERT INTO `spot_shop_images` VALUES (64, 330006, 'food', 'https://img1.baidu.com/it/u=1542902897,213439327&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 1, '2025-05-29 09:39:25', 1);
INSERT INTO `spot_shop_images` VALUES (65, 330006, 'food', 'https://img0.baidu.com/it/u=2004712975,3759354217&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 0, '2025-05-29 09:39:25', 2);
INSERT INTO `spot_shop_images` VALUES (66, 330007, 'food', 'https://img2.baidu.com/it/u=1026284510,4266855381&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 1, '2025-05-29 09:39:25', 1);
INSERT INTO `spot_shop_images` VALUES (67, 330007, 'food', 'https://img1.baidu.com/it/u=3450728754,4248101075&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 0, '2025-05-29 09:39:25', 2);
INSERT INTO `spot_shop_images` VALUES (68, 330008, 'food', 'https://img2.baidu.com/it/u=316176970,3409920436&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=653', 1, '2025-05-29 09:39:25', 1);
INSERT INTO `spot_shop_images` VALUES (69, 330008, 'food', 'https://img1.baidu.com/it/u=4111827869,4082345147&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 0, '2025-05-29 09:39:25', 2);
INSERT INTO `spot_shop_images` VALUES (70, 220001, 'shop', 'https://qcloud.dpfile.com/pc/RBtbtr8itncULGqAhkclFiAcu97ynaCNz9xgR2FEU4VuNATpsHqI-QSz8IMrusCh.jpg', 1, '2025-05-29 11:02:01', 1);
INSERT INTO `spot_shop_images` VALUES (71, 220001, 'shop', 'https://qcloud.dpfile.com/pc/ihcTJcn8alkCRBf7YlivoJnfdNZag6MYF54pw5x6GaG1NpX6wMdvSN80YpcTbMKw.jpg', 0, '2025-05-29 11:02:01', 2);
INSERT INTO `spot_shop_images` VALUES (72, 220001, 'shop', 'https://qcloud.dpfile.com/pc/jg9CV5f8s_xsPoGuzqLoZ5huXFSGxMKKACnlWMk_Rcs4RbSN-3XhH1U9rUaplI-0.jpg', 0, '2025-05-29 11:02:01', 3);
INSERT INTO `spot_shop_images` VALUES (73, 220002, 'shop', 'https://img2.baidu.com/it/u=623139579,3922101844&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=653', 1, '2025-05-29 11:02:01', 1);
INSERT INTO `spot_shop_images` VALUES (74, 220002, 'shop', 'https://miaobi-lite.bj.bcebos.com/miaobi/5mao/b%27LV8xNzM0MDY1ODM3LjIxNzc3OTlfMTczNDA2NTgzOC4yNTUxMDc0%27/1.png', 0, '2025-05-29 11:02:01', 2);
INSERT INTO `spot_shop_images` VALUES (75, 220003, 'shop', 'https://p1.meituan.net/dpdeal/f424056d217bfaebc8a6d511a9787010565630.jpg%40700w_700h_1e_1c_1l%7Cwatermark=1&&r=1&p=9&x=2&y=2&relative=1&o=20', 1, '2025-05-29 11:02:01', 1);
INSERT INTO `spot_shop_images` VALUES (76, 220003, 'shop', 'https://img0.baidu.com/it/u=3439884531,1667586634&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667', 0, '2025-05-29 11:02:01', 2);

-- ----------------------------
-- Table structure for user_favorites
-- ----------------------------
DROP TABLE IF EXISTS `user_favorites`;
CREATE TABLE `user_favorites`  (
  `favorite_id` int NOT NULL AUTO_INCREMENT COMMENT '收藏ID，主键',
  `user_id` int NOT NULL COMMENT '用户ID，外键参照user_info表',
  `related_id` int NOT NULL COMMENT '关联的景点ID或店铺ID',
  `related_type` enum('spot','shop','food') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  PRIMARY KEY (`favorite_id`) USING BTREE,
  UNIQUE INDEX `uk_user_related`(`user_id` ASC, `related_id` ASC, `related_type` ASC) USING BTREE COMMENT '确保用户对同一项目只能收藏一次',
  CONSTRAINT `user_favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 51 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户收藏表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_favorites
-- ----------------------------
INSERT INTO `user_favorites` VALUES (19, 2, 330008, 'food', '2025-06-02 00:41:55');
INSERT INTO `user_favorites` VALUES (28, 2, 110011, 'spot', '2025-06-02 00:46:20');
INSERT INTO `user_favorites` VALUES (40, 2, 110007, 'spot', '2025-06-02 14:40:46');
INSERT INTO `user_favorites` VALUES (42, 2, 110012, 'spot', '2025-06-02 15:01:14');
INSERT INTO `user_favorites` VALUES (43, 2, 110010, 'spot', '2025-06-02 16:50:55');
INSERT INTO `user_favorites` VALUES (46, 2, 220002, 'shop', '2025-06-02 18:00:20');
INSERT INTO `user_favorites` VALUES (49, 2, 220003, 'shop', '2025-06-05 15:09:40');
INSERT INTO `user_favorites` VALUES (50, 2, 330005, 'food', '2025-06-05 15:09:45');

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info`  (
  `user_id` int NOT NULL AUTO_INCREMENT COMMENT '用户ID，主键',
  `openid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '微信openid',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户名',
  `avatar_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像URL',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '邮箱',
  `user_type` enum('normal','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'normal' COMMENT '用户类型(普通用户/管理员)',
  `registration_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `last_login_time` timestamp NULL DEFAULT NULL COMMENT '最后登录时间',
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'active' COMMENT '账号状态',
  `password` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户密码（加密存储）',
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '',
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `openid`(`openid` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '用户信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_info
-- ----------------------------
INSERT INTO `user_info` VALUES (2, 'o1234567890abcdefg', NULL, 'http://localhost:3000/uploads/1749018702038-995692428.webp', '15180292557', '2640586414@qq.com', 'admin', '2025-05-29 15:54:11', '2025-05-29 15:54:11', 'active', '123456', 'qiqi');
INSERT INTO `user_info` VALUES (3, NULL, 'qiqi', '', '18322874077', '', 'normal', '2025-05-29 16:41:47', NULL, 'active', '123456', 'qiqi');
INSERT INTO `user_info` VALUES (5, NULL, 'yangping', '/uploads/1748855325053-408694769.webp', '19198354985', '', 'normal', '2025-05-29 20:45:58', NULL, 'active', '123456', 'yp');
INSERT INTO `user_info` VALUES (9, NULL, 'glq', 'http://192.168.205.211:3000/uploads/1748916604201-666427360.jpg', '18322874077', '', 'normal', '2025-06-03 10:09:11', NULL, 'active', '123456', 'glq');

SET FOREIGN_KEY_CHECKS = 1;
