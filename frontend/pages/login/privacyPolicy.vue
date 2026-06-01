<template>
  <view class="policy-container">
    <view class="policy-header">
      <text class="title">隐私政策</text>
    </view>
    
    <scroll-view class="policy-content" scroll-y>
      <text class="content-text">
        1. 我们非常重视您的隐私保护，本政策说明了我们如何收集、使用和保护您的个人信息。
        
        2. 我们收集的信息包括：您注册时提供的手机号、密码，以及您使用服务时产生的数据。
        
        3. 我们收集的信息将用于：为您提供服务、改进服务质量、保障账号安全等合法用途。
        
        4. 我们不会将您的个人信息出售给第三方，除非获得您的明确同意或法律要求。
        
        5. 我们采取合理的安全措施保护您的个人信息，防止未经授权的访问、使用或泄露。
        
        6. 您有权访问、更正或删除您的个人信息，也可以通过注销账号的方式终止我们使用您的信息。
        
        7. 我们可能会更新本隐私政策，更新后的政策将在本页面公布。
      </text>
    </scroll-view>
    
    <view class="policy-footer">
      <button class="agree-btn" @click="handleAgree">我已阅读并同意</button>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    handleAgree() {
      uni.navigateBack();
    }
  }
}
</script>

<style scoped>
.policy-container {
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.policy-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #f1f1f1;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
}

.policy-content {
  flex: 1;
  padding: 40rpx;
  width:90%;
}

.content-text {
  font-size: 28rpx;
  line-height: 2;
  color: #333;
  white-space: pre-line;
  padding:20rpx;
}

.policy-footer {
  padding: 30rpx;
}

.agree-btn {
  background-color: #00B4D8;
  color: #fff;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  font-size: 30rpx;
}

button::after {
  border: none;
}
</style>