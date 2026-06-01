# 景德镇旅游指南系统 (JDZ Travel Guide System)

## 系统简介
本系统是一个专门为景德镇旅游设计的导览系统，提供景点介绍、陶瓷文化体验店预约、当地美食推荐、旅游社区互动以及智能问答等功能。

## 项目结构
- `backend/`: 基于 Node.js 的后端 API 服务
- `frontend/`: 基于 uni-app 的跨平台移动端应用

## 技术栈
- **后端**: Node.js, Express, MySQL, Redis (用于缓存)
- **前端**: Vue.js, uni-app

## 系统要求
- Node.js 14+
- MySQL 8.0+
- Redis (可选，用于性能优化)
- HBuilderX（用于运行前端）

## 安装与运行

### 1. 数据库配置
- 创建名为 `jdztravel` 的数据库。
- 导入数据库初始化脚本。
- 修改 `backend/src/config/db.js` 中的连接信息。

### 2. 后端启动
```bash
cd backend
npm install
node src/server.js
```

### 3. 前端启动
```bash
cd frontend
npm install
# 使用 HBuilderX 运行
```

## 主要功能
- **景点导览**: 详细的景点介绍、门票预约及地图定位。
- **陶瓷体验**: 景德镇特色陶瓷店搜索与预约。
- **美食发现**: 当地特色美食及餐馆推荐。
- **互动社区**: 用户可以发布动态、评论和点赞。
- **智能问答**: 提供旅游相关的 AI 智能咨询。
