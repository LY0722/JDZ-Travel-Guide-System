// 用户信息相关逻辑
const { pool } = require('../config/db');

// 获取所有用户
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM user_info ORDER BY user_id DESC');
    res.json({ total: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ error: '获取用户失败', details: err.message });
  }
};

// 根据ID获取单个用户
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM user_info WHERE user_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: '用户不存在' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: '获取用户失败', details: err.message });
  }
};

// 新增用户
exports.createUser = async (req, res) => {
  try {
    const { username, password, nickname, avatar_url, phone, email } = req.body;
const [result] = await pool.query(
  'INSERT INTO user_info (username, password, nickname, avatar_url, phone, email) VALUES (?, ?, ?, ?, ?, ?)',
  [username, password, nickname, avatar_url, phone, email]
);
    res.json({ message: '用户添加成功', user_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: '添加用户失败', details: err.message });
  }
};

// 更新用户
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, nickname, avatar_url, phone, email } = req.body;
    const [result] = await pool.query(
      'UPDATE user_info SET username=?, password=?, nickname=?, avatar_url=?, phone=?, email=? WHERE user_id=?',
      [username, password, nickname, avatar_url, phone, email, id]
    );
    res.json({ message: '更新成功', affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: '更新失败', details: err.message });
  }
};
const path = require('path');

exports.uploadAvatar = async (req, res) => {
  try {
    console.log('收到头像上传请求，文件信息:', req.file);
    if (!req.file) return res.status(400).json({ error: '没有上传文件' });
    
    const filePath = path.join(__dirname, '../../uploads', req.file.filename);
    console.log('文件保存路径:', filePath);
    
    // 检查文件是否实际存在
    const fs = require('fs');
    console.log('文件存在:', fs.existsSync(filePath));
    
    const avatar_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    console.log('生成的avatar_url:', avatar_url);
    
    res.json({ avatar_url });
  } catch (err) {
    console.error('头像上传错误:', err);
    res.status(500).json({ error: '头像上传失败', details: err.message });
  }
};

// 删除用户
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM user_info WHERE user_id=?', [id]);
    res.json({ message: '删除成功', affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: '删除失败', details: err.message });
  }
};