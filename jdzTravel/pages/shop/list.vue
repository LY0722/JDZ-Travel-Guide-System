<template>
  <view class="shop-list-container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <input class="search-input" placeholder="搜索非遗体验店" @confirm="handleSearch" v-model="searchKeyword" />
      <uni-icons type="search" size="20" color="#00B4D8" @click="handleSearch"></uni-icons>
    </view>

    <!-- 筛选条件 -->
    <!-- <view class="filter-container">
      <view class="filter-item" :class="{active: filterType === 'all'}" @click="changeFilterType('all')">
        <text>全部</text>
      </view>
      <view class="filter-item" :class="{active: filterType === 'pulling'}" @click="changeFilterType('pulling')">
        <text>拉坯体验</text>
      </view>
      <view class="filter-item" :class="{active: filterType === 'painting'}" @click="changeFilterType('painting')">
        <text>绘画体验</text>
      </view>
      <view class="filter-item" :class="{active: filterType === 'firing'}" @click="changeFilterType('firing')">
        <text>烧制体验</text>
      </view>
    </view> -->

    <!-- 店铺列表 -->
    <view class="shop-list">
      <view class="shop-item" v-for="(shop, index) in filteredShops" :key="index" @click="navigateToShopDetail(shop.shop_id)">
        <image :src="shop.mainImage || '/static/shop-default.jpg'" mode="aspectFill" class="shop-image"></image>
        <view class="shop-info">
          <view class="shop-header">
            <text class="shop-name">{{shop.shop_name}}</text>
            <text class="shop-distance">{{getDistance(shop.longitude, shop.latitude)}}km</text>
          </view>
          <text class="shop-type">{{shop.experience_type || '非遗体验'}}</text>
          <view class="shop-footer">
            <view class="shop-rating">
              <uni-icons type="star-filled" size="14" color="#ffb400"></uni-icons>
              <text>{{shop.average_rating || 0}}</text>
            </view>
            <text class="shop-price">{{shop.price_range || '价格待定'}}</text>
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
import { shopApi, imageApi } from '@/api';
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'

export default {
  components: {
    uniIcons
  },
  data() {
    return {
      searchKeyword: '',
      filterType: 'all',
      loading: false,
      hasMore: true,
      page: 1,
      pageSize: 10,
      shops: [],
      currentLocation: null
    }
  },
  computed: {
    filteredShops() {
      let result = [...this.shops];
      
      // 按类型筛选
      if (this.filterType !== 'all') {
        result = result.filter(shop => {
          const type = shop.experience_type || '';
          return type.toLowerCase().includes(this.filterType);
        });
      }
      
      // 按关键词搜索
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        result = result.filter(shop => 
          shop.shop_name.toLowerCase().includes(keyword) || 
          (shop.shop_description && shop.shop_description.toLowerCase().includes(keyword)) ||
          (shop.shop_address && shop.shop_address.toLowerCase().includes(keyword))
        );
      }
      
      return result;
    }
  },
  async onLoad() {
    await this.getCurrentLocation();
    this.loadShops();
  },
  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.page++;
      this.loadShops();
    }
  },
  methods: {
    async getCurrentLocation() {
      try {
        const res = await uni.getLocation({
          type: 'gcj02'
        });
        this.currentLocation = {
          longitude: res.longitude,
          latitude: res.latitude
        };
      } catch (error) {
        console.error('获取位置失败:', error);
      }
    },
    
    getDistance(longitude, latitude) {
      if (!this.currentLocation || !longitude || !latitude) return '--';
      
      // 简化版距离计算（实际项目应使用更精确算法）
      const R = 6371; // 地球半径(km)
      const dLat = (latitude - this.currentLocation.latitude) * Math.PI / 180;
      const dLon = (longitude - this.currentLocation.longitude) * Math.PI / 180;
      const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.currentLocation.latitude * Math.PI / 180) *
        Math.cos(latitude * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      return distance.toFixed(1);
    },
    
    async loadShops() {
      if (this.loading) return;
      this.loading = true;
      
      try {
        // 构建查询参数
        const params = {
          page: this.page,
          limit: this.pageSize
        };
        
        // 添加体验类型筛选
        if (this.filterType !== 'all') {
          params.experience_type = this.filterType;
        }
        
        // 添加搜索关键词
        if (this.searchKeyword) {
          params.keyword = this.searchKeyword;
        }
        
        // 获取店铺数据
        const res = await shopApi.getAll(params);
        
        // 加载图片
        const shopsWithImages = await Promise.all(
          res.data.map(async shop => {
            try {
              const imageRes = await imageApi.getByRelatedId(shop.shop_id, 'shop');
              if (imageRes.data && imageRes.data.length > 0) {
                const mainImage = imageRes.data.find(img => img.is_main) || imageRes.data[0];
                return { ...shop, mainImage: mainImage.image_url };
              }
              return shop;
            } catch (error) {
              console.error('加载图片失败:', error);
              return shop;
            }
          })
        );
        
        if (this.page === 1) {
          this.shops = shopsWithImages;
        } else {
          this.shops = [...this.shops, ...shopsWithImages];
        }
        
        this.hasMore = res.data.length >= this.pageSize;
      } catch (error) {
        console.error('加载店铺失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    changeFilterType(type) {
      this.filterType = type;
      this.page = 1;
      this.loadShops();
    },
    
    handleSearch() {
      this.page = 1;
      this.loadShops();
    },
    
    navigateToShopDetail(id) {
      uni.navigateTo({
        url: `/pages/shop/detail?id=${id}`
      });
    }
  }
}
</script>

<style>
.shop-list-container {
  padding: 20rpx 30rpx;
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

.filter-container {
  display: flex;
  margin: 20rpx 0;
  background-color: #fff;
  border-radius: 50rpx;
  padding: 15rpx 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.filter-item {
  flex: 1;
  text-align: center;
  font-size: 26rpx;
  color: #666;
  padding: 10rpx 0;
}

.filter-item.active {
  color: #FF6B6B;
  font-weight: bold;
}

.shop-list {
  margin-bottom: 30rpx;
}

.shop-item {
  display: flex;
  background-color: #fff;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.shop-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}

.shop-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.shop-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.shop-distance {
  font-size: 24rpx;
  color: #999;
}

.shop-type {
  font-size: 26rpx;
  color: #00B4D8;
  background-color: rgba(0, 180, 216, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  align-self: flex-start;
  margin: 10rpx 0;
}

.shop-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.shop-rating {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #ffb400;
}

.shop-price {
  font-size: 28rpx;
  color: #ff6b6b;
  font-weight: bold;
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

.load-more uni-icons {
  margin-right: 10rpx;
}
</style>