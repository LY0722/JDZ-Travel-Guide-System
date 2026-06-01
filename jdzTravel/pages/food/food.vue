<template>
  <view class="food-container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <input 
        class="search-input" 
        placeholder="搜索美食名称或地址" 
        @confirm="handleSearch" 
        v-model="searchKeyword" 
      />
      <uni-icons type="search" size="20" color="#00B4D8" @click="handleSearch"></uni-icons>
    </view>

    <!-- 筛选条件 -->
    <view class="filter-bar">
      <picker mode="selector" :range="sortOptions" range-key="label" @change="handleSortChange">
        <view class="filter-item">
          <text>{{sortOptions[sortIndex].label}}</text>
          <uni-icons type="arrowdown" size="14" color="#999"></uni-icons>
        </view>
      </picker>

      <picker mode="selector" :range="priceOptions" range-key="label" @change="handlePriceChange">
        <view class="filter-item">
          <text>{{priceOptions[priceIndex].label}}</text>
          <uni-icons type="arrowdown" size="14" color="#999"></uni-icons>
        </view>
      </picker>
    </view>

    <!-- 美食列表 -->
    <view class="food-list">
      <view 
        class="food-item" 
        v-for="(food, index) in filteredFoods" 
        :key="index" 
        @click="navigateToDetail(food.food_id)"
      >
        <image 
          :src="food.mainImage || '/static/food-default.jpg'" 
          mode="aspectFill" 
          class="food-image"
        ></image>
        <view class="food-info">
          <view class="food-header">
            <text class="food-name">{{food.food_name}}</text>
            <text class="food-distance">{{getDistance(food.longitude, food.latitude)}}km</text>
          </view>
          <text class="food-address">{{food.food_address}}</text>
          <text class="food-desc">{{food.food_description || '暂无美食描述'}}</text>
          <view class="food-footer">
            <view class="food-rating">
              <uni-icons type="star-filled" size="14" color="#ffb400"></uni-icons>
              <text>{{food.average_rating || 0}}</text>
            </view>
            <text class="food-price">{{food.price_range || '价格待定'}}</text>
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
  components: {
    uniIcons
  },
  data() {
    return {
      searchKeyword: '',
      sortIndex: 0,
      sortOptions: [
        { label: '智能排序', value: 'default', field: '', order: '' },
        { label: '评分最高', value: 'rating', field: 'average_rating', order: 'desc' },
        { label: '距离最近', value: 'distance', field: 'distance', order: 'asc' },
        { label: '价格最低', value: 'price', field: 'price_range', order: 'asc' }
      ],
      priceIndex: 0,
      priceOptions: [
        { label: '全部价格', value: 'all' },
        { label: '50元以下', value: '50' },
        { label: '50-100元', value: '50-100' },
        { label: '100元以上', value: '100' }
      ],
      foods: [],
      page: 1,
      pageSize: 10,
      hasMore: true,
      loading: false,
      currentLocation: null
    }
  },
  computed: {
    filteredFoods() {
      let result = [...this.foods];
      
      // 搜索过滤
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        result = result.filter(food =>
          food.food_name.toLowerCase().includes(keyword) ||
          food.food_address.toLowerCase().includes(keyword))
      }
      
      // 价格过滤
      if (this.priceIndex > 0) {
        const priceRange = this.priceOptions[this.priceIndex].value;
        result = result.filter(food => {
          const price = food.price_range || '';
          if (priceRange === '50') return price.includes('50以下') || price.includes('10-20') || price.includes('20-30');
          if (priceRange === '50-100') return price.includes('50-100') || price.includes('60-70') || price.includes('70-80');
          if (priceRange === '100') return price.includes('100以上');
          return true;
        });
      }
      
      // 前端排序（如果API未支持）
      const sortType = this.sortOptions[this.sortIndex].value;
      if (sortType === 'rating') {
        result.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
      } else if (sortType === 'distance' && this.currentLocation) {
        result.sort((a, b) => {
          const distA = this.getDistance(a.longitude, a.latitude);
          const distB = this.getDistance(b.longitude, b.latitude);
          return distA - distB;
        });
      } else if (sortType === 'price') {
        result.sort((a, b) => {
          const priceA = this.extractPrice(a.price_range);
          const priceB = this.extractPrice(b.price_range);
          return priceA - priceB;
        });
      }
      
      return result;
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
    extractPrice(priceRange) {
      if (!priceRange) return 0;
      const match = priceRange.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    },
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
    async loadFoods() {
      if (this.loading) return;
      this.loading = true;
      
      try {
        // 构建查询参数
        const params = {
          page: this.page,
          limit: this.pageSize
        };
        
        // 添加排序参数
        const sortOption = this.sortOptions[this.sortIndex];
        if (sortOption.field) {
          params.order = sortOption.field;
          params.sort = sortOption.order;
        }
        
        // 添加价格筛选
        if (this.priceIndex > 0) {
          params.price_range = this.priceOptions[this.priceIndex].value;
        }
        
        // 添加搜索关键词
        if (this.searchKeyword) {
          params.keyword = this.searchKeyword;
        }
        
        // 获取美食数据
        const res = await foodApi.getAll(params);
        
        // 加载图片
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
              console.error('加载图片失败:', error);
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
        console.error('加载美食失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      this.page = 1;
      this.loadFoods();
    },
    handleSortChange(e) {
      this.sortIndex = e.detail.value;
      this.page = 1;
      this.loadFoods();
    },
    handlePriceChange(e) {
      this.priceIndex = e.detail.value;
      this.page = 1;
      this.loadFoods();
    },
    navigateToDetail(id) {
      uni.navigateTo({
        url: `/pages/food/detail?id=${id}`
      });
    }
  }
}
</script>

<style>
.food-container {
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

.filter-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
  background-color: #fff;
  padding: 20rpx;
  border-radius: 12rpx;
}

.filter-item {
  display: flex;
  align-items: center;
  font-size: 26rpx;
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

.food-distance {
  font-size: 24rpx;
  color: #999;
}

.food-address {
  font-size: 24rpx;
  color: #999;
  margin: 8rpx 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.food-rating {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #ffb400;
}

.food-price {
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