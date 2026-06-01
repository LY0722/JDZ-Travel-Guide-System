// 使用 mysql2/promise 支持异步操作
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// 从环境变量读取配置（安全推荐做法）
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '032915',
  database: process.env.DB_NAME || 'jdztravel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // 如需SSL连接可添加：
  // ssl: {
  //   ca: fs.readFileSync(path.join(__dirname, 'mysql-ca.pem'))
  // }
};

// 创建连接池（推荐生产环境使用）
const pool = mysql.createPool(dbConfig);

// 测试连接的函数
async function testConnection() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.ping();
    console.log('✅ 数据库连接成功');
  } catch (err) {
    console.error('❌ 数据库连接失败:', err.message);
  } finally {
    if (connection) connection.release();
  }
}

// 自动执行连接测试
testConnection();

// 导出连接池和原始连接方法
module.exports = {
  pool,
  getConnection: () => pool.getConnection(),
  // 添加查询快捷方法
  query: (sql, params) => pool.execute(sql, params)
};