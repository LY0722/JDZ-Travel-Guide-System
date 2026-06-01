<template>
  <view class="shop-detail-container">
    <!-- 加载状态 -->
    <view class="loading-container" v-if="loading">
      <uni-icons type="spinner-cycle" size="32" color="#00B4D8"></uni-icons>
      <text>加载中...</text>
    </view>
    
    <!-- 内容区域 -->
    <template v-else>
      <!-- 店铺头部 -->
      <view class="shop-header">
        <image :src="shop.mainImage || '/static/shop-default.jpg'" mode="aspectFill" class="shop-cover"></image>
        <view class="shop-basic">
          <text class="shop-name">{{shop.shop_name}}</text>
          <view class="shop-tags">
            <text class="shop-tag">{{shop.experience_type}}</text>
            <text class="shop-tag">{{shop.price_range}}</text>
          </view>
        </view>
      </view>

      <!-- 店铺信息 -->
      <view class="info-section">
        <view class="section-title">
          <uni-icons type="info" size="16" color="#00B4D8"></uni-icons>
          <text>店铺信息</text>
        </view>
        <view class="info-item">
          <text class="info-label">地址：</text>
          <text class="info-content">{{shop.shop_address}}</text>
        </view>
        <view class="info-item">
          <text class="info-label">电话：</text>
          <text class="info-content">{{shop.contact_phone || '暂无电话'}}</text>
        </view>
        <view class="info-item">
          <text class="info-label">营业时间：</text>
          <text class="info-content">{{shop.business_hours || '09:00-18:00'}}</text>
        </view>
        <view class="info-item">
          <text class="info-label">体验价格：</text>
          <text class="info-content">{{shop.price_range || '价格待定'}}</text>
        </view>
      </view>

      <!-- 店铺介绍 -->
      <view class="info-section">
        <view class="section-title">
          <uni-icons type="paperclip" size="16" color="#00B4D8"></uni-icons>
          <text>店铺介绍</text>
        </view>
        <text class="shop-desc">{{shop.shop_description || '暂无详细介绍'}}</text>
      </view>

      <!-- 图片展示 -->
      <view class="info-section" v-if="images.length > 0">
        <view class="section-title">
          <uni-icons type="image" size="16" color="#00B4D8"></uni-icons>
          <text>环境图片</text>
        </view>
        <scroll-view class="image-scroll" scroll-x>
          <image 
            v-for="(img, index) in images" 
            :key="index" 
            :src="img.image_url" 
            mode="aspectFill" 
            class="shop-image"
            @click="previewImage(index)">
          </image>
        </scroll-view>
      </view>

      <!-- 底部操作栏 -->
      <view class="action-bar">
        <Favorite 
          :relatedId="shop.shop_id" 
          relatedType="shop"
          class="action-btn collect"
          :key="'favorite-'+shop.shop_id" 
        />
        <view class="action-btn contact" @click="makePhoneCall" v-if="shop.contact_phone">
          <uni-icons type="phone" size="20" color="#666"></uni-icons>
          <text>电话咨询</text>
        </view>
        <view class="action-btn book" @click="handleBooking">
          <text>立即预约</text>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
import Favorite from './favorite.vue'
import { shopApi, imageApi } from '@/api'
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'

export default {
  components: { Favorite, uniIcons },
  data() {
    return {
      shop_id: null,
      loading: true,
      shop: {},
      images: [],
      shopId: null
    }
  },
  onLoad(options) {
    this.shopId = options.id;
    this.loadShopDetail();
  },
  methods: {
    async loadShopDetail() {
      this.loading = true;
      try {
        const shopRes = await shopApi.getById(this.shopId);
        this.shop = shopRes;
        const imageRes = await imageApi.getByRelatedId(this.shopId, 'shop');
        this.images = imageRes.data || [];
        if (this.images.length > 0) {
          const mainImage = this.images.find(img => img.is_main) || this.images[0];
          this.shop.mainImage = mainImage.image_url;
        }
      } catch (error) {
        uni.showToast({ title: '加载失败', icon: 'none' });
      } finally {
        this.loading = false;
      }
    },
    makePhoneCall() {
      if (this.shop.contact_phone) {
        uni.makePhoneCall({ phoneNumber: this.shop.contact_phone });
      }
    },
    handleBooking() {
      uni.showToast({
        title: '预约成功',
        icon: 'success',
        duration: 2000
      });
    },
    previewImage(index) {
      const urls = this.images.map(img => img.image_url);
      uni.previewImage({ current: index, urls });
    }
  }
}
</script>

<style>
.shop-detail-container {
  padding-bottom: 120rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.loading-container text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #666;
}

.shop-header {
  position: relative;
  height: 400rpx;
}

.shop-cover {
  width: 100%;
  height: 100%;
}

.shop-basic {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: #fff;
}

.shop-name {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  display: block;
}

.shop-tags {
  display: flex;
  flex-wrap: wrap;
}

.shop-tag {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20rpx;
  margin-right: 10rpx;
  margin-bottom: 10rpx;
}

.info-section {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 12rpx;
  padding: 25rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  padding-bottom: 15rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.section-title text {
  margin-left: 10rpx;
}

.info-item {
  display: flex;
  margin-bottom: 15rpx;
  font-size: 28rpx;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #666;
  width: 150rpx;
}

.info-content {
  flex: 1;
  color: #333;
}

.shop-desc {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
}

.image-scroll {
  white-space: nowrap;
  margin-top: 15rpx;
}

.shop-image {
  width: 300rpx;
  height: 200rpx;
  border-radius: 8rpx;
  margin-right: 15rpx;
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
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 24rpx;
  color: #666;
}


/* 调整收藏按钮样式 */
.action-btn.collect {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

/* 确保 Favorite 组件内部样式不被覆盖 */
.favorite-btn {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100%;
  height: 100%;
  padding: 0 !important; /* 移除可能的内边距 */
  margin: 0 !important; /* 移除可能的外边距 */
  border: none !important; /* 移除可能的边框 */
  background: transparent !important; /* 透明背景 */
}

.action-btn.contact {
  flex: 1;
  border-left: 1rpx solid #f0f0f0;
  border-right: 1rpx solid #f0f0f0;
}

.action-btn.book {
  flex: 2;
  background-color: #FF6B6B;
  color: #fff;
  font-size: 30rpx;
  font-weight: bold;
}
</style>