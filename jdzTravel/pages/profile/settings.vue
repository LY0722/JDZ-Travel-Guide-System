<template>
  <view class="settings-container">
    <view class="title">系统设置</view>
    <view class="setting-list">
      <view class="setting-item">
        <text class="setting-label">消息通知</text>
        <switch :checked="true" disabled color="#00b4d8"/>
      </view>
      <view class="setting-item">
        <text class="setting-label">深色模式</text>
        <switch :checked="false" disabled color="#222"/>
      </view>
      <view class="setting-item">
        <text class="setting-label">清除缓存</text>
        <button class="mini-btn" size="mini" @click="clearCache">清除</button>
      </view>
      <view class="setting-item">
        <text class="setting-label">检查更新</text>
        <button class="mini-btn" size="mini" @click="checkUpdate">检查</button>
      </view>
      <view class="setting-item about-item">
        <text class="setting-label">关于我们</text>
        <view class="about-content">
          <image src="/static/logo.png" class="about-logo"></image>
          <view>
            <text class="about-title">景德镇文旅小程序</text>
            <text class="about-version">v1.0.0</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    clearCache() {
      uni.clearStorageSync()
      uni.showToast({ title: '缓存已清除' })
    },
    checkUpdate() {
      uni.showToast({ title: '已是最新版本' })
    }
  }
}
</script>

<style scoped>
.settings-container {
  padding: 32rpx;
  min-height: 100vh;
  background: #f7f8fa;
}
.title {
  font-size: 38rpx;
  font-weight: bold;
  color: #222;
  margin-bottom: 32rpx;
  letter-spacing: 2rpx;
}
.setting-list {
  background: #fff;
  border-radius: 18rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
  padding: 16rpx 0;
}
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
}
.setting-item:last-child {
  border-bottom: none;
}
.setting-label {
  font-size: 30rpx;
  color: #222;
}
.mini-btn {
  font-size: 26rpx;
  padding: 0 24rpx;
  height: 48rpx;
  line-height: 48rpx;
  border-radius: 24rpx;
  background: #00b4d8;
  color: #fff;
  border: none;
}
.about-item {
  flex-direction: column;
  align-items: flex-start;
}
.about-content {
  display: flex;
  align-items: center;
  margin-top: 12rpx;
}
.about-logo {
  width: 60rpx;
  height: 60rpx;
  border-radius: 12rpx;
  margin-right: 18rpx;
  background: #f0f0f0;
}
.about-title {
  font-size: 28rpx;
  color: #222;
  font-weight: 600;
  display: block;
}
.about-version {
  font-size: 24rpx;
  color: #888;
  margin-top: 2rpx;
  display: block;
}
</style>