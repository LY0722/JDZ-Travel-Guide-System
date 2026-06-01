// 用户评分相关逻辑
const { pool } = require('../config/db');

// 获取所有评分
exports.getAllRatings = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM user_ratings ORDER BY rating_id DESC');
    res.json({ total: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ error: '获取评分失败', details: err.message });
  }
};

// 根据ID获取单条评分
exports.getRatingById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM user_ratings WHERE rating_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: '评分不存在' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: '获取评分失败', details: err.message });
  }
};

// 新增评分
exports.createRating = async (req, res) => {
  try {
    const { user_id, related_id, related_type, rating_value, rating_comment } = req.body;
    const [result] = await pool.query(
      'INSERT INTO user_ratings (user_id, related_id, related_type, rating_value, rating_comment) VALUES (?, ?, ?, ?, ?)',
      [user_id, related_id, related_type, rating_value, rating_comment]
    );
    res.json({ message: '评分添加成功', rating_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: '添加评分失败', details: err.message });
  }
};

// 删除评分
exports.deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM user_ratings WHERE rating_id = ?', [id]);
    res.json({ message: '删除成功', affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: '删除失败', details: err.message });
  }
};