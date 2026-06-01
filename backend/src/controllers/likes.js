const { pool } = require('../config/db');

// 获取点赞数和是否点赞
exports.getLikes = async (req, res) => {
  try {
    const { post_id, user_id } = req.query;
    if (!post_id) return res.status(400).json({ error: '缺少post_id' });

    // 点赞总数
    const [countRows] = await pool.query('SELECT COUNT(*) as count FROM likes WHERE post_id = ?', [post_id]);
    // 当前用户是否点赞
    let isLiked = false;
    if (user_id) {
      const [likeRows] = await pool.query('SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?', [post_id, user_id]);
      isLiked = likeRows.length > 0;
    }
    res.json({ like_count: countRows[0].count, is_liked: isLiked });
  } catch (err) {
    res.status(500).json({ error: '获取点赞信息失败', details: err.message });
  }
};
// 获取用户所有点赞的帖子
exports.getLikesByUser = async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: '缺少user_id' });

    // 查询用户点赞的所有帖子
    const [rows] = await pool.query(
      `SELECT p.post_id, p.title, p.created_at
       FROM likes l
       JOIN posts p ON l.post_id = p.post_id
       WHERE l.user_id = ?
       ORDER BY l.like_id DESC`, // 修正这里
      [user_id]
    );
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: '获取用户点赞帖子失败', details: err.message });
  }
};
// 点赞

exports.addLike = async (req, res) => {
  console.log('addLike called', req.body);
  try {
    const { post_id, user_id } = req.body;
    console.log('addLike:', post_id, user_id); // 调试用
    if (!post_id || !user_id) return res.status(400).json({ error: '缺少参数' });
    await pool.query('INSERT IGNORE INTO likes (post_id, user_id) VALUES (?, ?)', [post_id, user_id]);
    res.json({ message: '点赞成功' });
  } catch (err) {
    console.error('点赞失败:', err.message);
    res.status(500).json({ error: '点赞失败', details: err.message });
  }
  console.log('addLike:', typeof post_id, post_id, typeof user_id, user_id);
};
// 取消点赞
exports.removeLike = async (req, res) => {
  try {
    console.log('removeLike params:', req.query);
    const { post_id, user_id } = req.query;
    console.log('removeLike params:', req.query);
    console.log('removeLike params:', post_id, user_id);
    if (!post_id || !user_id) {
      return res.status(400).json({ error: '缺少参数' });
    }
    await pool.query('DELETE FROM likes WHERE post_id = ? AND user_id = ?', [post_id, user_id]);
    res.json({ message: '取消点赞成功' });
  } catch (err) {
    console.error('取消点赞失败:', err.message);
    res.status(500).json({ error: '取消点赞失败', details: err.message });
  }
};