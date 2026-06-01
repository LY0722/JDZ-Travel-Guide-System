<template>
  <view class="food-detail-container" v-if="food">
    <!-- 顶部轮播图 -->
    <view class="swiper-container" v-if="images.length > 0">
      <swiper
        class="food-swiper"
        :indicator-dots="true"
        :autoplay="true"
        :interval="3500"
        :duration="500"
        circular
      >
        <swiper-item v-for="(img, idx) in images" :key="idx">
          <image
            :src="img.image_url"
            mode="aspectFill"
            class="food-main-image"
            @click="previewImage(idx)"
          ></image>
        </swiper-item>
      </swiper>
    </view>
    <image
      v-else
      :src="food.mainImage || '/static/food-default.jpg'"
      mode="aspectFill"
      class="food-main-image"
    ></image>
    <!-- 信息卡片 -->
    <view class="food-info-card">
      <view class="food-header">
        <text class="food-name">{{food.food_name}}</text>
        <view class="food-rating">
          <uni-icons v-for="i in 5" :key="i" type="star-filled" size="18"
            :color="i <= Math.round(food.average_rating) ? '#ffb400' : '#eee'"></uni-icons>
          <text class="rating-num">{{food.average_rating || 0}}</text>
        </view>
      </view>
      <view class="info-row">
        <uni-icons type="location-filled" size="16" color="#00B4D8"></uni-icons>
        <text class="info-text">{{food.food_address}}</text>
      </view>
      <view class="info-row">
        <uni-icons type="time-filled" size="16" color="#00B4D8"></uni-icons>
        <text class="info-text">营业时间：{{food.business_hours || '暂无'}}</text>
      </view>
      <view class="info-row">
        <uni-icons type="money" size="16" color="#FF6B6B"></uni-icons>
        <text class="info-text price-text">{{food.price_range || '价格待定'}}</text>
      </view>
    </view>
    <!-- 美食描述 -->
    <view class="section">
      <view class="section-title">美食介绍</view>
      <view class="desc-text">{{food.food_description || '暂无美食介绍'}}</view>
    </view>
<view class="action-bar"
  :class="{ 'favorite-active': isFavorite }"
  @click="handleFavorite"
>
  <text class="favorite-big-text">{{ isFavorite ? '已收藏' : '收藏' }}</text>
</view>
  </view>

  
</template>

<script>
import Favorite from './favorite.vue'
import { foodApi, imageApi, favoritesApi } from '@/api'
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'

export default {
  components: { Favorite, uniIcons },
  data() {
    return {
      food_id: null,
      food: null,
      images: [],
      isFavorite: false,   // 必须声明
      favoriteId: null     // 必须声明
    }
  },
  async onLoad(options) {
    const id = options.id;
    if (!id) {
      uni.showToast({ title: '参数错误', icon: 'none' });
      return;
    }
    try {
      const res = await foodApi.getById(id);
      if (!res) {
        uni.showToast({ title: '未找到美食', icon: 'none' });
        return;
      }
      let food = res;
      try {
        const imageRes = await imageApi.getByRelatedId(id, 'food');
        if (imageRes.data && imageRes.data.length > 0) {
          const mainImage = imageRes.data.find(img => img.is_main) || imageRes.data[0];
          food.mainImage = mainImage.image_url;
          this.images = imageRes.data;
        }
      } catch (e) {
        // 图片加载失败不影响主数据
      }
      this.food = food;
    } catch (error) {
      console.error('加载美食详情失败:', error);
      uni.showToast({ title: '加载失败', icon: 'none' });
    }
    await this.checkFavorite();
  },
  methods: {
        async checkFavorite() {
      const userId = uni.getStorageSync('user_id');
      if (!userId || !this.food) {
        this.isFavorite = false;
        this.favoriteId = null;
        return;
      }
      try {
        const res = await favoritesApi.checkFavorite(userId, this.food.food_id, 'food');
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
            related_id: this.food.food_id,
            related_type: 'food'
          });
          this.isFavorite = true;
          this.favoriteId = res.favorite_id || (res.data && res.data.favorite_id);
          uni.showToast({ title: '已收藏', icon: 'success' });
        } catch (e) {
          uni.showToast({ title: '收藏失败', icon: 'none' });
        }
      }
    },
    previewImage(index) {
      const urls = this.images.map(img => img.image_url);
      uni.previewImage({
        current: index,
        urls: urls
      });
    }
  }
}
</script>

<style>
.food-detail-container {
  background-color: #f5f5f5;
  min-height: 100vh;
}
.swiper-container {
  width: 100%;
  height: 340rpx;
  position: relative;
}
.food-swiper {
  width: 100%;
  height: 340rpx;
}
.food-main-image {
  width: 100%;
  height: 340rpx;
  object-fit: cover;
  border-bottom-left-radius: 30rpx;
  border-bottom-right-radius: 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.08);
}
.food-info-card {
  background: #fff;
  margin: -40rpx 30rpx 20rpx 30rpx;
  border-radius: 18rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,180,216,0.08);
  padding: 36rpx 28rpx 28rpx 28rpx;
  position: relative;
  z-index: 2;
}
.food-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18rpx;
}
.food-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #222;
  flex: 1;
  margin-right: 20rpx;
}
.food-rating {
  display: flex;
  align-items: center;
}
.rating-num {
  font-size: 26rpx;
  color: #ffb400;
  margin-left: 8rpx;
  font-weight: bold;
}
.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 14rpx;
}
.info-text {
  font-size: 26rpx;
  color: #666;
  margin-left: 10rpx;
}
.price-text {
  color: #FF6B6B;
  font-weight: bold;
}
.section {
  background: #fff;
  margin: 0 30rpx 30rpx 30rpx;
  border-radius: 18rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,180,216,0.06);
  padding: 28rpx;
}
.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #00B4D8;
  margin-bottom: 16rpx;
}
.desc-text {
  font-size: 28rpx;
  color: #444;
  line-height: 1.8;
  word-break: break-all;
}
.loading-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400rpx;
  color: #999;
  font-size: 28rpx;
}
.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 120rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 -4rpx 12rpx rgba(0,0,0,0.08);
  z-index: 100;
  cursor: pointer;
  transition: background 0.3s;
}
.action-bar.favorite-active {
  background: #ffeded; /* 收藏后变色，可自定义 */
}
.favorite-big-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #00B4D8; /* 默认蓝色 */
}
.action-bar.favorite-active .favorite-big-text {
  color: #ff6b6b; /* 收藏后变红色 */
}
</style>