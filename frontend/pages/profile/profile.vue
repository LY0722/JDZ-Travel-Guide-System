<template>
  <view class="profile-container" :style="{backgroundColor: '#F5F7FA'}">
    <!-- 用户信息头部 -->
    <view class="profile-header" :style="{backgroundColor: '#13d8d2'}">
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatar_url || '/static/default-avatar.png'" mode="aspectFill"></image>
        <view class="user-detail">
          <text class="username">
            {{ isLoggedIn ? (userInfo.nickname || '未设置昵称') : '登录/注册' }}
          </text>
          <text class="user-id">ID: {{userInfo.user_id || '未登录'}}</text>
          <text class="user-phone" v-if="isLoggedIn && userInfo.phone">手机: {{userInfo.phone}}</text>
          <view class="stats">
<view class="stat-item" @click="navigateTo('/pages/profile/myLikes')">
  <text class="stat-number">{{userStats.likes}}</text>
  <text class="stat-label">收藏</text>
</view>
            <view class="stat-item" @click="navigateTo('/pages/profile/myPosts')">
              <text class="stat-number">{{userStats.posts}}</text>
              <text class="stat-label">帖子</text>
            </view>
            <view class="stat-item" @click="navigateTo('/pages/profile/myComments')">
              <text class="stat-number">{{userStats.comments}}</text>
              <text class="stat-label">评论</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="section-title">
        <text class="title-text">我的内容</text>
      </view>
      <view class="menu-grid">
        <view class="menu-item" @click="navigateTo('/pages/profile/myPosts')">
          <uni-icons type="compose" size="30" color="#13d8d2"></uni-icons>
          <text class="menu-text">我的帖子</text>
        </view>
<view class="menu-item" @click="navigateTo('/pages/profile/myLikes')">
  <uni-icons type="heart" size="30" color="#13d8d2"></uni-icons>
  <text class="menu-text">我的收藏</text>
</view>
        <view class="menu-item" @click="navigateTo('/pages/profile/myComments')">
          <uni-icons type="chat" size="30" color="#13d8d2"></uni-icons>
          <text class="menu-text">我的评论</text>
        </view>
        <view class="menu-item" @click="navigateTo('/pages/profile/browsehistory')">
          <uni-icons type="eye" size="30" color="#13d8d2"></uni-icons>
          <text class="menu-text">浏览历史</text>
        </view>
      </view>
    </view>

    <!-- 设置菜单 -->
    <view class="menu-section">
      <view class="section-title">
        <text class="title-text">账号设置</text>
      </view>
      <view class="menu-list">
        <view class="menu-item" @click="navigateTo('/pages/profile/editProfile')">
          <uni-icons type="person" size="30" color="#13d8d2"></uni-icons>
          <text class="menu-text">编辑资料</text>
          <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
        </view>
        <view class="menu-item" @click="navigateTo('/pages/profile/settings')">
          <uni-icons type="gear" size="30" color="#13d8d2"></uni-icons>
          <text class="menu-text">系统设置</text>
          <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
        </view>
        <view class="menu-item" @click="navigateTo('/pages/profile/feedback')">
          <uni-icons type="help" size="30" color="#13d8d2"></uni-icons>
          <text class="menu-text">意见反馈</text>
          <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
        </view>
      </view>
    </view>

    <!-- 登录/退出按钮 -->
    <view class="logout-section">
      <button v-if="isLoggedIn" class="logout-btn" @click="handleLogout">退出登录</button>
      <button v-else class="login-btn" @click="handleLogin">登录/注册</button>
    </view>
  </view>
</template>

<script>
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';
import { userApi, likesApi } from '@/api'; 

export default {
  components: {
    uniIcons
  },
  data() {
    return {
      isLoggedIn: false,
      userInfo: {
        user_id: '',
        username: '',
        avatar_url: '',
        phone: '',
        email: '',
        registration_time: '',
        last_login_time: ''
      },
      userStats: {
        likes: 0,
        posts: 0,
        comments: 0
      }
    }
  },
  onShow() {
    this.checkLoginStatus();
    if (this.isLoggedIn) {
      this.loadUserInfo();
      this.getUserStats();
    }
  },
  methods: {
    checkLoginStatus() {
      try {
        const token = uni.getStorageSync('token');
        const userId = uni.getStorageSync('user_id');
        this.isLoggedIn = !!token && !!userId;
        
        // 如果已登录，尝试从本地存储加载用户信息
        if (this.isLoggedIn) {
          const cachedUserInfo = uni.getStorageSync('userInfo');
          if (cachedUserInfo) {
            this.userInfo = {
              ...this.userInfo,
              ...cachedUserInfo
            };
          }
        }
      } catch (e) {
        console.error('检查登录状态失败:', e);
        this.isLoggedIn = false;
      }
    },
    async loadUserInfo() {
      try {
        const userId = uni.getStorageSync('user_id');
        if (!userId) {
          this.isLoggedIn = false;
          return;
        }
        
        // 从API获取用户信息
        const res = await userApi.getById(userId);
        if (res && res.data) {
          this.userInfo = {
            ...this.userInfo,
            ...res.data,
            registration_time: this.formatDate(res.data.registration_time),
            last_login_time: this.formatDate(res.data.last_login_time)
          };
          
          // 更新本地存储的用户信息
          uni.setStorageSync('userInfo', this.userInfo);
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
        uni.showToast({
          title: '获取用户信息失败',
          icon: 'none'
        });
      }
    },
async getUserStats() {
  try {
    const userId = uni.getStorageSync('user_id');
    if (!userId) return;

    const [likesRes, postsRes, commentsRes] = await Promise.all([
      likesApi.getByUser(userId),
      userApi.getPosts(userId),
      userApi.getComments(userId)
    ]);

    // 兼容对象和数组
    const getCount = (res) => {
      if (Array.isArray(res)) return res.length;
      if (res && Array.isArray(res.data)) return res.data.length;
      return 0;
    };

    this.userStats = {
      likes: getCount(likesRes),
      posts: getCount(postsRes),
      comments: getCount(commentsRes)
    };
  } catch (error) {
    console.error('获取用户统计失败:', error);
    uni.showToast({
      title: '获取用户统计失败',
      icon: 'none'
    });
  }
},
    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    },
    handleLogin() {
      uni.navigateTo({
        url: '/pages/login/login'
      });
    },
    async handleLogout() {
      try {
        // 清除本地存储
        uni.removeStorageSync('token');
        uni.removeStorageSync('user_id');
        uni.removeStorageSync('userInfo');
        
        this.isLoggedIn = false;
        this.userInfo = {
          user_id: '',
          username: '',
          avatar_url: '',
          phone: '',
          email: '',
          registration_time: '',
          last_login_time: ''
        };
        this.userStats = {
          favorites: 0,
          posts: 0,
          comments: 0
        };
        
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        });
      } catch (error) {
        console.error('退出登录失败:', error);
        uni.showToast({
          title: '退出登录失败',
          icon: 'none'
        });
      }
    },
    navigateTo(url) {
      if (!this.isLoggedIn && url !== '/pages/login/login') {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        });
        return;
      }
      uni.navigateTo({
        url: url
      });
    }
  }
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  padding-bottom: 50px;
}

/* 头部样式 */
.profile-header {
  padding: 30rpx;
  padding-top: 80rpx;
  border-bottom-left-radius: 30rpx;
  border-bottom-right-radius: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 180, 216, 0.2);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  border: 4rpx solid #fff;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.user-detail {
  margin-left: 30rpx;
  flex: 1;
}

.username {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  display: block;
  margin-bottom: 8rpx;
}

.user-id, .user-phone {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
  display: block;
  margin-bottom: 8rpx;
}

.stats {
  display: flex;
  margin-top: 20rpx;
}

.stat-item {
  margin-right: 40rpx;
  text-align: center;
}

.stat-number {
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
  display: block;
}

.stat-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

/* 菜单区域样式 */
.menu-section {
  background-color: #fff;
  border-radius: 20rpx;
  margin: 30rpx;
  padding: 20rpx 0;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  padding: 0 30rpx 20rpx;
  border-bottom: 1rpx solid #f1f1f1;
}

.title-text {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.menu-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx 0;
}

.menu-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 0;
}

.menu-text {
  font-size: 24rpx;
  color: #666;
  margin-top: 10rpx;
}

.menu-list {
  padding: 0 30rpx;
}

.menu-list .menu-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 30rpx 0;
  width: 100%;
  border-bottom: 1rpx solid #f1f1f1;
}

.menu-list .menu-item:last-child {
  border-bottom: none;
}

.menu-list .menu-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  margin: 0 20rpx;
}

/* 登录/退出按钮样式 */
.logout-section {
  margin: 50rpx 30rpx 0;
}

.logout-btn, .login-btn {
  background-color: #13d8d2;
  color: #fff;
  border-radius: 50rpx;
  font-size: 32rpx;
  height: 90rpx;
  line-height: 90rpx;
  text-align: center;
  border: none;
}

.logout-btn {
  background-color: #fff;
  color: #00B4D8;
  border: 1rpx solid #00B4D8;
}

button::after {
  border: none;
}

/* 点击效果 */
.stat-item, .menu-item {
  transition: transform 0.2s;
}

.stat-item:active, .menu-item:active {
  transform: scale(0.95);
}
</style>