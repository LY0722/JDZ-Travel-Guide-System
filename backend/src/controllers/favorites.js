// 用户收藏相关逻辑
const { pool } = require('../config/db');

// 获取所有收藏
exports.getAllFavorites = async (req, res) => {
  try {
    const { user_id, related_id, related_type } = req.query;
    let sql = 'SELECT * FROM user_favorites WHERE 1=1';
    const params = [];
    if (user_id) {
      sql += ' AND user_id = ?';
      params.push(user_id);
    }
    if (related_id) {
      sql += ' AND related_id = ?';
      params.push(related_id);
    }
    if (related_type) {
      sql += ' AND related_type = ?';
      params.push(related_type);
    }
    sql += ' ORDER BY favorite_id DESC';
    const [rows] = await pool.query(sql, params);
    res.json({ total: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ error: '获取收藏失败', details: err.message });
  }
};
// 根据ID获取单条收藏
exports.getFavoriteById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM user_favorites WHERE favorite_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: '收藏不存在' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: '获取收藏失败', details: err.message });
  }
};
exports.getFavoritesByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const [rows] = await pool.query('SELECT * FROM user_favorites WHERE user_id = ? ORDER BY favorite_id DESC', [user_id]);
    res.json({ total: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ error: '获取用户收藏失败', details: err.message });
  }
};
// 新增收藏
exports.createFavorite = async (req, res) => {
  try {
    const { user_id, related_id, related_type } = req.body;
    const [result] = await pool.query(
      'INSERT INTO user_favorites (user_id, related_id, related_type) VALUES (?, ?, ?)',
      [user_id, related_id, related_type]
    );
    res.json({ message: '收藏添加成功', favorite_id: result.insertId });
  } catch (err) {
    // 唯一索引冲突
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: '该项目已收藏' });
    } else {
      res.status(500).json({ error: '添加收藏失败', details: err.message });
    }
  }
};

// 删除收藏
exports.deleteFavorite = async (req, res) => {
  try {
    // 添加调试日志
    console.log('收到删除请求:', {
      method: req.method,
      params: req.params,
      query: req.query,
      body: req.body,
      headers: req.headers
    });

    const { id } = req.params;
    
    // 确保ID是数字
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ error: '无效的收藏ID' });
    }

    const [result] = await pool.query(
      'DELETE FROM user_favorites WHERE favorite_id = ?', 
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '未找到该收藏记录' });
    }

    res.json({ 
      message: '删除成功',
      affectedRows: result.affectedRows 
    });
  } catch (err) {
    console.error('删除失败:', err);
    res.status(500).json({ 
      error: '删除失败',
      details: err.message 
    });
  }
};