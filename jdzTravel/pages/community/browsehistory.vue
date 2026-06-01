<template>
  <view class="browse-history-container">
    <view class="title">浏览历史</view>
    <view v-if="history.length === 0" class="empty">暂无浏览记录</view>
    <view class="history-list">
      <view class="history-item" v-for="item in history" :key="item.history_id" @click="goDetail(item.related_id)">
        <image :src="item.cover || '/static/default-avatar.png'" class="history-img"></image>
        <view class="history-info">
          <text class="history-title">{{item.title}}</text>
          <text class="history-time">{{formatTime(item.browse_time)}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { browseHistoryApi, postsApi } from '@/api.js'
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
        // 获取帖子标题和封面
        this.history = await Promise.all((res.data || []).filter(h => h.related_type === 'post').map(async h => {
          let post = {}
          try {
            const postRes = await postsApi.getById(h.related_id)
            post = postRes.data || postRes
          } catch {}
          return {
            ...h,
            title: post.title || '帖子已删除',
            cover: (post.images && post.images[0]?.image_url) || ''
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
.browse-history-container { padding: 30rpx; }
.title { font-size: 32rpx; font-weight: bold; margin-bottom: 20rpx; }
.empty { color: #999; text-align: center; margin: 40rpx 0; }
.history-list { }
.history-item { display: flex; align-items: center; margin-bottom: 20rpx; background: #fff; border-radius: 12rpx; padding: 20rpx; }
.history-img { width: 120rpx; height: 120rpx; border-radius: 8rpx; margin-right: 20rpx; }
.history-info { flex: 1; }
.history-title { font-size: 28rpx; color: #333; font-weight: bold; }
.history-time { font-size: 24rpx; color: #999; margin-top: 8rpx; display: block; }
</style>