<template>
  <view class="feedback-container">
    <view class="title">意见反馈</view>
    <view class="desc">您的建议和意见对我们非常重要，欢迎反馈遇到的问题或希望新增的功能。</view>
    <textarea v-model="content" placeholder="请输入您的宝贵意见..." class="feedback-textarea" maxlength="300"/>
    <view class="feedback-tools">
      <text class="word-count">{{content.length}}/300</text>
      <button type="primary" class="submit-btn" @click="submitFeedback">提交</button>
    </view>
    <view class="tips">
      <text>反馈示例：</text>
      <text>1. 某某功能无法使用</text>
      <text>2. 希望增加xxx功能</text>
      <text>3. 页面显示异常</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      content: ''
    }
  },
  methods: {
    submitFeedback() {
      if (!this.content.trim()) {
        uni.showToast({ title: '请输入内容', icon: 'none' })
        return
      }
      uni.showToast({ title: '感谢您的反馈！' })
      this.content = ''
    }
  }
}
</script>

<style scoped>
.feedback-container {
  padding: 32rpx;
  min-height: 100vh;
  background: #f7f8fa;
}
.title {
  font-size: 38rpx;
  font-weight: bold;
  color: #222;
  margin-bottom: 18rpx;
  letter-spacing: 2rpx;
}
.desc {
  color: #888;
  font-size: 28rpx;
  margin-bottom: 18rpx;
}
.feedback-textarea {
  width: 100%;
  min-height: 180rpx;
  margin-bottom: 12rpx;
  border: 1rpx solid #eee;
  border-radius: 12rpx;
  padding: 16rpx;
  font-size: 30rpx;
  background: #fff;
}
.feedback-tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18rpx;
}
.word-count {
  color: #aaa;
  font-size: 24rpx;
}
.submit-btn {
  background: linear-gradient(90deg, #00b4d8, #48cae4);
  color: #fff;
  border: none;
  border-radius: 24rpx;
  font-size: 28rpx;
  padding: 0 36rpx;
  height: 56rpx;
  line-height: 56rpx;
}
.tips {
  background: #f0f4f8;
  border-radius: 12rpx;
  padding: 18rpx;
  color: #666;
  font-size: 26rpx;
  margin-top: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}
</style>