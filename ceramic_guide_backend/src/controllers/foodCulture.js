// 美食文化相关逻辑
const { pool } = require('../config/db');

// 获取所有美食
exports.getAllFoods = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM food_culture ORDER BY food_id DESC');
    res.json({ total: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ error: '获取美食失败', details: err.message });
  }
};

// 根据ID获取单个美食
exports.getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM food_culture WHERE food_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: '美食不存在' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: '获取美食失败', details: err.message });
  }
};

// 新增美食
exports.createFood = async (req, res) => {
  try {
    const {
      food_name,
      food_description,
      food_address,
      business_hours,
      price_range,
      longitude,
      latitude,
      image_id
    } = req.body;
    const [result] = await pool.query(
      'INSERT INTO food_culture (food_name, food_description, food_address, business_hours, price_range, longitude, latitude, image_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [food_name, food_description, food_address, business_hours, price_range, longitude, latitude, image_id]
    );
    res.json({ message: '新增成功', food_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: '新增失败', details: err.message });
  }
};

// 更新美食
exports.updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      food_name,
      food_description,
      food_address,
      business_hours,
      price_range,
      longitude,
      latitude,
      image_id
    } = req.body;
    const [result] = await pool.query(
      'UPDATE food_culture SET food_name=?, food_description=?, food_address=?, business_hours=?, price_range=?, longitude=?, latitude=?, image_id=? WHERE food_id=?',
      [food_name, food_description, food_address, business_hours, price_range, longitude, latitude, image_id, id]
    );
    res.json({ message: '更新成功', affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: '更新失败', details: err.message });
  }
};

// 删除美食
exports.deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM food_culture WHERE food_id=?', [id]);
    res.json({ message: '删除成功', affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: '删除失败', details: err.message });
  }
};