// 用户浏览历史相关逻辑
const { pool } = require('../config/db');

// 获取所有浏览历史
exports.getAllHistory = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM browse_history ORDER BY history_id DESC');
    res.json({ total: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ error: '获取浏览历史失败', details: err.message });
  }
};

// 根据ID获取单条浏览历史
exports.getHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM browse_history WHERE history_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: '浏览历史不存在' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: '获取浏览历史失败', details: err.message });
  }
};
exports.getHistoryByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const [rows] = await pool.query('SELECT * FROM browse_history WHERE user_id = ? ORDER BY history_id DESC', [user_id]);
    res.json({ total: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ error: '获取用户浏览历史失败', details: err.message });
  }
};

// 新增浏览历史
exports.createHistory = async (req, res) => {
  try {
    const { user_id, related_id, related_type } = req.body;
    if (!user_id || !related_id || !related_type) {
      return res.status(400).json({ error: '缺少参数' });
    }
    const [result] = await pool.query(
      'INSERT INTO browse_history (user_id, related_id, related_type) VALUES (?, ?, ?)',
      [user_id, related_id, related_type]
    );
    res.json({ message: '浏览历史添加成功', history_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: '添加浏览历史失败', details: err.message });
  }
};

// 删除浏览历史
exports.deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM browse_history WHERE history_id = ?', [id]);
    res.json({ message: '删除成功', affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: '删除失败', details: err.message });
  }
};