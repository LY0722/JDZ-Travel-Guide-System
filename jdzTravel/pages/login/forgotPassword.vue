<template>
  <view class="forgot-password-container">
    <view class="forgot-header" :style="{backgroundColor: '#13d8d2'}">
      <text class="title-text">找回密码</text>
    </view>
    
    <view class="forgot-form">
      <view class="form-item">
        <uni-icons type="phone" size="24" color="#13d8d2"></uni-icons>
        <input class="form-input" type="number" v-model="phone" placeholder="请输入手机号" maxlength="11" />
      </view>
      
      <view class="form-item">
        <uni-icons type="email" size="24" color="#13d8d2"></uni-icons>
        <input class="form-input" type="number" v-model="verifyCode" placeholder="请输入验证码" />
        <view class="verify-code-btn" @click="getVerifyCode" :style="{color: canGetCode ? '#00B4D8' : '#999'}">
          {{ countdown > 0 ? `${countdown}s后重试` : '获取验证码' }}
        </view>
      </view>
      
      <view class="form-item">
        <uni-icons type="locked" size="24" color="#13d8d2"></uni-icons>
        <input class="form-input" :type="showPassword ? 'text' : 'password'" v-model="newPassword" placeholder="请输入新密码(6-20位)" />
        <uni-icons :type="showPassword ? 'eye' : 'eye-slash'" size="24" color="#999" @click="togglePasswordVisibility"></uni-icons>
      </view>
      
      <button class="submit-btn" @click="handleSubmit">确认修改</button>
    </view>
  </view>
</template>

<script>
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';

export default {
  components: {
    uniIcons
  },
  data() {
    return {
      phone: '',
      verifyCode: '',
      newPassword: '',
      showPassword: false,
      countdown: 0,
      canGetCode: true
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async getVerifyCode() {
      if (!this.canGetCode) return;
      
      if (!this.phone) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        });
        return;
      }
      
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      }
      
      uni.showLoading({
        title: '发送中...'
      });
      
      try {
        // 这里替换为实际的获取验证码API调用
        // const res = await uni.request({
        //   url: '/api/user/sendResetPasswordCode',
        //   method: 'POST',
        //   data: {
        //     phone: this.phone
        //   }
        // });
        
        // 模拟发送验证码
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: '验证码已发送',
            icon: 'success'
          });
          
          this.countdown = 60;
          this.canGetCode = false;
          this.startCountdown();
        }, 1500);
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: '发送失败: ' + (error.message || '未知错误'),
          icon: 'none'
        });
      }
    },
    startCountdown() {
      const timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(timer);
          this.canGetCode = true;
        }
      }, 1000);
    },
    async handleSubmit() {
      if (!this.phone) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        });
        return;
      }
      
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return;
      }
      
      if (!this.verifyCode) {
        uni.showToast({
          title: '请输入验证码',
          icon: 'none'
        });
        return;
      }
      
      if (!this.newPassword) {
        uni.showToast({
          title: '请输入新密码',
          icon: 'none'
        });
        return;
      }
      
      if (this.newPassword.length < 6 || this.newPassword.length > 20) {
        uni.showToast({
          title: '密码长度应为6-20位',
          icon: 'none'
        });
        return;
      }
      
      uni.showLoading({
        title: '提交中...'
      });
      
      try {
        // 这里替换为实际的找回密码API调用
        // const res = await uni.request({
        //   url: '/api/user/resetPassword',
        //   method: 'POST',
        //   data: {
        //     phone: this.phone,
        //     verifyCode: this.verifyCode,
        //     newPassword: this.newPassword
        //   }
        // });
        
        // 模拟找回密码成功
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: '密码修改成功',
            icon: 'success'
          });
          
          // 返回登录页面
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }, 2000);
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: '修改失败: ' + (error.message || '未知错误'),
          icon: 'none'
        });
      }
    }
  }
}
</script>

<style scoped>
.forgot-password-container {
  min-height: 100vh;
  background-color: #F5F7FA;
}

.forgot-header {
  padding: 60rpx 40rpx;
  padding-top: 120rpx;
  border-bottom-left-radius: 40rpx;
  border-bottom-right-radius: 40rpx;
  color: #fff;
}

.title-text {
  font-size: 40rpx;
  font-weight: bold;
}

.forgot-form {
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

.verify-code-btn {
  font-size: 24rpx;
  margin-left: 20rpx;
  white-space: nowrap;
}

.submit-btn {
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
</style>