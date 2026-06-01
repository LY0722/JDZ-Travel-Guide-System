const { pool } = require('../config/db');

// 获取所有管理员日志
exports.getAllLogs = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM admin_logs ORDER BY action_time DESC');
    res.json({ total: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ error: '获取日志失败', details: err.message });
  }
};

// 根据ID获取单条日志
exports.getLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM admin_logs WHERE log_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: '日志不存在' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: '获取日志失败', details: err.message });
  }
};

// 新增日志
exports.createLog = async (req, res) => {
  try {
    const { admin_id, action_type, action_target, target_id, action_details, ip_address } = req.body;
    const [result] = await pool.query(
      'INSERT INTO admin_logs (admin_id, action_type, action_target, target_id, action_details, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
      [admin_id, action_type, action_target, target_id, action_details, ip_address]
    );
    res.json({ message: '日志添加成功', log_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: '添加日志失败', details: err.message });
  }
};

// 删除日志
exports.deleteLog = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM admin_logs WHERE log_id = ?', [id]);
    res.json({ message: '删除成功', affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: '删除失败', details: err.message });
  }
};