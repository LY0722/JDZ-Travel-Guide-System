const { pool } = require('../config/db');
const path = require('path');

exports.uploadPostImage = async (req, res) => {
  try {
    // console.log('收到上传：', req.body, req.file); // 加这一行
    const post_id = req.body.post_id;
    if (!post_id) return res.status(400).json({ error: '缺少post_id' });
    if (!req.file) return res.status(400).json({ error: '没有上传文件' });

    const image_url = '/uploads/' + req.file.filename;
    const [result] = await pool.query(
      'INSERT INTO post_images (post_id, image_url) VALUES (?, ?)',
      [post_id, image_url]
    );
    res.json({
      image_id: result.insertId,
      image_url
    });
  } catch (err) {
    console.error('图片上传失败', err); // 加这一行
    res.status(500).json({ error: '图片上传失败', details: err.message });
  }
};
// 获取帖子图片
exports.getImagesByPost = async (req, res) => {
  try {
    const { post_id } = req.query;
    if (!post_id) return res.status(400).json({ error: '缺少post_id' });
    const [rows] = await pool.query(
      'SELECT * FROM post_images WHERE post_id = ? ORDER BY image_id ASC',
      [post_id]
    );
    res.json({ total: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ error: '获取图片失败', details: err.message });
  }
};