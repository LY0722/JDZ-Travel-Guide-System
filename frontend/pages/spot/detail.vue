<template>
  <view class="spot-detail-container">
    <!-- 图片轮播 -->
    <swiper class="swiper" indicator-dots autoplay circular interval="3000">
      <swiper-item v-for="(image, index) in spot.images" :key="index">
        <image :src="image.image_url" mode="aspectFill" class="swiper-image"></image>
      </swiper-item>
    </swiper>

    <!-- 基本信息 -->
    <view class="basic-info">
      <view class="title-section">
        <text class="spot-name">{{spot.spot_name}}</text>
        <view class="rating-section">
          <text class="rating-text">{{spot.average_rating || 0}}</text>
          <uni-icons type="star-filled" size="16" color="#ffb400"></uni-icons>
        </view>
      </view>
      <view class="info-row">
        <uni-icons type="location-filled" size="16" color="#00B4D8"></uni-icons>
        <text class="info-text">{{spot.spot_address}}</text>
      </view>
      <view class="info-row">
        <uni-icons type="time-filled" size="16" color="#00B4D8"></uni-icons>
        <text class="info-text">开放时间: {{spot.opening_hours || '暂无信息'}}</text>
      </view>
      <view class="info-row">
        <uni-icons type="money" size="16" color="#00B4D8"></uni-icons>
        <text class="info-text">门票价格: {{spot.ticket_price ? `¥${spot.ticket_price}` : '免费'}}</text>
      </view>
      <view class="info-row" v-if="spot.phone">
        <uni-icons type="phone-filled" size="16" color="#00B4D8"></uni-icons>
        <text class="info-text">联系电话: {{spot.phone}}</text>
      </view>
    </view>

    <!-- 地图位置 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">位置地图</text>
        <text class="section-more" @click="openMap">去这里 ></text>
      </view>
      <view class="map-container">
        <map :latitude="spot.latitude" :longitude="spot.longitude" :markers="markers" scale="15"
          class="map"></map>
      </view>
    </view>

    <!-- 景点介绍 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">景点介绍</text>
      </view>
      <view class="content">
        <text class="desc-text">{{spot.spot_description || '暂无景点描述'}}</text>
      </view>
    </view>

    <!-- 特色亮点 -->
    <view class="section" v-if="spot.features && spot.features.length > 0">
      <view class="section-header">
        <text class="section-title">特色亮点</text>
      </view>
      <view class="features">
        <view class="feature-item" v-for="(feature, index) in spot.features" :key="index">
          <uni-icons type="checkmarkempty" size="16" color="#4ECDC4"></uni-icons>
          <text class="feature-text">{{feature}}</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
<view class="action-bar">
  <view class="action-btn" @click="handleFavorite">
    <uni-icons :type="isFavorite ? 'heart-filled' : 'heart'" size="26" :color="isFavorite ? '#ff6b6b' : '#00B4D8'"></uni-icons>
    <text class="action-label">{{isFavorite ? '已收藏' : '收藏'}}</text>
  </view>
  <view class="action-btn main-btn" @click="navigateToPay">
    <uni-icons type="wallet" size="26" color="#fff"></uni-icons>
    <text class="action-label main-label">立即购票</text>
  </view>
  <view class="action-btn" @click="shareSpot">
    <uni-icons type="redo" size="26" color="#00B4D8"></uni-icons>
    <text class="action-label">分享</text>
  </view>
</view>
  </view>
</template>

<script>
import Favorite from './favorite.vue'
import { scenicSpotApi, imageApi , favoritesApi} from '@/api'
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'

export default {
  components: { Favorite, uniIcons },
  data() {
    return {
      id: null,
      spot: {
        spot_id: null,
        spot_name: '',
        spot_description: '',
        spot_address: '',
        opening_hours: '',
        ticket_price: null,
        phone: '',
        longitude: null,
        latitude: null,
        average_rating: 0,
        images: [],
        features: []
      },
      markers: [],
      isFavorite: false,
      favoriteId: null
    }
  },
  onLoad(options) {
    this.id = options.id;
    this.loadSpotDetail();
  },
  methods: {
    async loadSpotDetail() {
      try {
        uni.showLoading({ title: '加载中...' });
        
        // 获取景点详情
        const spotRes = await scenicSpotApi.getById(this.id);
        // console.log('景点详情:', spotRes);
        this.spot = { 
          ...this.spot, 
          ...spotRes,
          // 确保数值类型正确
          ticket_price: parseFloat(spotRes.ticket_price) || 0,
          average_rating: parseFloat(spotRes.average_rating) || 0,
          longitude: parseFloat(spotRes.longitude),
          latitude: parseFloat(spotRes.latitude)
        };
        
        // 获取景点图片
        const imagesRes = await imageApi.getByRelatedId(this.id, 'spot');
        // console.log('景点图片:', imagesRes);
        this.spot.images = imagesRes.data || [];
        
        // 设置地图标记
        this.markers = [{
          id: 0,
          latitude: this.spot.latitude,
          longitude: this.spot.longitude,
          title: this.spot.spot_name,
          iconPath: '/static/marker.png'
        }];
        
        // 检查是否已收藏
        await this.checkFavorite();
        
      } catch (error) {
        console.error('加载景点详情失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
      }
    await this.checkFavorite();
    },
    
    async checkFavorite() {
      const userId = uni.getStorageSync('user_id');
      if (!userId) {
        this.isFavorite = false;
        this.favoriteId = null;
        return;
      }
      try {
        const res = await favoritesApi.checkFavorite(userId, this.id, 'spot');
        const list = res.data?.data || res.data || [];
        if (Array.isArray(list) && list.length > 0) {
          this.isFavorite = true;
          this.favoriteId = list[0].favorite_id;
        } else {
          this.isFavorite = false;
          this.favoriteId = null;
        }
      } catch (e) {
        this.isFavorite = false;
        this.favoriteId = null;
      }
    },
        async handleFavorite() {
      const userId = uni.getStorageSync('user_id');
      if (!userId) {
        uni.showToast({ title: '请先登录', icon: 'none' });
        return;
      }
      if (this.isFavorite) {
        if (!this.favoriteId) {
          uni.showToast({ title: '收藏ID无效', icon: 'none' });
          return;
        }
        try {
          await favoritesApi.delete(this.favoriteId);
          this.isFavorite = false;
          this.favoriteId = null;
          uni.showToast({ title: '已取消收藏', icon: 'none' });
        } catch (e) {
          uni.showToast({ title: '取消失败', icon: 'none' });
        }
      } else {
        try {
          const res = await favoritesApi.create({
            user_id: userId,
            related_id: this.id,
            related_type: 'spot'
          });
          this.isFavorite = true;
          this.favoriteId = res.favorite_id || (res.data && res.data.favorite_id);
          uni.showToast({ title: '已收藏', icon: 'success' });
        } catch (e) {
          uni.showToast({ title: '收藏失败', icon: 'none' });
        }
      }
    },
    async toggleFavorite() {
      try {
        const userId = uni.getStorageSync('userId');
        if (!userId) {
          uni.showToast({
            title: '请先登录',
            icon: 'none'
          });
          return;
        }
        
        if (this.isFavorite) {
          // 查找收藏记录ID并删除
          const favRes = await favoritesApi.getByUser(userId);
          const favorite = favRes.data.find(item => 
            item.related_id == this.id && item.related_type === 'spot'
          );
          if (favorite) {
            await favoritesApi.delete(favorite.favorite_id);
          }
        } else {
          await favoritesApi.create({
            user_id: userId,
            related_id: this.id,
            related_type: 'spot'
          });
        }
        
        this.isFavorite = !this.isFavorite;
        uni.showToast({
          title: this.isFavorite ? '已收藏' : '已取消收藏',
          icon: 'none'
        });
      } catch (error) {
        console.error('收藏操作失败:', error);
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        });
      }
    },
    
    shareSpot() {
      uni.showActionSheet({
        itemList: ['分享给好友', '分享到朋友圈', '复制链接'],
        success: (res) => {
          // console.log('分享方式:', res.tapIndex);
          uni.showToast({
            title: '分享成功',
            icon: 'success'
          });
        }
      });
    },
    
    openMap() {
      uni.openLocation({
        latitude: this.spot.latitude,
        longitude: this.spot.longitude,
        name: this.spot.spot_name,
        address: this.spot.spot_address,
        success: () => {
          console.log('打开地图成功');
        }
      });
    },
    
    navigateToPay() {
      uni.navigateTo({
        url: `/pages/spot/pay?id=${this.spot.spot_id}&name=${this.spot.spot_name}&price=${this.spot.ticket_price || 0}`
      });
    }
  }
}
</script>

<style>
.spot-detail-container {
  padding-bottom: 120rpx;
  background-color: #f5f5f5;
}

.swiper {
  width: 100%;
  height: 500rpx;
}

.swiper-image {
  width: 100%;
  height: 100%;
}

.basic-info {
  background-color: #fff;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.title-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.spot-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  flex: 1;
}

.rating-section {
  display: flex;
  align-items: center;
  margin-left: 20rpx;
}

.rating-text {
  font-size: 36rpx;
  color: #ffb400;
  margin-right: 5rpx;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.info-text {
  font-size: 28rpx;
  color: #666;
  flex: 1;
  margin-left: 10rpx;
}

.section {
  background-color: #fff;
  margin-bottom: 20rpx;
  padding: 30rpx;
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
  font-size: 26rpx;
  color: #00B4D8;
}

.map-container {
  height: 300rpx;
  border-radius: 12rpx;
  overflow: hidden;
}

.map {
  width: 100%;
  height: 100%;
}

.content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.desc-text {
  display: block;
  margin-bottom: 15rpx;
}

.features {
  padding: 10rpx 0;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.feature-text {
  font-size: 28rpx;
  color: #666;
  flex: 1;
  margin-left: 10rpx;
}

/* 美化后的底部操作栏样式 */
.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 110rpx;
  background: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -4rpx 12rpx rgba(0,0,0,0.08);
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10rpx 0;
  font-size: 28rpx;
  color: #00B4D8;
  background: transparent;
  border: none;
  transition: background 0.2s;
}

.action-btn:active {
  background: #f2f8fa;
}

.main-btn {
  background: linear-gradient(90deg, #00B4D8 60%, #48CAE4 100%);
  color: #fff;
  border-radius: 50rpx;
  margin: 0 16rpx;
  flex: 1.2;
  height: 80rpx;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0,180,216,0.10);
  display: flex;
}

.main-label {
  color: #fff;
  font-weight: bold;
  font-size: 30rpx;
  margin-left: 10rpx;
}

.action-label {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: inherit;
}

/* 旧的底部栏和收藏样式可保留备用 */
.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 40rpx;
}

.action-text {
  font-size: 24rpx;
  color: #666;
}

.buy-btn {
  flex: 1;
  background-color: #ff6b6b;
  border-radius: 50rpx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.btn-text {
  font-size: 32rpx;
  font-weight: bold;
  margin-right: 10rpx;
}

.btn-price {
  font-size: 28rpx;
}

.favorite-action {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  cursor: pointer;
  transition: background 0.3s;
  background: #fff;
}
.favorite-action.favorite-active {
  background: #ffeded;
}
.favorite-big-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #00B4D8;
}
.favorite-action.favorite-active .favorite-big-text {
  color: #ff6b6b;
}
</style>