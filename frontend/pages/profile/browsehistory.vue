<template>
  <view class="browse-history-container">
    <view class="title">浏览历史</view>
    <view v-if="history.length === 0" class="empty">暂无浏览记录</view>
    <view class="history-list">
      <view class="history-item" v-for="item in history" :key="item.history_id" @click="goDetail(item.related_id)">
        <image :src="item.cover" class="history-img"></image>
        <view class="history-info">
          <text class="history-title">{{item.title}}</text>
          <text class="history-time">{{formatTime(item.browse_time)}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { browseHistoryApi, postsApi, IMAGE_BASE_URL } from '@/api.js'
export default {
  data() {
    return {
      userId: uni.getStorageSync('user_id') || null,
      history: []
    }
  },
  onShow() {
    this.loadHistory()
  },
  methods: {
    async loadHistory() {
      if (!this.userId) return
      try {
        const res = await browseHistoryApi.getByUser(this.userId)
        // 获取帖子标题和主图，主图补全为绝对路径
        this.history = await Promise.all((res.data || []).filter(h => h.related_type === 'post').map(async h => {
          let post = {}
          try {
            const postRes = await postsApi.getById(h.related_id)
            post = postRes.data || postRes
          } catch {}
          // 主图补全为绝对路径
          let cover = post.main_image_url || ''
          if (cover && !cover.startsWith('http')) {
            cover = IMAGE_BASE_URL + cover
          }
          // 没有主图时用默认头像
          if (!cover) {
            cover = IMAGE_BASE_URL + '/static/default-avatar.png'
          }
          return {
            ...h,
            title: post.title || '帖子已删除',
            cover
          }
        }))
      } catch (e) {
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
    },
    formatTime(timeStr) {
      if (!timeStr) return ''
      const time = new Date(timeStr)
      const now = new Date()
      const diff = (now - time) / 1000
      if (diff < 60) return '刚刚'
      if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
      if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
      if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`
      return time.toLocaleDateString()
    },
    goDetail(postId) {
      uni.navigateTo({ url: `/pages/community/detail?id=${postId}` })
    }
  }
}
</script>

<style>
.browse-history-container {
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
.history-list { }
.history-item {
  display: flex;
  align-items: center;
  margin-bottom: 22rpx;
  background: #fff;
  border-radius: 18rpx;
  padding: 18rpx 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;
}
.history-item:active {
  box-shadow: 0 8rpx 24rpx rgba(0,180,216,0.10);
}
.history-img {
  width: 110rpx;
  height: 110rpx;
  border-radius: 10rpx;
  margin-right: 20rpx;
  object-fit: cover;
  background: #f0f0f0;
}
.history-info { flex: 1; }
.history-title {
  font-size: 30rpx;
  color: #222;
  font-weight: 600;
  margin-bottom: 8rpx;
  display: block;
}
.history-time {
  font-size: 24rpx;
  color: #aaa;
  margin-top: 2rpx;
  display: block;
}
</style>