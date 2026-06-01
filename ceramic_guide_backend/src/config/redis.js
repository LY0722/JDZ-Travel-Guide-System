// src/config/redis.js
const redis = require('redis');

// 创建Redis客户端
const client = redis.createClient({
  host: '127.0.0.1', // Redis服务器地址
  port: 6379,        // Redis端口
  retry_strategy: () => 1000 // 重连策略
});

// 错误监听
client.on('error', (err) => {
  console.error('Redis连接异常:', err.message);
});

module.exports = client;