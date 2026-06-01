const { pool } = require('../src/config/db');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  const sql = fs.readFileSync(
    path.join(__dirname, 'jdztravel.sql'), 
    'utf8'
  );

  const connection = await pool.getConnection();
  try {
    // 执行SQL文件中的所有语句
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    const statements = sql.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      await connection.query(statement);
    }
    
    console.log('✅ 数据库结构同步完成');
  } catch (err) {
    console.error('❌ 同步失败:', err.message);
  } finally {
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    connection.release();
  }
}

// 执行同步
runMigrations().catch(console.error);