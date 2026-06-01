<template>
  <view class="food-list-container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <input class="search-input" placeholder="搜索美食名称或地址" v-model="searchKeyword" @confirm="handleSearch" />
      <uni-icons type="search" size="20" color="#00B4D8" @click="handleSearch"></uni-icons>
    </view>

    <!-- 美食列表 -->
    <view class="food-list">
      <view class="food-item" v-for="(food, index) in foods" :key="index" @click="navigateToDetail(food.food_id)">
        <image :src="food.mainImage || '/static/food-default.jpg'" mode="aspectFill" class="food-image"></image>
        <view class="food-info">
          <view class="food-header">
            <text class="food-name">{{food.food_name}}</text>
            <view class="food-rating">
              <uni-icons type="star-filled" size="14" color="#ffb400"></uni-icons>
              <text>{{food.average_rating || 0}}</text>
            </view>
          </view>
          <text class="food-address">{{food.food_address}}</text>
          <text class="food-desc">{{food.food_description || '暂无美食描述'}}</text>
          <view class="food-footer">
            <text class="food-price">{{food.price_range || '价格待定'}}</text>
            <text class="food-distance">{{getDistance(food.longitude, food.latitude)}}km</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载更多 -->
    <view class="load-more" v-if="loading">
      <uni-icons type="spinner-cycle" size="16" color="#999"></uni-icons>
      <text>加载中...</text>
    </view>
    <view class="no-more" v-else-if="!hasMore">
      <text>没有更多了</text>
    </view>
  </view>
</template>

<script>
import { foodApi, imageApi } from '@/api';
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'

export default {
  components: { uniIcons },
  data() {
    return {
      foods: [],
      page: 1,
      pageSize: 10,
      hasMore: true,
      loading: false,
      searchKeyword: '',
      currentLocation: null
    }
  },
  async onLoad() {
    await this.getCurrentLocation();
    this.loadFoods();
  },
  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.page++;
      this.loadFoods();
    }
  },
  methods: {
    async getCurrentLocation() {
      try {
        const res = await uni.getLocation({ type: 'gcj02' });
        this.currentLocation = { longitude: res.longitude, latitude: res.latitude };
      } catch (error) {
        console.error('获取位置失败:', error);
      }
    },
    getDistance(longitude, latitude) {
      if (!this.currentLocation || !longitude || !latitude) return '--';
      const R = 6371;
      const dLat = (latitude - this.currentLocation.latitude) * Math.PI / 180;
      const dLon = (longitude - this.currentLocation.longitude) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.currentLocation.latitude * Math.PI / 180) *
        Math.cos(latitude * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      return distance.toFixed(1);
    },
    async loadFoods() {
      if (this.loading) return;
      this.loading = true;
      try {
        const params = {
          page: this.page,
          limit: this.pageSize
        };
        if (this.searchKeyword) params.keyword = this.searchKeyword;
        const res = await foodApi.getAll(params);
        const foodsWithImages = await Promise.all(
          res.data.map(async food => {
            try {
              const imageRes = await imageApi.getByRelatedId(food.food_id, 'food');
              if (imageRes.data && imageRes.data.length > 0) {
                const mainImage = imageRes.data.find(img => img.is_main) || imageRes.data[0];
                return { ...food, mainImage: mainImage.image_url };
              }
              return food;
            } catch (error) {
              return food;
            }
          })
        );
        if (this.page === 1) {
          this.foods = foodsWithImages;
        } else {
          this.foods = [...this.foods, ...foodsWithImages];
        }
        this.hasMore = res.data.length >= this.pageSize;
      } catch (error) {
        uni.showToast({ title: '加载失败', icon: 'none' });
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      this.page = 1;
      this.loadFoods();
    },
    navigateToDetail(id) {
      // console.log('跳转美食详情，id:', id);
      uni.navigateTo({ url: `/pages/food/detail?id=${id}` });
    }
  }
}
</script>

<style>
.food-list-container {
  padding: 20rpx;
  background-color: #f5f5f5;
}
.search-bar {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 50rpx;
  padding: 15rpx 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}
.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #666;
}
.food-list {
  margin-bottom: 20rpx;
}
.food-item {
  display: flex;
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}
.food-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}
.food-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.food-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.food-name {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
}
.food-rating {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #ffb400;
}
.food-address {
  font-size: 24rpx;
  color: #999;
}
.food-desc {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 10rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.food-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.food-price {
  font-size: 28rpx;
  color: #ff6b6b;
  font-weight: bold;
}
.food-distance {
  font-size: 24rpx;
  color: #999;
}
.load-more, .no-more {
  text-align: center;
  padding: 20rpx 0;
  font-size: 26rpx;
  color: #999;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>