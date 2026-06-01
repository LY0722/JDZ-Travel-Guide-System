<template>
  <view class="profile-container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatar_url || '/static/default-avatar.png'" mode="aspectFill"></image>
        <view class="info-right">
          <text class="username">{{userInfo.username || '未设置昵称'}}</text>
          <text class="phone">{{userInfo.phone || '未绑定手机'}}</text>
        </view>
      </view>
      <view class="stats">
        <view class="stat-item" @click="navigateTo('/pages/profile/favorites')">
          <text class="stat-value">{{favoritesCount}}</text>
          <text class="stat-label">收藏</text>
        </view>
        <view class="stat-item" @click="navigateTo('/pages/profile/history')">
          <text class="stat-value">{{historyCount}}</text>
          <text class="stat-label">足迹</text>
        </view>
        <view class="stat-item" @click="navigateTo('/pages/profile/posts')">
          <text class="stat-value">{{postsCount}}</text>
          <text class="stat-label">帖子</text>
        </view>
      </view>
    </view>

    <!-- 功能入口 -->
    <view class="function-grid">
      <view class="function-item" @click="navigateTo('/pages/profile/settings')">
        <uni-icons type="gear" size="24" color="#13d8d2"></uni-icons>
        <text class="function-text">账号设置</text>
      </view>
      <view class="function-item" @click="navigateTo('/pages/profile/favorites')">
        <uni-icons type="heart" size="24" color="#FF6B6B"></uni-icons>
        <text class="function-text">我的收藏</text>
      </view>
      <view class="function-item" @click="navigateTo('/pages/profile/history')">
        <uni-icons type="eye" size="24" color="#4ECDC4"></uni-icons>
        <text class="function-text">浏览历史</text>
      </view>
      <view class="function-item" @click="navigateTo('/pages/profile/plans')">
        <uni-icons type="map" size="24" color="#45B7D1"></uni-icons>
        <text class="function-text">路线规划</text>
      </view>
    </view>

    <!-- 我的动态 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">我的动态</text>
        <text class="section-more" @click="navigateTo('/pages/profile/posts')">查看更多 ></text>
      </view>
      
      <view class="post-list">
        <view class="post-item" v-for="(post, index) in recentPosts" :key="index" @click="navigateTo(`/pages/community/post?id=${post.post_id}`)">
          <text class="post-title">{{post.title}}</text>
          <text class="post-content">{{post.content | truncate(50)}}</text>
          <view class="post-footer">
            <text class="post-time">{{post.created_at | formatTime}}</text>
            <view class="post-stats">
              <uni-icons type="eye" size="14" color="#999"></uni-icons>
              <text class="stat-text">{{post.view_count}}</text>
              <uni-icons type="heart" size="14" color="#999" style="margin-left: 15rpx;"></uni-icons>
              <text class="stat-text">{{post.like_count}}</text>
              <uni-icons type="chat" size="14" color="#999" style="margin-left: 15rpx;"></uni-icons>
              <text class="stat-text">{{post.comment_count}}</text>
            </view>
          </view>
        </view>
        
        <view class="empty-tip" v-if="recentPosts.length === 0">
          <uni-icons type="info" size="20" color="#999"></uni-icons>
          <text>暂无动态，去社区发帖吧~</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script>
import { userApi, browseHistoryApi, favoritesApi, postsApi } from '@/api.js';
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';

export default {
  components: {
    uniIcons
  },
  data() {
    return {
      userInfo: {},
      favoritesCount: 0,
      historyCount: 0,
      postsCount: 0,
      recentPosts: []
    }
  },
  filters: {
    truncate(value, length) {
      if (!value) return '';
      if (value.length > length) {
        return value.substring(0, length) + '...';
      }
      return value;
    },
    formatTime(value) {
      if (!value) return '';
      const date = new Date(value);
      return `${date.getMonth()+1}月${date.getDate()}日`;
    }
  },
  async onShow() {
    await this.loadUserData();
  },
  methods: {
    async loadUserData() {
      const userId = uni.getStorageSync('user_id');
      if (!userId) {
        uni.redirectTo({ url: '/pages/login/login' });
        return;
      }
      
      uni.showLoading({ title: '加载中...' });
      try {
        // 获取用户信息
        const userRes = await userApi.getById(userId);
        this.userInfo = userRes.data || userRes;
        
        // 获取收藏数量
        const favRes = await favoritesApi.getByUser(userId);
        this.favoritesCount = (favRes.data || favRes).length;
        
        // 获取浏览历史数量
        const historyRes = await browseHistoryApi.getByUser(userId);
        this.historyCount = (historyRes.data || historyRes).length;
        
        // 获取帖子数量和最近帖子
        const postsRes = await postsApi.getByUser(userId);
        const posts = postsRes.data || postsRes;
        this.postsCount = posts.length;
        this.recentPosts = posts.slice(0, 2);
        
      } catch (error) {
        console.error('加载用户数据失败:', error);
        uni.showToast({ title: '加载失败', icon: 'none' });
      } finally {
        uni.hideLoading();
      }
    },
    navigateTo(url) {
      uni.navigateTo({ url });
    },
    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗?',
        success: (res) => {
          if (res.confirm) {
            uni.clearStorageSync();
            uni.reLaunch({ url: '/pages/login/login' });
          }
        }
      });
    }
  }
}
</script>

<style scoped>
.profile-container {
  padding-bottom: 120rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.user-card {
  background-color: #fff;
  padding: 40rpx;
  margin-bottom: 20rpx;
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  margin-right: 30rpx;
}

.info-right {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.phone {
  font-size: 28rpx;
  color: #999;
}

.stats {
  display: flex;
  justify-content: space-around;
  border-top: 1rpx solid #f1f1f1;
  padding-top: 30rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}

.function-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background-color: #fff;
  padding: 30rpx 0;
  margin-bottom: 20rpx;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.function-text {
  font-size: 24rpx;
  color: #666;
  margin-top: 10rpx;
}

.section {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.section-more {
  font-size: 24rpx;
  color: #999;
}

.post-list {
  margin-top: 20rpx;
}

.post-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f1f1f1;
}

.post-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.post-content {
  font-size: 26rpx;
  color: #666;
  display: block;
  margin-bottom: 15rpx;
  line-height: 1.5;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-time {
  font-size: 24rpx;
  color: #999;
}

.post-stats {
  display: flex;
  align-items: center;
}

.stat-text {
  font-size: 24rpx;
  color: #999;
  margin-left: 5rpx;
}

.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
  color: #999;
  font-size: 26rpx;
}

.empty-tip uni-icons {
  margin-bottom: 15rpx;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1rpx solid #eee;
}

.logout-btn {
  width: 80%;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #ff6b6b;
  color: #fff;
  font-size: 32rpx;
  border-radius: 40rpx;
}

button::after {
  border: none;
}
</style>