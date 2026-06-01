// 景点信息相关逻辑
const { pool } = require('../config/db');

// 获取所有景点
exports.getAllSpots = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM scenic_spot ORDER BY spot_id DESC');
    res.json({ total: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ error: '获取景点失败', details: err.message });
  }
};

// 根据ID获取单个景点
exports.getSpotById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM scenic_spot WHERE spot_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: '景点不存在' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: '获取景点失败', details: err.message });
  }
};

// 新增景点
exports.createSpot = async (req, res) => {
  try {
    const { spot_name, spot_address, longitude, latitude, ticket_price } = req.body;
    const [result] = await pool.query(
      'INSERT INTO scenic_spot (spot_name, spot_address, longitude, latitude, ticket_price) VALUES (?, ?, ?, ?, ?)',
      [spot_name, spot_address, longitude, latitude, ticket_price]
    );
    res.json({ message: '新增成功', spot_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: '新增失败', details: err.message });
  }
};

// 更新景点
exports.updateSpot = async (req, res) => {
  try {
    const { id } = req.params;
    const { spot_name, spot_address, longitude, latitude, ticket_price } = req.body;
    const [result] = await pool.query(
      'UPDATE scenic_spot SET spot_name=?, spot_address=?, longitude=?, latitude=?, ticket_price=? WHERE spot_id=?',
      [spot_name, spot_address, longitude, latitude, ticket_price, id]
    );
    res.json({ message: '更新成功', affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: '更新失败', details: err.message });
  }
};

// 删除景点
exports.deleteSpot = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM scenic_spot WHERE spot_id=?', [id]);
    res.json({ message: '删除成功', affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: '删除失败', details: err.message });
  }
};