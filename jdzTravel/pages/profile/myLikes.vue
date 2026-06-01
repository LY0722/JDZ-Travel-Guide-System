<template>
  <view class="my-list-container">
    <view class="title">我的收藏</view>
    <view v-if="likes.length === 0" class="empty">暂无收藏</view>
    <view class="post-list">
      <view
        class="post-item"
        v-for="item in likes"
        :key="item.post_id"
        @click="goDetail(item.post_id)"
      >
        <text class="post-title">{{ item.title }}</text>
        <text class="post-time">{{ formatTime(item.created_at) }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { likesApi } from '@/api.js'
export default {
  data() {
    return {
      userId: uni.getStorageSync('user_id') || null,
      likes: []
    }
  },
  onShow() {
    this.loadLikes()
  },
  methods: {
    async loadLikes() {
      if (!this.userId) return
      try {
        // 正确调用
        const res = await likesApi.getByUser(this.userId)
        this.likes = res.data || []
      } catch (e) {
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
    },
    goDetail(postId) {
      uni.navigateTo({ url: `/pages/community/detail?id=${postId}` })
    },
    formatTime(timeStr) {
      if (!timeStr) return ''
      const time = new Date(timeStr)
      return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
    }
  }
}
</script>

<style>
.my-list-container {
  padding: 32rpx 20rpx 20rpx 20rpx;
  min-height: 100vh;
  background: #f7f8fa;
}
.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #222;
  margin-bottom: 28rpx;
  letter-spacing: 2rpx;
}
.empty {
  color: #bbb;
  text-align: center;
  margin: 60rpx 0;
  font-size: 28rpx;
}
.post-list { }
.post-item {
  background: #fff;
  border-radius: 18rpx;
  margin-bottom: 22rpx;
  padding: 28rpx 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;
}
.post-item:active {
  box-shadow: 0 8rpx 24rpx rgba(0,180,216,0.10);
}
.post-title {
  font-size: 30rpx;
  color: #222;
  font-weight: 600;
  margin-bottom: 10rpx;
  display: block;
}
.post-time {
  font-size: 24rpx;
  color: #aaa;
  margin-top: 2rpx;
  display: block;
}
</style>