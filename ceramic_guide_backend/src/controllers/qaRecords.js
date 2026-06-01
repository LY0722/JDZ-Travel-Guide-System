// AI问答记录相关逻辑
const { pool } = require('../config/db');

// 获取所有问答记录
exports.getAllRecords = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM qa_records ORDER BY record_id DESC');
    res.json({ total: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ error: '获取问答记录失败', details: err.message });
  }
};

// 根据ID获取单条问答记录
exports.getRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM qa_records WHERE record_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: '问答记录不存在' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: '获取问答记录失败', details: err.message });
  }
};

// 新增问答记录
exports.createRecord = async (req, res) => {
  try {
    const { user_id, question, answer, ask_time, answer_time, is_satisfied, feedback } = req.body;
    const [result] = await pool.query(
      'INSERT INTO qa_records (user_id, question, answer, ask_time, answer_time, is_satisfied, feedback) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, question, answer, ask_time, answer_time, is_satisfied, feedback]
    );
    res.json({ message: '问答记录添加成功', record_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: '添加问答记录失败', details: err.message });
  }
};

// 删除问答记录
exports.deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM qa_records WHERE record_id = ?', [id]);
    res.json({ message: '删除成功', affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: '删除失败', details: err.message });
  }
};