// 体验店信息相关逻辑
const { pool } = require('../config/db');

// 获取所有体验店
exports.getAllShops = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM experience_shop ORDER BY shop_id DESC');
    res.json({ total: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ error: '获取体验店失败', details: err.message });
  }
};

// 根据ID获取单个体验店
exports.getShopById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM experience_shop WHERE shop_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: '体验店不存在' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: '获取体验店失败', details: err.message });
  }
};

// 新增体验店
exports.createShop = async (req, res) => {
  try {
    const {
      shop_name,
      shop_description,
      shop_address,
      business_hours,
      experience_type,
      price_range,
      longitude,
      latitude,
      image_id
    } = req.body;
    const [result] = await pool.query(
      'INSERT INTO experience_shop (shop_name, shop_description, shop_address, business_hours, experience_type, price_range, longitude, latitude, image_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [shop_name, shop_description, shop_address, business_hours, experience_type, price_range, longitude, latitude, image_id]
    );
    res.json({ message: '新增成功', shop_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: '新增失败', details: err.message });
  }
};

// 更新体验店
exports.updateShop = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      shop_name,
      shop_description,
      shop_address,
      business_hours,
      experience_type,
      price_range,
      longitude,
      latitude,
      image_id
    } = req.body;
    const [result] = await pool.query(
      'UPDATE experience_shop SET shop_name=?, shop_description=?, shop_address=?, business_hours=?, experience_type=?, price_range=?, longitude=?, latitude=?, image_id=? WHERE shop_id=?',
      [shop_name, shop_description, shop_address, business_hours, experience_type, price_range, longitude, latitude, image_id, id]
    );
    res.json({ message: '更新成功', affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: '更新失败', details: err.message });
  }
};

// 删除体验店
exports.deleteShop = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM experience_shop WHERE shop_id=?', [id]);
    res.json({ message: '删除成功', affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: '删除失败', details: err.message });
  }
};