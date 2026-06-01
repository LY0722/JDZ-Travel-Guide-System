// src/controllers/posts.js
const { pool } = require('../config/db');
const redisClient = require('../config/redis');

// 获取所有帖子（带缓存）
exports.getAllPosts = async (req, res) => {
  try {
    // 先查缓存
    redisClient.get('all_posts', async (err, cachedData) => {
      if (cachedData) {
        return res.json({ 
          data: JSON.parse(cachedData),
          source: 'cache'
        });
      }

      // 缓存不存在时查询数据库
      const [rows] = await pool.query('SELECT * FROM posts ORDER BY post_id DESC');
      
      // 写入缓存（30秒过期）
      redisClient.setex('all_posts', 30, JSON.stringify(rows));
      
      res.json({ 
        data: rows,
        source: 'database'
      });
    });
  } catch (err) {
    res.status(500).json({ error: '获取帖子失败', details: err.message });
  }
};

// 新增帖子（清除缓存）
exports.createPost = async (req, res) => {
  try {
    const { user_id, title, content } = req.body;
    
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [postResult] = await connection.query(
        'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)',
        [user_id, title, content]
      );
      
      const postId = postResult.insertId;
      
      if (req.body.main_image_id) {
        await connection.query(
          'UPDATE posts SET main_image_id = ? WHERE post_id = ?',
          [req.body.main_image_id, postId]
        );
      }
      
      await connection.commit();
      
      // 清除缓存
      redisClient.del('all_posts');
      
      res.json({ 
        message: '帖子添加成功',
        post_id: postId
      });
      
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
    
  } catch (err) {
    res.status(500).json({ error: '添加帖子失败', details: err.message });
  }
};

// 删除帖子（清除缓存）
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM posts WHERE post_id = ?', [id]);
    
    // 清除缓存
    redisClient.del('all_posts');
    
    res.json({ message: '删除成功', affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: '删除失败', details: err.message });
  }
};