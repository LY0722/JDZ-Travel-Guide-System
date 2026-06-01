<template>
  <view class="edit-profile-container">
    <view class="title">编辑资料</view>
    <view class="form">
      <view class="form-item">
        <text class="label">昵称</text>
        <input v-model="form.nickname" placeholder="请输入昵称" class="input"/>
      </view>
      <view class="form-item">
        <text class="label">手机号</text>
        <input v-model="form.phone" placeholder="请输入手机号" class="input"/>
      </view>
      <view class="form-item">
        <text class="label">邮箱</text>
        <input v-model="form.email" placeholder="请输入邮箱" class="input"/>
      </view>
      <view class="form-item avatar-item">
        <text class="label">头像</text>
<image
:src="form.avatar_url 
  ? (form.avatar_url.startsWith('http')
      ? form.avatar_url 
      : IMAGE_BASE_URL + form.avatar_url)
  : defaultAvatar"
  class="avatar-img"
  @click="chooseAvatar"
/>
        <text class="avatar-tip">点击更换头像</text>
      </view>
      <button type="primary" class="save-btn" @click="saveProfile">保存</button>
    </view>
  </view>
</template>

<script>
import { userApi, IMAGE_BASE_URL } from '@/api.js'
export default {
  data() {
    return {
      userId: uni.getStorageSync('user_id') || null,
      form: {
        nickname: '',
        phone: '',
        email: '',
        avatar_url: ''
      },
      defaultAvatar: IMAGE_BASE_URL + '/static/default-avatar.png'
    }
  },
  computed: {
    IMAGE_BASE_URL_COMPUTED() {
      return IMAGE_BASE_URL
    }
  },
  onLoad() {
    this.loadProfile()
  },
  methods: {
    async loadProfile() {
      if (!this.userId) return
      try {
        const res = await userApi.getById(this.userId)
        this.form = {
          nickname: res.nickname || '',
          phone: res.phone || '',
          email: res.email || '',
          avatar_url: res.avatar_url || ''
        }
      } catch (e) {
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
    },
    chooseAvatar() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          const filePath = res.tempFilePaths[0]
uni.uploadFile({
  url: IMAGE_BASE_URL + '/api/user/upload-avatar',
  filePath,
  name: 'file',
  header: {
    'Authorization': `Bearer ${uni.getStorageSync('token')}`
  },
  success: (uploadRes) => {
    try {
      const data = JSON.parse(uploadRes.data);
      if (data.avatar_url) {
        this.form.avatar_url = data.avatar_url;
        uni.showToast({ title: '头像上传成功' });
      } else {
        uni.showToast({ title: '上传失败', icon: 'none' });
      }
    } catch (e) {
      uni.showToast({ title: '上传失败', icon: 'none' });
    }
  },
  fail: (err) => {
    console.error('上传失败:', err);
    uni.showToast({ title: '上传失败', icon: 'none' });
  }
});
        }
      })
    },
async saveProfile() {
  try {
    // 获取当前用户信息
    const currentUser = uni.getStorageSync('userInfo');
    // 确保包含所有必要字段
    const updateData = {
      ...this.form,
      username: currentUser.username, // 保留原用户名
      password: currentUser.password // 保留原密码
    };
    await userApi.update(this.userId, updateData);
    
    // 更新本地存储的用户信息
    const updatedUser = { ...currentUser, ...this.form };
    uni.setStorageSync('userInfo', updatedUser);
    
    uni.showToast({ title: '保存成功' });
    uni.navigateBack();
  } catch (e) {
    uni.showToast({ title: '保存失败', icon: 'none' });
  }
}
  }
}
</script>

<style scoped>
.edit-profile-container {
  padding: 40rpx 24rpx 24rpx 24rpx;
  min-height: 100vh;
  background: linear-gradient(135deg, #f7f8fa 60%, #caf0f8 100%);
}
.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #222;
  margin-bottom: 36rpx;
  letter-spacing: 2rpx;
  text-align: center;
}
.form {
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 8rpx 32rpx rgba(0,180,216,0.06);
  padding: 36rpx 28rpx 28rpx 28rpx;
}
.form-item {
  display: flex;
  align-items: center;
  margin-bottom: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
  padding-bottom: 18rpx;
}
.form-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
.label {
  width: 120rpx;
  font-size: 30rpx;
  color: #222;
  font-weight: 500;
}
.input {
  flex: 1;
  font-size: 30rpx;
  color: #333;
  border: none;
  background: transparent;
  padding: 0 8rpx;
}
.avatar-item {
  align-items: flex-start;
  flex-direction: column;
  padding-bottom: 0;
  margin-bottom: 24rpx;
}
.avatar-img {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: #f0f0f0;
  margin-top: 8rpx;
  margin-bottom: 8rpx;
  border: 2rpx solid #00b4d8;
  box-shadow: 0 2rpx 8rpx rgba(0,180,216,0.10);
}
.avatar-tip {
  font-size: 24rpx;
  color: #888;
  margin-left: 4rpx;
}
.save-btn {
  width: 100%;
  margin-top: 18rpx;
  background: linear-gradient(90deg, #00b4d8, #48cae4);
  color: #fff;
  font-size: 32rpx;
  border-radius: 32rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-weight: bold;
  letter-spacing: 2rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,180,216,0.10);
  border: none;
}
</style>