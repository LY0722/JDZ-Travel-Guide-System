<template>
  <view class="community-container">
    <!-- 发布按钮 -->
    <view class="post-button" @click="navigateToPost">
      <uni-icons type="plus" size="20" color="#fff"></uni-icons>
      <text>发布帖子</text>
    </view>
    <!-- 帖子列表 -->
    <view class="post-list">
      <view class="post-item" v-for="post in posts" :key="post.post_id" @click="navigateToPostDetail(post.post_id)">
        <!-- 用户信息 -->
        <view class="user-info">
          <image :src="post.user.avatar_url || '/static/default-avatar.png'" class="avatar"></image>
          <view class="user-detail">
            <text class="username">{{post.user.nickname || post.user.username || '瓷都游客'}}</text>
            <text class="post-time">{{formatTime(post.created_at)}}</text>
          </view>
        </view>
        <!-- 帖子内容 -->
        <view class="post-content">
          <text class="post-title">{{post.title}}</text>
          <text class="post-text">{{post.content}}</text>
          <!-- 帖子图片 -->
<view class="post-images" v-if="post.images && post.images.length > 0">
<image
  v-for="(img, idx) in post.images.slice(0, 3)"
  :key="idx"
  :src="fullImageUrl(img.image_url)"
  mode="aspectFill"
  class="post-image"
  @click.stop="previewImage(post.images, idx)"
  @error="e => onImgError(e, img)"
  @load="e => onImgLoad(e, img)"
></image>
</view>
        </view>
        <!-- 互动统计 -->
        <view class="interaction">
          <view class="interaction-item">
            <uni-icons type="eye" size="16" color="#666"></uni-icons>
            <text>{{post.view_count || 0}}</text>
          </view>
          <view class="interaction-item">
            <uni-icons type="heart" size="16" :color="post.isLiked ? '#ff6b6b' : '#666'"></uni-icons>
            <text>{{post.like_count || 0}}</text>
          </view>
          <view class="interaction-item">
            <uni-icons type="chat" size="16" color="#666"></uni-icons>
            <text>{{post.comment_count || 0}}</text>
          </view>
        </view>
      </view>
      <!-- 加载更多 -->
      <view class="load-more" v-if="hasMore && !loading" @click="loadMore">
        <text>加载更多</text>
      </view>
      <view class="no-more" v-else-if="!hasMore && posts.length > 0">
        <text>没有更多内容了</text>
      </view>
      <view class="no-more" v-else-if="!loading && posts.length === 0">
        <text>暂无帖子</text>
      </view>
      <view class="load-more" v-if="loading">
        <uni-icons type="spinner-cycle" size="16" color="#999"></uni-icons>
        <text>加载中...</text>
      </view>
    </view>
  </view>
</template>

<script>
import { IMAGE_BASE_URL,postsApi, userApi, likesApi, commentsApi } from '@/api'
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'

export default {
  components: {
    uniIcons
  },
  data() {
    return {
      posts: [],
      page: 1,
      pageSize: 10,
      hasMore: true,
      loading: false,
      userId: null
    }
  },
onShow() {
    this.userId = uni.getStorageSync('user_id')
    // console.log('userId from storage:', this.userId)
    // 重置分页和帖子列表
    this.page = 1
    this.hasMore = true
    this.posts = []
    this.loadPosts()
},
  methods: {
    fullImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return IMAGE_BASE_URL + url;
},
onImgError(e, img) {
  console.error('图片加载失败:', img.image_url, '实际src:', this.fullImageUrl(img.image_url), e);
},
onImgLoad(e, img) {
  // console.log('图片加载成功:', img.image_url, '实际src:', this.fullImageUrl(img.image_url), e);
},async loadPosts() {
  if (this.loading || !this.hasMore) return;
  this.loading = true;
  try {
    const res = await postsApi.getAll({
      page: this.page,
      limit: this.pageSize,
      order: 'created_at',
      sort: 'desc'
    });
    const posts = await Promise.all(res.data.map(async post => {
      // 获取用户信息
      let user = {};
      try {
        const userRes = await userApi.getById(post.user_id);
        user = userRes;
      } catch (error) {}
      // 获取帖子图片
      let images = [];
      try {
        const imgRes = await postsApi.getImages(post.post_id);
        images = Array.isArray(imgRes.data) ? imgRes.data : [];
      } catch (error) {}
      // 获取点赞信息
      let likeInfo = { like_count: 0, is_liked: false };
      try {
        if (this.userId) {
          likeInfo = await likesApi.getByPost(post.post_id, this.userId);
        }
      } catch (error) {}
      // 获取评论数
      let comment_count = 0;
      try {
        const commentRes = await commentsApi.getByPost(post.post_id);
        comment_count = Array.isArray(commentRes) ? commentRes.filter(c => !c.parent_id).length : 0;
      } catch (error) {}
      // 浏览量直接用post.view_count
      return {
        ...post,
        user,
        images,
        like_count: likeInfo.like_count || post.like_count || 0,
        isLiked: likeInfo.is_liked || false,
        comment_count: comment_count,
        view_count: post.view_count || 0
      };
    }));

    if (this.page === 1) {
      this.posts = posts;
    } else {
      this.posts = [...this.posts, ...posts];
    }
    this.hasMore = posts.length >= this.pageSize;
    this.page += 1;
  } catch (error) {
    uni.showToast({ title: '加载失败', icon: 'none' });
  } finally {
    this.loading = false;
  }
},
    loadMore() {
      this.loadPosts()
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
      const urls = images.map(img => img.image_url)
      uni.previewImage({ 
        current: urls[current], 
        urls 
      })
    },
    navigateToPost() {
      if (!this.userId) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
        return
      }
      uni.navigateTo({ 
        url: '/pages/community/post' 
      })
    },
    navigateToPostDetail(postId) {
      uni.navigateTo({ 
        url: `/pages/community/detail?id=${postId}` 
      })
    }
  }
}
</script>

<style>
/* 全局样式 */
page {
  background-color: #f5f5f5;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

/* 社区容器 */
.community-container {
  padding-bottom: 20rpx;
}

/* 发布按钮 */
.post-button {
  position: fixed;
  right: 30rpx;
  bottom: 120rpx;
  z-index: 99;
  background-color: #00B4D8;
  color: #fff;
  border-radius: 50rpx;
  padding: 15rpx 25rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 180, 216, 0.3);
}

.post-button uni-icons {
  margin-right: 8rpx;
}

/* 帖子列表 */
.post-list {
  padding: 20rpx;
}

.post-item {
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  padding: 25rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

/* 用户信息 */
.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin-right: 15rpx;
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
  font-size: 22rpx;
  color: #999;
  margin-top: 5rpx;
}

/* 帖子内容 */
.post-content {
  margin-bottom: 20rpx;
}

.post-title {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 15rpx;
  display: block;
}

.post-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  margin-bottom: 20rpx;
}

/* 帖子图片 */
.post-images {
  display: flex;
  flex-wrap: wrap;
  margin: -5rpx;
}

.post-image {
  width: calc(33.333% - 10rpx);
  height: 200rpx;
  margin: 5rpx;
  border-radius: 8rpx;
}

/* 互动统计 */
.interaction {
  display: flex;
  border-top: 1rpx solid #eee;
  padding-top: 20rpx;
}

.interaction-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  font-size: 26rpx;
}

.interaction-item uni-icons {
  margin-right: 8rpx;
}

/* 加载更多 */
.load-more, .no-more {
  text-align: center;
  padding: 30rpx 0;
  color: #999;
  font-size: 26rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.load-more uni-icons {
  margin-right: 10rpx;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>