<template>
  <view class="detail-container" v-if="post">
    <!-- 帖子内容 -->
    <view class="post-content">
      <view class="user-info">
        <image :src="post.user.avatar_url || '/static/default-avatar.png'" class="avatar"></image>
        <view class="user-detail">
          <text class="username">{{post.user.username || '瓷都游客'}}</text>
          <text class="post-time">{{formatTime(post.created_at)}}</text>
        </view>
      </view>
      <view class="post-body">
        <text class="post-title">{{post.title}}</text>
        <text class="post-text" user-select="text">{{post.content}}</text>
        <view class="post-images" v-if="post.images && post.images.length > 0">
        <image v-for="(img, idx) in post.images" :key="idx" :src="fullImageUrl(img.image_url)" mode="aspectFill"
          class="post-image" @click="previewImage(post.images, idx)"></image>
        </view>
      </view>
<view class="interaction">
  <view class="interaction-item">
    <uni-icons type="eye" size="16" color="#666"></uni-icons>
    <text>{{post.view_count || 0}}浏览</text>
  </view>
  <view class="interaction-item" @click="toggleLike">
    <uni-icons type="heart" size="16" :color="post.is_liked ? '#ff6b6b' : '#666'"></uni-icons>
    <text>{{post.like_count || 0}}赞</text>
  </view>
</view>
    </view>
    <Comment :postId="postId" />
        <view class="comment-count-bar">
      <view class="comment-count-line"></view>
      <text class="comment-count-text">共有 {{post.comment_count || 0}} 条评论</text>
      <view class="comment-count-line"></view>
    </view>
  </view> 
</template>

<script>
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
import Comment from './comment.vue'
import { postsApi, userApi, commentsApi, likesApi, browseHistoryApi, IMAGE_BASE_URL } from '@/api.js'
export default {
  components: { Comment , uniIcons},
  data() {
    return {
      postId: '',
      post: null,
      userId: uni.getStorageSync('user_id') || null
    }
  },
  onLoad(options) {
    this.postId = options.id
    if (!this.postId) {
      uni.showToast({ title: '参数错误', icon: 'none' })
      return
    }
    this.loadPostDetail()
    // 自动记录浏览历史
    if (this.userId) {
      browseHistoryApi.create({
        user_id: this.userId,
        related_id: this.postId,
        related_type: 'post'
      }).catch(() => {})
    }
  },
methods: {
  fullImageUrl(url) {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return IMAGE_BASE_URL + url
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
  previewImage(images, current) {
    const urls = images.map(img => this.fullImageUrl(img.image_url))
    uni.previewImage({
      current: urls[current],
      urls
    })
  },
  async toggleLike() {
    if (!this.userId) {
      uni.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    if (!this.post) return;
    try {
      if (this.post.is_liked) {
        // 取消点赞
        await likesApi.deleteLike(this.postId, this.userId);
        this.post.is_liked = false;
        this.post.like_count = Math.max(0, (this.post.like_count || 1) - 1);
      } else {
        // 点赞
        await likesApi.addLike(this.postId, this.userId);
        this.post.is_liked = true;
        this.post.like_count = (this.post.like_count || 0) + 1;
      }
    } catch (e) {
      uni.showToast({ title: '操作失败', icon: 'none' });
    }
  },
async loadPostDetail() {
  try {
    const res = await postsApi.getById(this.postId)
    const post = res.data || res
    let user = {}
    try {
      user = await userApi.getById(post.user_id)
    } catch {}
    let images = []
    try {
      const imgRes = await postsApi.getImages(post.post_id)
      images = imgRes.data || []
    } catch {}
    let likeInfo = { like_count: 0, is_liked: false }
    try {
      likeInfo = await likesApi.getByPost(this.postId, this.userId)
    } catch {}
    // 统计评论数
    let comment_count = 0
    try {
      const commentRes = await commentsApi.getByPost(post.post_id)
      comment_count = Array.isArray(commentRes) ? commentRes.filter(c => !c.parent_id).length : 0
    } catch {}
    this.post = { ...post, user, images, ...likeInfo, comment_count }
  } catch (error) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  }
}
}
}
</script>

<style>
  /* 详情容器 */
  .detail-container {
    padding-bottom: 120rpx;
  }

  /* 帖子内容 */
  .post-content {
    background-color: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
  }

  /* 用户信息 */
  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
  }

  .avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin-right: 20rpx;
  }

  .user-detail {
    display: flex;
    flex-direction: column;
  }

  .username {
    font-size: 28rpx;
    color: #333;
    font-weight: bold;
  }

  .post-time {
    font-size: 24rpx;
    color: #999;
    margin-top: 5rpx;
  }

  /* 帖子正文 */
  .post-body {
    margin-bottom: 30rpx;
  }

  .post-title {
    font-size: 36rpx;
    color: #333;
    font-weight: bold;
    margin-bottom: 20rpx;
    display: block;
  }

  .post-text {
    font-size: 30rpx;
    color: #666;
    line-height: 1.6;
    margin-bottom: 30rpx;
    display: block;
  }

  /* 帖子图片 */
  .post-images {
    display: flex;
    flex-wrap: wrap;
    margin: -5rpx;
  }

  .post-image {
    width: calc(50% - 10rpx);
    height: 300rpx;
    margin: 5rpx;
    border-radius: 8rpx;
  }

  /* 互动统计 */
  .interaction {
    display: flex;
    padding-top: 20rpx;
    border-top: 1rpx solid #eee;
  }

  .interaction-item {
    margin-right: 40rpx;
    display: flex;
    align-items: center;
    color: #666;
    font-size: 26rpx;
  }

  .interaction-item .iconfont {
    margin-right: 8rpx;
    font-size: 36rpx;
  }

  .interaction-item .icon-like-fill {
    color: #ff6b6b;
  }

  /* 评论列表 */
  .comment-list {
    background-color: #fff;
    padding: 30rpx;
  }

  .comment-header {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #eee;
  }

  .comment-header .title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-right: 15rpx;
  }

  .comment-header .count {
    font-size: 26rpx;
    color: #999;
  }

  /* 评论项 */
  .comment-item {
    display: flex;
    margin-bottom: 30rpx;
    padding: 20rpx;
    background-color: #f9f9f9;
    border-radius: 10rpx;
  }
  /* 新发布的评论高亮显示 */
  .comment-item:first-child {
    background-color: #f0f8ff;
    border: 1rpx solid #d0e3ff;
  }
  .comment-text {
    font-size: 28rpx;
    color: #333;
    line-height: 1.5;
    margin-bottom: 15rpx;
    display: block;
    word-break: break-all;
  }

  .comment-item .avatar {
    width: 70rpx;
    height: 70rpx;
    margin-right: 20rpx;
  }

  .comment-content {
    flex: 1;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10rpx;
    padding: 0;
    border: none;
  }

  .comment-header .username {
    font-size: 26rpx;
    color: #333;
    font-weight: bold;
  }

  .comment-header .time {
    font-size: 24rpx;
    color: #999;
  }

  .reply-btn {
    display: flex;
    align-items: center;
    color: #999;
    font-size: 24rpx;
  }

  .reply-btn .iconfont {
    margin-right: 8rpx;
  }

  /* 子评论 */
  .sub-comments {
    margin-top: 20rpx;
    padding-left: 50rpx;
  }

  .sub-comment-item {
    display: flex;
    margin-bottom: 20rpx;
  }

  .sub-comment-item .avatar {
    width: 60rpx;
    height: 60rpx;
    margin-right: 20rpx;
  }

  .sub-comment-content {
    flex: 1;
  }

  .sub-comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10rpx;
  }

  .sub-comment-header .username {
    font-size: 24rpx;
    color: #333;
    font-weight: bold;
  }

  .sub-comment-header .time {
    font-size: 22rpx;
    color: #999;
  }

  .sub-comment-text {
    font-size: 26rpx;
    color: #333;
    line-height: 1.5;
    display: block;
  }

  /* 评论输入框 */
  .comment-input-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #fff;
    padding: 15rpx;
    display: flex;
    align-items: center;
    border-top: 1rpx solid #eee;
  }

  .comment-input {
    flex: 1;
    height: 80rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    color: #333;
    border: 1rpx solid #ddd;
    border-radius: 40rpx;
  }

  .icon-send {
    margin-left: 15rpx;
    font-size: 36rpx;
    color: #00B4D8;
  }

  /* 回复输入框 (弹出层) */
  .reply-input-container {
    padding: 30rpx;
  }

  .reply-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
  }

  .reply-header .icon-close {
    font-size: 36rpx;
    color: #999;
  }

  .reply-input {
    width: 100%;
    height: 200rpx;
    padding: 20rpx;
    font-size: 28rpx;
    color: #333;
    border: 1rpx solid #ddd;
    border-radius: 10rpx;
    margin-bottom: 20rpx;
  }

  .reply-submit {
    width: 100%;
    height: 80rpx;
    background-color: #00B4D8;
    color: #fff;
    font-size: 32rpx;
    border-radius: 40rpx;
    text-align: center;
    line-height: 80rpx;
  }
  .send-btn {
  margin-left: 15rpx;
  font-size: 28rpx;
  color: #fff;
  background: #00B4D8;
  border: none;
  border-radius: 40rpx;
  padding: 0 32rpx;
  height: 60rpx;
  line-height: 60rpx;
}
.comment-count-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40rpx 0 20rpx 0;
}
.comment-count-line {
  flex: 1;
  height: 1rpx;
  background: #e0e0e0;
  margin: 0 20rpx;
}
.comment-count-text {
  font-size: 26rpx;
  color: #888;
  font-weight: bold;
  letter-spacing: 2rpx;
}
</style>