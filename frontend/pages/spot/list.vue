<template>
  <view class="spot-list-container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <input class="search-input" placeholder="搜索景点名称或地址" @confirm="handleSearch" v-model="searchKeyword" />
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
      <!-- <picker mode="selector" :range="regionOptions" range-key="label" @change="handleRegionChange">
        <view class="filter-item">
          <text>{{regionOptions[regionIndex].label}}</text>
          <uni-icons type="arrowdown" size="14" color="#999"></uni-icons>
        </view>
      </picker> -->
      <picker mode="selector" :range="priceOptions" range-key="label" @change="handlePriceChange">
        <view class="filter-item">
          <text>{{priceOptions[priceIndex].label}}</text>
          <uni-icons type="arrowdown" size="14" color="#999"></uni-icons>
        </view>
      </picker>
    </view>

    <!-- 景点列表 -->
    <view class="spot-list">
      <view class="spot-item" v-for="(spot, index) in filteredSpots" :key="index" @click="navigateToDetail(spot.spot_id)">
        <image :src="spot.mainImage || '/static/spot-default.jpg'" mode="aspectFill" class="spot-image"></image>
        <view class="spot-info">
          <view class="spot-header">
            <text class="spot-name">{{spot.spot_name}}</text>
            <view class="spot-rating">
              <uni-icons type="star-filled" size="14" color="#ffb400"></uni-icons>
              <text>{{spot.average_rating || 0}}</text>
            </view>
          </view>
          <text class="spot-address">{{spot.spot_address}}</text>
          <text class="spot-desc">{{spot.spot_description || '暂无景点描述'}}</text>
          <view class="spot-footer">
            <text class="spot-price">门票: {{spot.ticket_price ? `¥${spot.ticket_price}` : '免费'}}</text>
            <text class="spot-distance">{{getDistance(spot.longitude, spot.latitude)}}km</text>
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
import { scenicSpotApi, imageApi } from '@/api';
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
        { label: '价格最低', value: 'price', field: 'ticket_price', order: 'asc' }
      ],
      regionIndex: 0,
      regionOptions: [
        { label: '全部区域', value: 'all' },
        { label: '昌江区', value: 'changjiang' },
        { label: '珠山区', value: 'zhushan' },
        { label: '浮梁县', value: 'fuliang' }
      ],
      priceIndex: 0,
      priceOptions: [
        { label: '全部价格', value: 'all' },
        { label: '免费', value: 'free' },
        { label: '50元以下', value: '50' },
        { label: '50-100元', value: '50-100' },
        { label: '100元以上', value: '100' }
      ],
      spots: [],
      page: 1,
      pageSize: 10,
      hasMore: true,
      loading: false,
      currentLocation: null
    }
  },
  computed: {
    filteredSpots() {
      let result = [...this.spots];
      
      // 搜索过滤
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        result = result.filter(spot => 
          spot.spot_name.toLowerCase().includes(keyword) || 
          spot.spot_address.toLowerCase().includes(keyword)
        );
      }
      
      // 区域过滤
      if (this.regionIndex > 0) {
        const region = this.regionOptions[this.regionIndex].value;
        result = result.filter(spot => spot.spot_address.includes(region));
      }
      
      // 价格过滤
      if (this.priceIndex > 0) {
        const priceRange = this.priceOptions[this.priceIndex].value;
        result = result.filter(spot => {
          const price = spot.ticket_price || 0;
          if (priceRange === 'free') return price === 0;
          if (priceRange === '50') return price > 0 && price < 50;
          if (priceRange === '50-100') return price >= 50 && price <= 100;
          if (priceRange === '100') return price > 100;
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
        result.sort((a, b) => (a.ticket_price || 0) - (b.ticket_price || 0));
      }
      
      return result;
    }
  },
  async onLoad() {
    await this.getCurrentLocation();
    this.loadSpots();
  },
  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.page++;
      this.loadSpots();
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
    
    async loadSpots() {
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
        
        // 添加区域筛选
        if (this.regionIndex > 0) {
          params.region = this.regionOptions[this.regionIndex].value;
        }
        
        // 添加价格筛选
        if (this.priceIndex > 0) {
          params.price_range = this.priceOptions[this.priceIndex].value;
        }
        
        // 添加搜索关键词
        if (this.searchKeyword) {
          params.keyword = this.searchKeyword;
        }
        
        // 获取景点数据
        const res = await scenicSpotApi.getAll(params);
        
        // 加载图片
        const spotsWithImages = await Promise.all(
          res.data.map(async spot => {
            try {
              const imageRes = await imageApi.getByRelatedId(spot.spot_id, 'spot');
              if (imageRes.data && imageRes.data.length > 0) {
                const mainImage = imageRes.data.find(img => img.is_main) || imageRes.data[0];
                return { ...spot, mainImage: mainImage.image_url };
              }
              return spot;
            } catch (error) {
              console.error('加载图片失败:', error);
              return spot;
            }
          })
        );
        
        if (this.page === 1) {
          this.spots = spotsWithImages;
        } else {
          this.spots = [...this.spots, ...spotsWithImages];
        }
        
        this.hasMore = res.data.length >= this.pageSize;
      } catch (error) {
        console.error('加载景点失败:', error);
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
      this.loadSpots();
    },
    
    handleSortChange(e) {
      this.sortIndex = e.detail.value;
      this.page = 1;
      this.loadSpots();
    },
    
    handleRegionChange(e) {
      this.regionIndex = e.detail.value;
      this.page = 1;
      this.loadSpots();
    },
    
    handlePriceChange(e) {
      this.priceIndex = e.detail.value;
      this.page = 1;
      this.loadSpots();
    },
    
    navigateToDetail(id) {
      uni.navigateTo({
        url: `/pages/spot/detail?id=${id}`
      });
    }
  }
}
</script>

<style>
  .spot-list-container {
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

  .spot-list {
    margin-bottom: 20rpx;
  }

  .spot-item {
    display: flex;
    background-color: #fff;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  }

  .spot-image {
    width: 220rpx;
    height: 220rpx;
  }

  .spot-info {
    flex: 1;
    padding: 20rpx;
    display: flex;
    flex-direction: column;
  }

  .spot-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10rpx;
  }

  .spot-name {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .spot-rating {
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #ffb400;
    margin-left: 15rpx;
  }

  .spot-address {
    font-size: 24rpx;
    color: #999;
    margin-bottom: 10rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .spot-desc {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 10rpx;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .spot-footer {
    display: flex;
    justify-content: space-between;
    margin-top: auto;
  }

  .spot-price {
    font-size: 26rpx;
    color: #ff6b6b;
  }

  .spot-distance {
    font-size: 24rpx;
    color: #999;
  }

  .load-more, .no-more {
    text-align: center;
    padding: 20rpx;
    font-size: 26rpx;
    color: #999;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>