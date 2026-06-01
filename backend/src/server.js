// 服务器启动文件
const express = require('express');
const pool = require('./config/db');
const redisClient = require('./config/redis'); // 引入Redis配置

// 引入所有路由
const scenicSpotRouter = require('./routes/scenicSpot');
const shopRouter = require('./routes/shop');
const userRouter = require('./routes/user');
const adminLogsRouter = require('./routes/adminLogs');
const browseHistoryRouter = require('./routes/browseHistory');
const commentsRouter = require('./routes/comments');
const favoritesRouter = require('./routes/favorites');
const postsRouter = require('./routes/posts');
const qaRecordsRouter = require('./routes/qaRecords');
const ratingsRouter = require('./routes/ratings');
const routePlansRouter = require('./routes/routePlans');
const imagesRouter = require('./routes/images');
const foodCultureRouter = require('./routes/foodCulture');
const postImagesRouter = require('./routes/postImages');
const likesRouter = require('./routes/likes');

const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// server.js
app.use((req, res, next) => {
  // console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});
// 静态文件托管
const path = require('path');
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// 根路径欢迎接口
app.get('/', (req, res) => {
  res.status(200).json({
    message: '欢迎使用瓷都匠艺之旅后端服务',
    version: '1.0.0',
    routes: {
      search: '/api/search',
      scenicSpot: '/api/scenic-spot',
      shop: '/api/shop',
      user: '/api/user',
      adminLogs: '/api/admin-logs',
      browseHistory: '/api/browse-history',
      comments: '/api/comments',
      favorites: '/api/favorites',
      posts: '/api/posts',
      qaRecords: '/api/qa-records',
      ratings: '/api/ratings',
      routePlans: '/api/route-plans'
    }
  });
});

// 通用搜索接口（保持不变）
app.post('/api/search', express.json(), async (req, res) => {
  try {
    const { query, type } = req.body;
    const searchQuery = query.toLowerCase();
    let tableName, searchFields;

    switch (type) {
      case 'spot':
        tableName = 'scenic_spot';
        searchFields = ['spot_name', 'spot_description'];
        break;
      case 'shop':
        tableName = 'experience_shop';
        searchFields = ['shop_name', 'shop_description'];
        break;
      case 'food':
        tableName = 'food_culture';
        searchFields = ['food_name', 'food_description'];
        break;
      default:
        return res.status(400).json({ error: '无效的搜索类型' });
    }

    const likeClauses = searchFields.map(field => `LOWER(${field}) LIKE ?`).join(' OR ');
    const [rows] = await pool.query(
      `SELECT * FROM ${tableName} WHERE ${likeClauses}`,
      searchFields.map(() => `%${searchQuery}%`)
    );

    res.status(200).json({
      total: rows.length,
      results: rows
    });

  } catch (error) {
    console.error('搜索服务异常:', error);
    res.status(500).json({
      error: '服务器内部错误',
      details: error.message
    });
  }
});

// 挂载所有路由
app.use('/api/scenic-spot', scenicSpotRouter);
app.use('/api/shop', shopRouter);
app.use('/api/user', userRouter);
app.use('/api/admin-logs', adminLogsRouter);
app.use('/api/browse-history', browseHistoryRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/posts', postsRouter);
app.use('/api/post-images', postImagesRouter);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/api/qa-records', qaRecordsRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api/route-plans', routePlansRouter);
app.use('/api/images', imagesRouter);
app.use('/api/food', foodCultureRouter);

app.use('/api/likes', likesRouter);

app.get('/docs', (req, res) => {
  res.sendFile(__dirname + '/docs.html');
});


// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] 服务器启动成功，端口：${PORT}`);
  console.log(`[API文档] 请访问 http://localhost:${PORT}/docs 查看接口列表`);
});
