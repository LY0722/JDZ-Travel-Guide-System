// 帖子评论相关逻辑
const { pool } = require('../config/db');

exports.getAllComments = async (req, res) => {
  try {
    const { post_id } = req.query;
    let sql = 'SELECT * FROM comments';
    let params = [];
    if (post_id) {
      sql += ' WHERE post_id = ?';
      params.push(post_id);
    }
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: '获取评论失败', details: err.message });
  }
};

// 根据ID获取单条评论
exports.getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM comments WHERE comment_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: '评论不存在' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: '获取评论失败', details: err.message });
  }
};
exports.getCommentsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const [rows] = await pool.query('SELECT * FROM comments WHERE user_id = ? ORDER BY comment_id DESC', [user_id]);
    res.json({ total: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ error: '获取用户评论失败', details: err.message });
  }
};
// 新增评论
exports.createComment = async (req, res) => {
  try {
    console.log('收到评论参数:', req.body);
    const { post_id, user_id, content, parent_id } = req.body;
    if (!post_id || !user_id || !content) {
      return res.status(400).json({ error: '缺少参数' });
    }
    const [result] = await pool.query(
      'INSERT INTO comments (post_id, user_id, content, parent_id) VALUES (?, ?, ?, ?)',
      [post_id, user_id, content, parent_id || null]
    );
    res.json({ message: '评论添加成功', comment_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: '添加评论失败', details: err.message });
  }
};

// 删除评论
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM comments WHERE comment_id = ?', [id]);
    res.json({ message: '删除成功', affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: '删除失败', details: err.message });
  }
};