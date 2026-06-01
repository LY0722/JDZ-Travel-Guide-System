<template>
  <view class="login-container">
    <!-- 顶部背景 -->
    <view class="login-header" :style="{backgroundColor: '#13d8d2'}">
      <text class="welcome-text">欢迎回来</text>
      <text class="sub-text">请登录您的账号</text>
    </view>

    <!-- 登录表单 -->
    <view class="login-form">
      <view class="form-item">
        <uni-icons type="phone" size="20" color="#999"></uni-icons>
        <input class="form-input" type="number" v-model="phone" placeholder="请输入手机号" maxlength="11" />
      </view>
      <view class="form-item">
        <uni-icons type="locked" size="20" color="#999"></uni-icons>
        <input class="form-input" :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="请输入密码" />
        <uni-icons :type="showPassword ? 'eye-filled' : 'eye'" size="20" color="#999" @click="togglePasswordVisibility"></uni-icons>
      </view>

      <view class="forgot-password" @click="navigateTo('/pages/login/forgotPassword')">
        <text>忘记密码?</text>
      </view>

      <button class="login-btn" @click="handleLogin">登录</button>

      <view class="register-link">
        <text>还没有账号?</text>
        <text class="register-text" @click="navigateTo('/pages/login/register')">立即注册</text>
      </view>
    </view>

    <!-- 其他登录方式 -->
    <view class="other-login-methods">
      <view class="divider">
        <view class="divider-line"></view>
        <text class="divider-text">其他登录方式</text>
        <view class="divider-line"></view>
      </view>

      <view class="methods">
        <view class="method-item" @click="loginWithWeChat">
          <uni-icons type="weixin" size="40" color="#09BB07"></uni-icons>
          <text class="method-text">微信</text>
        </view>
        <view class="method-item" @click="loginWithQQ">
          <uni-icons type="qq" size="40" color="#12B7F5"></uni-icons>
          <text class="method-text">QQ</text>
        </view>
        <view class="method-item" @click="loginWithWeibo">
          <uni-icons type="weibo" size="40" color="#E6162D"></uni-icons>
          <text class="method-text">微博</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { userApi } from '@/api.js';
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';

export default {
  components: {
    uniIcons
  },
  data() {
    return {
      phone: '',
      password: '',
      showPassword: false
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async handleLogin() {
      if (!this.phone) {
        uni.showToast({ title: '请输入手机号', icon: 'none' }); return;
      }
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        uni.showToast({ title: '请输入正确的手机号', icon: 'none' }); return;
      }
      if (!this.password) {
        uni.showToast({ title: '请输入密码', icon: 'none' }); return;
      }
      if (this.password.length < 6) {
        uni.showToast({ title: '密码长度不能少于6位', icon: 'none' }); return;
      }

      uni.showLoading({ title: '登录中...' });
      try {
        // 获取所有用户
        const res = await userApi.getAll();
        
        // 查找手机号匹配的用户
        const userList = res.data || [];
        const user = userList.find(u => u.phone === this.phone);
        
        if (!user) {
          uni.hideLoading();
          uni.showToast({ title: '账号不存在', icon: 'none' });
          return;
        }
        
        // 密码校验（实际项目中应该使用加密比对）
        if (user.password !== this.password) {
          uni.hideLoading();
          uni.showToast({ title: '密码错误', icon: 'none' });
          return;
        }
        
        // 登录成功，保存用户信息
        uni.setStorageSync('token', 'user-token-' + user.user_id); // 模拟token
        uni.setStorageSync('user_id', user.user_id);
        uni.setStorageSync('userInfo', user);
        
        uni.hideLoading();
        uni.showToast({ title: '登录成功', icon: 'success' });
        
        setTimeout(() => {
          uni.switchTab({ url: '/pages/profile/profile' });
        }, 1500);
        
      } catch (error) {
        uni.hideLoading();
        console.error('登录失败:', error);
        uni.showToast({ 
          title: '登录失败: ' + (error.message || '未知错误'), 
          icon: 'none' 
        });
      }
    },
    navigateTo(url) {
      uni.navigateTo({ url });
    },
    loginWithWeChat() {
      uni.showToast({ title: '微信登录功能暂未实现', icon: 'none' });
    },
    loginWithQQ() {
      uni.showToast({ title: 'QQ登录功能暂未实现', icon: 'none' });
    },
    loginWithWeibo() {
      uni.showToast({ title: '微博登录功能暂未实现', icon: 'none' });
    }
  }
}
</script>

<style scoped>
/* 原有样式保持不变 */
.login-container {
  min-height: 100vh;
  background-color: #F5F7FA;
}

.login-header {
  padding: 60rpx 40rpx;
  padding-top: 120rpx;
  border-bottom-left-radius: 40rpx;
  border-bottom-right-radius: 40rpx;
  color: #fff;
}

.welcome-text {
  font-size: 48rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.sub-text {
  font-size: 28rpx;
  opacity: 0.9;
}

.login-form {
  padding: 60rpx 40rpx;
  margin: 40rpx;
  margin-top: -40rpx;
  background-color: #fff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
}

.form-item {
  display: flex;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f1f1f1;
}

.form-input {
  flex: 1;
  font-size: 28rpx;
  height: 40rpx;
  line-height: 40rpx;
  margin: 0 20rpx;
}

.forgot-password {
  text-align: right;
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #999;
}

.login-btn {
  background-color: #13d8d2;
  color: #fff;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 45rpx;
  font-size: 32rpx;
  margin-top: 60rpx;
}

button::after {
  border: none;
}

.register-link {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40rpx;
  font-size: 26rpx;
  color: #666;
}

.register-text {
  color: #00B4D8;
  margin-left: 10rpx;
}

.other-login-methods {
  margin-top: 80rpx;
  padding: 0 40rpx;
}

.divider {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.divider-line {
  flex: 1;
  height: 1rpx;
  background-color: #e5e5e5;
}

.divider-text {
  font-size: 24rpx;
  color: #999;
  padding: 0 20rpx;
}

.methods {
  display: flex;
  justify-content: center;
}

.method-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 40rpx;
}

.method-text {
  font-size: 24rpx;
  color: #666;
  margin-top: 10rpx;
}
</style>