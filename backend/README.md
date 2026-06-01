# 瓷都匠艺之旅 后端服务

本项目为“瓷都匠艺之旅”小程序的后端服务，基于 **Node.js + Express + MySQL** 实现，提供景点、体验店、美食、社区、用户、AI 问答等核心数据接口，支持丰富的旅游与社交功能。

---

## 目录结构

```
ceramic_guide_backend/
├── db/                   # 数据库相关
│   ├── jdztravel.sql      # 数据库SQL文件
│   └── migrate.js         # 数据库迁移脚本
├── src/                  # 后端源代码
│   ├── config/           # 配置文件
│   │   ├── db.js          # 数据库配置
│   │   └── server.js      # 服务器配置
│   ├── controllers/      # 控制器层（业务逻辑）
│   │   ├── adminLogs.js   # 管理日志
│   │   ├── comments.js    # 评论管理
│   │   ├── favorites.js   # 收藏管理
│   │   ├── foodCulture.js # 美食文化
│   │   ├── images.js      # 图片处理
│   │   ├── posts.js       # 帖子管理
│   │   ├── scenicSpot.js  # 景点管理
│   │   ├── shop.js        # 店铺管理
│   │   └── user.js        # 用户管理
│   ├── middlewares/      # 中间件
│   │   ├── auth.js        # 身份验证
│   │   └── error.js       # 错误处理
│   ├── routes/           # 路由定义
│   │   ├── api.js         # API路由
│   │   └── index.js       # 路由入口
│   ├── utils/            # 工具函数
│   │   └── helpers.js     # 公共工具函数
│   ├── docs.html         # API文档
│   └── server.js         # 服务启动文件
├── README.md             # 项目说明
├── package.json          # 项目依赖配置
└── package-lock.json     # 依赖版本锁定
```

---

## 环境要求

- Node.js 16+
- MySQL 8.0+
- 推荐使用 [Navicat](https://www.navicat.com.cn/) 或命令行管理数据库

---

## 安装与启动

1. **安装依赖**

   ```bash
   npm install
   ```

2. **配置数据库**

   修改 `.env` 或 `src/config/db.js` 中的数据库连接信息。

3. **初始化数据库结构**

   ```bash
   npm run migrate
   ```
   或手动导入 `db/jdztravel.sql` 到你的 MySQL 数据库。

4. **启动服务**

   ```bash
   npm start
   ```

   默认监听端口：`3000`

5. **访问接口文档**

   浏览器打开 [http://localhost:3000/docs](http://localhost:3000/docs)

---

## 主要功能模块

- **景点信息（Scenic Spot）**：景点增删改查、图片管理
- **体验店（Experience Shop）**：陶艺体验店管理
- **美食文化（Food Culture）**：本地美食管理
- **用户管理（User）**：注册、登录、资料编辑、头像上传
- **社区互动**：
  - 帖子（发布、删除、图片上传）
  - 评论（支持楼中楼、删除）
  - 点赞（支持取消、查询用户点赞列表）
  - 收藏（支持取消、查询用户收藏列表）
  - 浏览历史（记录与查询）
- **评分系统**：对景点、体验店、美食等打分
- **AI知识问答**：集成 DeepSeek API，支持本地问答历史与反馈记录
- **管理员操作日志**：后台管理操作记录
- **路线规划**：用户自定义旅游路线
- **图片管理**：统一图片上传与获取

---

## 常用接口示例

- 获取所有景点：`GET /api/scenic-spot`
- 获取单个体验店：`GET /api/shop/:id`
- 用户收藏：`POST /api/favorites`
- AI问答记录：`POST /api/qa-records`
- 获取图片：`GET /api/images?related_id=xxx&related_type=spot|shop|food`
- 用户上传头像：`POST /api/user/upload-avatar`
- 获取用户所有评论：`GET /api/comments/user/:user_id`
- 获取用户所有帖子：`GET /api/posts/user/:user_id`

详细接口说明见 [docs.html](src/docs.html) 或访问 `/docs`。

---

## API 速览

所有接口前缀均为 `/api/`，返回格式为 `application/json`。

- 用户：`/api/user`、`/api/user/:id`、`/api/user/upload-avatar`
- 景点：`/api/scenic-spot`、`/api/scenic-spot/:id`
- 体验店：`/api/shop`、`/api/shop/:id`
- 美食：`/api/food`、`/api/food/:id`
- 帖子：`/api/posts`、`/api/posts/:id`、`/api/posts/user/:user_id`
- 评论：`/api/comments`、`/api/comments/:id`、`/api/comments/user/:user_id`
- 点赞：`/api/likes`、`/api/likes/user`
- 收藏：`/api/favorites`、`/api/favorites/user/:user_id`
- 浏览历史：`/api/browse-history`、`/api/browse-history/user/:user_id`
- 评分：`/api/ratings`
- 路线规划：`/api/route-plans`
- AI问答：`/api/qa-records`
- 管理员日志：`/api/admin-logs`
- 图片：`/api/images`
- 通用搜索：`/api/search`

---

## 数据安全与扩展

- 所有接口返回 JSON 格式数据。
- 支持跨表外键约束，数据安全性高。
- 日志、错误处理、权限校验等可根据实际需求扩展。
- 支持图片上传与静态资源访问。

---

## 贡献与反馈

如需贡献代码、反馈问题或有新需求，欢迎提交 issue 或联系项目开发者。

---

## License

MIT License

---