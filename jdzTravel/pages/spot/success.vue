<template>
  <view class="success-container">
    <view class="success-content">
      <image src="/static/success.png" class="success-icon"></image>
      <text class="success-title">支付成功</text>
      <text class="success-desc">订单号: {{orderId}}</text>
      
      <view class="order-info">
        <view class="info-item">
          <text class="info-label">景点名称</text>
          <text class="info-value">景德镇古窑民俗博览区</text>
        </view>
        <view class="info-item">
          <text class="info-label">门票类型</text>
          <text class="info-value">成人票</text>
        </view>
        <view class="info-item">
          <text class="info-label">游玩日期</text>
          <text class="info-value">2023-06-15</text>
        </view>
        <view class="info-item">
          <text class="info-label">购买数量</text>
          <text class="info-value">1张</text>
        </view>
        <view class="info-item">
          <text class="info-label">支付金额</text>
          <text class="info-value price">¥190</text>
        </view>
      </view>
      
      <view class="qrcode-section">
        <image src="/static/qrcode.png" class="qrcode-image"></image>
        <text class="qrcode-desc">入园二维码(截图保存使用)</text>
      </view>
    </view>
    
    <view class="action-btns">
      <view class="action-btn secondary" @click="viewOrder">
        <text class="btn-text">查看订单</text>
      </view>
      <view class="action-btn primary" @click="backToHome">
        <text class="btn-text">返回首页</text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        orderId: ''
      }
    },
    onLoad(options) {
      if (options.orderId) {
        this.orderId = options.orderId;
      }
    },
    methods: {
      viewOrder() {
        uni.navigateTo({
          url: '/pages/order/detail?id=' + this.orderId
        });
      },
      backToHome() {
        uni.switchTab({
          url: '/pages/home/home'
        });
      }
    }
  }
</script>

<style>
  .success-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f5f5f5;
  }
  
  .success-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60rpx 40rpx;
    background-color: #fff;
    margin-bottom: 20rpx;
  }
  
  .success-icon {
    width: 120rpx;
    height: 120rpx;
    margin-bottom: 30rpx;
  }
  
  .success-title {
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 15rpx;
  }
  
  .success-desc {
    font-size: 26rpx;
    color: #999;
    margin-bottom: 50rpx;
  }
  
  .order-info {
    width: 100%;
    background-color: #f9f9f9;
    border-radius: 12rpx;
    padding: 30rpx;
    margin-bottom: 40rpx;
  }
  
  .info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
  }
  
  .info-item:last-child {
    margin-bottom: 0;
  }
  
  .info-label {
    font-size: 28rpx;
    color: #666;
  }
  
  .info-value {
    font-size: 28rpx;
    color: #333;
  }
  
  .info-value.price {
    color: #ff6b6b;
    font-weight: bold;
  }
  
  .qrcode-section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .qrcode-image {
    width: 300rpx;
    height: 300rpx;
    margin-bottom: 20rpx;
  }
  
  .qrcode-desc {
    font-size: 26rpx;
    color: #999;
  }
  
  .action-btns {
    display: flex;
    padding: 30rpx;
    background-color: #fff;
  }
  
  .action-btn {
    flex: 1;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    border-radius: 40rpx;
    font-size: 30rpx;
    font-weight: bold;
  }
  
  .action-btn.secondary {
    background-color: #f5f5f5;
    color: #666;
    margin-right: 20rpx;
  }
  
  .action-btn.primary {
    background-color: #ff6b6b;
    color: #fff;
  }
</style>