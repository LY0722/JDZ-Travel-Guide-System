<template>
  <view class="post-container">
    <!-- 头部导航 -->
    <view class="post-header">
      <view class="back-button" @click="goBack">
        <uni-icons type="arrowleft" size="24" color="#333"></uni-icons>
      </view>
      <text class="header-title">发布帖子</text>
      <view class="submit-button" @click="submitPost" :class="{disabled: !canSubmit}">
        <text>发布</text>
      </view>
    </view>
    
    <!-- 表单区域 -->
    <view class="post-form">
      <view class="form-item">
        <input v-model="postForm.title" placeholder="请输入标题（必填）" maxlength="30" class="title-input" placeholder-class="placeholder"/>
        <text class="word-count">{{postForm.title.length}}/30</text>
      </view>
      
      <view class="form-item">
        <textarea v-model="postForm.content" placeholder="分享你的想法或问题（必填）" maxlength="500" 
          class="content-input" placeholder-class="placeholder" auto-height/>
        <text class="word-count">{{postForm.content.length}}/500</text>
      </view>
      
      <view class="form-item">
        <view class="upload-title">
          <text>添加图片（可选）</text>
          <text class="upload-tip">最多9张</text>
        </view>
        
        <view class="image-uploader">
          <view class="upload-box" v-for="(image, index) in postForm.images" :key="image">
            <image :src="fullImageUrl(image)" class="upload-image" mode="aspectFill"></image>
            <view class="delete-btn" @click.stop="deleteImage(index)">
              <uni-icons type="closeempty" size="16" color="#fff"></uni-icons>
            </view>
          </view>
          <view class="upload-box add-btn" @click="chooseImage" v-if="postForm.images.length < 9">
            <uni-icons type="plusempty" size="32" color="#999"></uni-icons>
          </view>
        </view>
      </view>
    </view>
    
    <view class="post-tips">
      <uni-icons type="info" size="14" color="#999"></uni-icons>
      <text>请遵守社区规范，禁止发布违法、低俗、广告等内容</text>
    </view>
  </view>
</template>

<script>
import { IMAGE_BASE_URL,postsApi, postImagesApi } from '@/api.js'
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
export default {
  components: {
    uniIcons
  },
  data() {
    return {
      postForm: {
        title: '',
        content: '',
        images: []
      },
      userId: ''
    }
  },
  onShow() {
    this.userId = uni.getStorageSync('user_id');
  },
  computed: {
    canSubmit() {
      return this.postForm.title.trim() && this.postForm.content.trim()
    }
  },
  methods: {    
    fullImageUrl(url) {
      if (!url) return '';
      if (url.startsWith('http')) return url;
      return IMAGE_BASE_URL + url;
    },
    goBack() {
      uni.navigateBack()
    },
    chooseImage() {
      uni.chooseImage({
        count: 9 - this.postForm.images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          res.tempFilePaths.forEach(path => {
            this.postForm.images.push(path)
          })
        }
      })
    },
    deleteImage(index) {
      uni.showModal({
        title: '提示',
        content: '确定要删除这张图片吗？',
        success: (res) => {
          if (res.confirm) {
            this.postForm.images.splice(index, 1)
          }
        }
      })
    },
    async submitPost() {
      const userId = this.userId || uni.getStorageSync('user_id');
      if (!userId) {
        uni.showModal({
          title: '提示',
          content: '请先登录后再发布帖子',
          confirmText: '去登录',
          success: (res) => {
            if (res.confirm) {
              uni.navigateTo({ url: '/pages/login/login' });
            }
          }
        });
        return;
      }
      if (!this.canSubmit) return;

      uni.showLoading({ title: '发布中...', mask: true });

      try {
        const postRes = await postsApi.create({
          user_id: userId,
          title: this.postForm.title,
          content: this.postForm.content
        });
        
        if (!postRes.post_id) throw new Error('帖子创建失败，未返回post_id');
        const postId = postRes.post_id;

        let imageIds = [];
        if (this.postForm.images.length > 0) {
          const uploadPromises = this.postForm.images.map(filePath =>
            postImagesApi.upload({ postId, filePath })
          );
          const uploadResults = await Promise.all(uploadPromises);
          imageIds = uploadResults.map(res => res.image_id);
          if (imageIds.length > 0) {
            await postsApi.update(postId, { main_image_id: imageIds[0] });
          }
        }

        uni.hideLoading();
        uni.showToast({ 
          title: '发布成功', 
          icon: 'success',
          duration: 2000
        });
        setTimeout(() => uni.navigateBack(), 2000);
      } catch (error) {
        uni.hideLoading();
        uni.showToast({
          title: error.message || '发布失败，请重试',
          icon: 'none',
          duration: 3000
        });
      }
    }
  }
}
</script>

<style lang="scss">
/* 页面容器 */
.post-container {
  padding-bottom: 120rpx;
  background-color: #f8f8f8;
  min-height: 100vh;
}

/* 头部导航 */
.post-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 32rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #f0f0f0;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.back-button {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
  
  &:active {
    background-color: #f5f5f5;
  }
}

.header-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  letter-spacing: 1rpx;
}

.submit-button {
  padding: 12rpx 32rpx;
  background: linear-gradient(135deg, #00B4D8, #0096C7);
  color: #fff;
  border-radius: 40rpx;
  font-size: 30rpx;
  font-weight: 500;
  box-shadow: 0 4rpx 12rpx rgba(0, 180, 216, 0.3);
  transition: all 0.3s;
  
  &:active {
    transform: scale(0.96);
    opacity: 0.9;
  }
  
  &.disabled {
    background: #e0e0e0;
    box-shadow: none;
    color: #aaa;
  }
}

/* 表单区域 */
.post-form {
  background-color: #fff;
  padding: 0 32rpx;
  margin-top: 24rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.03);
}

.form-item {
  padding: 32rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
  position: relative;
  
  &:last-child {
    border-bottom: none;
  }
}

.placeholder {
  color: #c0c0c0;
  font-size: 30rpx;
}

/* 标题输入 */
.title-input {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  width: 100%;
  padding-right: 120rpx;
  line-height: 1.5;
  
  &::placeholder {
    font-weight: normal;
  }
}

/* 内容输入 */
.content-input {
  font-size: 32rpx;
  color: #555;
  width: 100%;
  min-height: 240rpx;
  line-height: 1.6;
  padding-right: 120rpx;
  margin-top: 8rpx;
}

/* 字数统计 */
.word-count {
  position: absolute;
  right: 0;
  bottom: 36rpx;
  font-size: 26rpx;
  color: #bbb;
}

/* 图片上传 */
.upload-title {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.upload-tip {
  font-size: 26rpx;
  color: #999;
  margin-left: 16rpx;
  font-weight: normal;
}

.image-uploader {
  display: flex;
  flex-wrap: wrap;
  margin: -8rpx;
}

.upload-box {
  width: 220rpx;
  height: 220rpx;
  margin: 8rpx;
  border-radius: 12rpx;
  background-color: #f9f9f9;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s;
  
  &:active {
    transform: scale(0.98);
  }
}

.upload-image {
  width: 100%;
  height: 100%;
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx dashed #ddd;
  background-color: #fafafa;
  
  &:active {
    background-color: #f5f5f5;
  }
}

.delete-btn {
  position: absolute;
  right: 0;
  top: 0;
  width: 44rpx;
  height: 44rpx;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 0 0 0 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:active {
    background-color: rgba(0, 0, 0, 0.7);
  }
}

/* 底部提示 */
.post-tips {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28rpx 32rpx;
  margin-top: 32rpx;
  background-color: #f9f9f9;
  border-radius: 12rpx;
  font-size: 26rpx;
  color: #999;
  line-height: 1.5;
  text-align: center;
  
  uni-icons {
    margin-right: 10rpx;
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.post-form {
  animation: fadeIn 0.4s ease-out;
}
</style>