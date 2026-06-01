<template>
  <view class="my-list-container">
    <view class="title">我的评论</view>
    <view v-if="comments.length === 0" class="empty">暂无评论</view>
    <view class="comment-list">
      <view class="comment-item" v-for="item in comments" :key="item.comment_id" @click="goDetail(item)">
        <text class="comment-content">{{item.content}}</text>
        <text class="comment-time">{{formatTime(item.created_at)}}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { commentsApi } from '@/api.js'
export default {
  data() {
    return {
      comments: [],
      userId: uni.getStorageSync('user_id') || null
    }
  },
  onShow() {
    this.loadComments()
  },
  methods: {
    async loadComments() {
      if (!this.userId) return
      const res = await commentsApi.getByUser(this.userId)
      this.comments = res.data || res
    },
    goDetail(item) {
      uni.navigateTo({ url: `/pages/community/detail?id=${item.post_id}` })
    },
    formatTime(timeStr) {
      if (!timeStr) return ''
      const time = new Date(timeStr)
      return `${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()}`
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
.comment-list { }
.comment-item {
  background: #fff;
  border-radius: 18rpx;
  margin-bottom: 22rpx;
  padding: 28rpx 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;
}
.comment-item:active {
  box-shadow: 0 8rpx 24rpx rgba(0,180,216,0.10);
}
.comment-content {
  font-size: 30rpx;
  color: #222;
  font-weight: 600;
  margin-bottom: 10rpx;
  display: block;
}
.comment-time {
  font-size: 24rpx;
  color: #aaa;
  margin-top: 2rpx;
  display: block;
}
</style>