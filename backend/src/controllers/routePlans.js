// 路线规划相关逻辑
const { pool } = require('../config/db');

// 获取所有路线规划
exports.getAllPlans = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM route_plans ORDER BY plan_id DESC');
    res.json({ total: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ error: '获取路线规划失败', details: err.message });
  }
};

// 根据ID获取单条路线规划
exports.getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM route_plans WHERE plan_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: '路线规划不存在' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: '获取路线规划失败', details: err.message });
  }
};

// 新增路线规划
exports.createPlan = async (req, res) => {
  try {
    const { user_id, start_longitude, start_latitude, end_longitude, end_latitude, waypoints, route_data, distance, duration } = req.body;
    const [result] = await pool.query(
      'INSERT INTO route_plans (user_id, start_longitude, start_latitude, end_longitude, end_latitude, waypoints, route_data, distance, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, start_longitude, start_latitude, end_longitude, end_latitude, waypoints, route_data, distance, duration]
    );
    res.json({ message: '路线规划添加成功', plan_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: '添加路线规划失败', details: err.message });
  }
};

// 删除路线规划
exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM route_plans WHERE plan_id = ?', [id]);
    res.json({ message: '删除成功', affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: '删除失败', details: err.message });
  }
};