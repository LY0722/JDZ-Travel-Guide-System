const { pool } = require('../config/db');

// 根据related_id和related_type获取图片
exports.getImagesByRelated = async (req, res) => {
  try {
    const { related_id, related_type } = req.query;
    if (!related_id || !related_type) {
      return res.status(400).json({ error: '参数缺失' });
    }
    const [rows] = await pool.query(
      'SELECT * FROM spot_shop_images WHERE related_id = ? AND related_type = ? ORDER BY image_index ASC',
      [related_id, related_type]
    );
    if (rows.length === 0) return res.status(404).json({ error: '未找到图片' });
    res.json({ total: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ error: '获取图片失败', details: err.message });
  }
};