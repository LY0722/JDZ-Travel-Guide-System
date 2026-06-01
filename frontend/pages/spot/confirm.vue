<template>
  <view class="confirm-container">
    <!-- 订单信息 -->
    <view class="order-info">
      <view class="info-item">
        <text class="info-label">景点名称</text>
        <text class="info-value">{{orderData.spotName}}</text>
      </view>
      <view class="info-item">
        <text class="info-label">门票类型</text>
        <text class="info-value">{{orderData.ticketName}}</text>
      </view>
      <view class="info-item">
        <text class="info-label">游玩日期</text>
        <text class="info-value">{{orderData.date}}</text>
      </view>
      <view class="info-item">
        <text class="info-label">购买数量</text>
        <text class="info-value">{{orderData.quantity}}张</text>
      </view>
      <view class="info-item">
        <text class="info-label">单价</text>
        <text class="info-value">¥{{orderData.price}}</text>
      </view>
    </view>

    <!-- 游客信息 -->
    <view class="section">
      <view class="section-title">游客信息</view>
      <view class="form-item">
        <text class="form-label">姓名</text>
        <input class="form-input" v-model="visitor.name" placeholder="请输入姓名" />
      </view>
      <view class="form-item">
        <text class="form-label">手机号</text>
        <input class="form-input" v-model="visitor.phone" placeholder="请输入手机号" type="number" />
      </view>
      <view class="form-item" v-if="orderData.ticketName === '学生票'">
        <text class="form-label">学生证号</text>
        <input class="form-input" v-model="visitor.studentId" placeholder="请输入学生证号" />
      </view>
      <view class="form-item" v-if="orderData.ticketName === '儿童/老人票'">
        <text class="form-label">身份证号</text>
        <input class="form-input" v-model="visitor.idCard" placeholder="请输入身份证号" />
      </view>
    </view>

    <!-- 支付方式 -->
    <view class="section">
      <view class="section-title">支付方式</view>
      <view class="payment-method">
        <view class="method-item" @click="selectPayment('wechat')" :class="{selected: paymentMethod === 'wechat'}">
          <image src="/static/wechat-pay.png" class="method-icon"></image>
          <text class="method-name">微信支付</text>
          <text class="iconfont icon-check"></text>
        </view>
        <view class="method-item" @click="selectPayment('alipay')" :class="{selected: paymentMethod === 'alipay'}">
          <image src="/static/alipay.png" class="method-icon"></image>
          <text class="method-name">支付宝支付</text>
          <text class="iconfont icon-check"></text>
        </view>
      </view>
    </view>

    <!-- 订单金额 -->
    <view class="price-section">
      <view class="price-item">
        <text class="price-label">门票总价</text>
        <text class="price-value">¥{{orderData.totalPrice}}</text>
      </view>
      <view class="price-item">
        <text class="price-label">优惠</text>
        <text class="price-value">-¥0</text>
      </view>
      <view class="price-item total">
        <text class="price-label">实付金额</text>
        <text class="price-value">¥{{orderData.totalPrice}}</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view class="price-info">
        <text class="total-label">合计:</text>
        <text class="total-price">¥{{orderData.totalPrice}}</text>
      </view>
      <view class="confirm-btn" @click="submitOrder">
        <text class="btn-text">提交订单</text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        orderData: {},
        visitor: {
          name: '',
          phone: '',
          studentId: '',
          idCard: ''
        },
        paymentMethod: 'wechat'
      }
    },
    onLoad(options) {
      if (options.data) {
        this.orderData = JSON.parse(decodeURIComponent(options.data));
      }
    },
    methods: {
      selectPayment(method) {
        this.paymentMethod = method;
      },
      submitOrder() {
        if (!this.visitor.name) {
          uni.showToast({
            title: '请输入姓名',
            icon: 'none'
          });
          return;
        }
        
        if (!this.visitor.phone || !/^1[3-9]\d{9}$/.test(this.visitor.phone)) {
          uni.showToast({
            title: '请输入正确的手机号',
            icon: 'none'
          });
          return;
        }
        
        if (this.orderData.ticketName === '学生票' && !this.visitor.studentId) {
          uni.showToast({
            title: '请输入学生证号',
            icon: 'none'
          });
          return;
        }
        
        if (this.orderData.ticketName === '儿童/老人票' && !this.visitor.idCard) {
          uni.showToast({
            title: '请输入身份证号',
            icon: 'none'
          });
          return;
        }
        
        // 模拟提交订单
        uni.showLoading({
          title: '提交中...'
        });
        
        setTimeout(() => {
          uni.hideLoading();
          uni.redirectTo({
            url: `/pages/spot/success?orderId=${Math.random().toString(36).substr(2, 10)}`
          });
        }, 1500);
      }
    }
  }
</script>

<style>
  .confirm-container {
    padding-bottom: 120rpx;
    background-color: #f5f5f5;
    min-height: 100vh;
  }
  
  .order-info {
    background-color: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
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
    font-weight: bold;
  }
  
  .section {
    background-color: #fff;
    margin-bottom: 20rpx;
    padding: 30rpx;
  }
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 25rpx;
  }
  
  .form-item {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
  }
  
  .form-label {
    width: 150rpx;
    font-size: 28rpx;
    color: #666;
  }
  
  .form-input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
    border-bottom: 1rpx solid #eee;
    padding: 15rpx 0;
  }
  
  .payment-method {
    border-radius: 12rpx;
    overflow: hidden;
  }
  
  .method-item {
    display: flex;
    align-items: center;
    padding: 25rpx;
    border: 1rpx solid #eee;
    margin-bottom: 20rpx;
    border-radius: 12rpx;
    position: relative;
  }
  
  .method-item.selected {
    border-color: #00B4D8;
    background-color: #f0f9ff;
  }
  
  .method-icon {
    width: 50rpx;
    height: 50rpx;
    margin-right: 20rpx;
  }
  
  .method-name {
    font-size: 28rpx;
    color: #333;
    flex: 1;
  }
  
  .icon-check {
    color: #00B4D8;
    font-size: 32rpx;
  }
  
  .price-section {
    background-color: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
  }
  
  .price-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15rpx;
  }
  
  .price-item.total {
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 1rpx dashed #eee;
  }
  
  .price-label {
    font-size: 28rpx;
    color: #666;
  }
  
  .price-value {
    font-size: 28rpx;
    color: #333;
  }
  
  .price-item.total .price-value {
    font-size: 32rpx;
    color: #ff6b6b;
    font-weight: bold;
  }
  
  .action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    background-color: #fff;
    display: flex;
    align-items: center;
    border-top: 1rpx solid #eee;
    padding: 0 20rpx;
  }
  
  .price-info {
    flex: 1;
    display: flex;
    align-items: center;
  }
  
  .total-label {
    font-size: 28rpx;
    color: #666;
    margin-right: 10rpx;
  }
  
  .total-price {
    font-size: 36rpx;
    color: #ff6b6b;
    font-weight: bold;
  }
  
  .confirm-btn {
    width: 250rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background-color: #ff6b6b;
    border-radius: 40rpx;
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .icon-check:before {
    content: "\e610";
  }
</style>