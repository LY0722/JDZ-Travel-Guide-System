<template>
  <view class="agreement-container">
    <view class="agreement-header">
      <text class="title">用户协议</text>
    </view>
    
    <scroll-view class="agreement-content" scroll-y>
      <text class="content-text">
        1. 本协议是您与陶瓷收藏社区之间关于使用本社区服务的法律协议。
        
        2. 您在使用本社区服务时，应当遵守相关法律法规，不得利用本社区服务从事任何违法违规行为。
        
        3. 您应妥善保管您的账号和密码，因您保管不善导致的任何损失，本社区不承担任何责任。
        
        4. 本社区有权根据实际情况对服务内容进行调整，并在必要时修改本协议。
        
        5. 您在使用本社区服务过程中产生的任何内容，应当保证其合法性，并承担相应责任。
        
        6. 本社区尊重并保护所有用户的个人隐私权，不会非法收集、使用或泄露您的个人信息。
        
        7. 本协议的解释权归陶瓷收藏社区所有。
      </text>
    </scroll-view>
    
    <view class="agreement-footer">
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
.agreement-container {
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.agreement-header {
  padding: 30rpx;
  border-bottom: 1rpx solid #f1f1f1;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
}

.agreement-content {
  flex: 1;
  padding: 40rpx;
  width:90%;
}

.content-text {
  font-size: 28rpx;
  line-height: 2;
  color: #333;
  white-space: pre-line;
}

.agreement-footer {
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