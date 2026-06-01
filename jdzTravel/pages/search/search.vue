<template>
  <view class="search-container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input-container">
        <uni-icons type="search" size="20" color="#999"></uni-icons>
        <input 
          class="search-input" 
          placeholder="搜索景点、店铺或美食" 
          v-model="keyword"
          confirm-type="search"
          @confirm="doSearch"
          :focus="!!initialFocus"
        />
        <uni-icons type="clear" size="20" color="#999" @click="clearSearch" v-if="keyword"></uni-icons>
      </view>
      <text class="cancel-btn" @click="goBack">取消</text>
    </view>

    <!-- 热门搜索 -->
    <view class="hot-search" v-if="!searchResults && !historyKeywords.length">
      <view class="section-title">热门搜索</view>
      <view class="hot-tags">
        <text 
          class="hot-tag" 
          v-for="(tag, index) in hotKeywords" 
          :key="index"
          @click="searchByTag(tag)"
        >{{tag}}</text>
      </view>
    </view>

    <!-- 历史搜索 -->
    <view class="history-search" v-if="!searchResults && historyKeywords.length">
      <view class="section-header">
        <view class="section-title">历史搜索</view>
        <text class="clear-btn" @click="clearHistory">清空</text>
      </view>
      <view class="history-tags">
        <view 
          class="history-tag" 
          v-for="(item, index) in historyKeywords" 
          :key="index"
          @click="searchByTag(item)"
        >
          <text>{{item}}</text>
          <uni-icons type="closeempty" size="16" color="#999" @click.stop="removeHistoryItem(index)"></uni-icons>
        </view>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="search-results" v-if="searchResults">
      <!-- 搜索结果分类 -->
      <view class="result-tabs">
        <text 
          class="result-tab" 
          :class="{active: activeTab === 'spot'}"
          @click="switchTab('spot')"
        >景点</text>
        <text 
          class="result-tab" 
          :class="{active: activeTab === 'shop'}"
          @click="switchTab('shop')"
        >店铺</text>
        <text 
          class="result-tab" 
          :class="{active: activeTab === 'food'}"
          @click="switchTab('food')"
        >美食</text>
      </view>

      <!-- 景点结果 -->
      <view class="result-list" v-if="activeTab === 'spot'">
        <view 
          class="result-item" 
          v-for="item in spotResults" 
          :key="item.spot_id"
          @click="navigateToSpotDetail(item.spot_id)"
        >
          <image class="result-image" :src="item.mainImage || '/static/spot-default.jpg'" mode="aspectFill"></image>
          <view class="result-info">
            <text class="result-title">{{item.spot_name}}</text>
            <view class="result-rating">
              <uni-icons type="star-filled" size="14" color="#ffb400"></uni-icons>
              <text>{{item.average_rating || 0}}</text>
            </view>
            <text class="result-address">{{item.spot_address}}</text>
          </view>
        </view>
        <view class="no-result" v-if="!spotResults.length">
          <image class="no-result-image" src="/static/no-result.png"></image>
          <text class="no-result-text">没有找到相关景点</text>
          <text class="no-result-tip">换个关键词试试吧</text>
        </view>
      </view>

      <!-- 店铺结果 -->
      <view class="result-list" v-if="activeTab === 'shop'">
        <view 
          class="result-item" 
          v-for="item in shopResults" 
          :key="item.shop_id"
          @click="navigateToShopDetail(item.shop_id)"
        >
          <image class="result-image" :src="item.mainImage || '/static/shop-default.jpg'" mode="aspectFill"></image>
          <view class="result-info">
            <text class="result-title">{{item.shop_name}}</text>
            <text class="result-type">{{item.experience_type || '非遗体验'}}</text>
            <text class="result-price">{{item.price_range || '价格待定'}}</text>
          </view>
        </view>
        <view class="no-result" v-if="!shopResults.length">
          <image class="no-result-image" src="/static/no-result.png"></image>
          <text class="no-result-text">没有找到相关店铺</text>
          <text class="no-result-tip">换个关键词试试吧</text>
        </view>
      </view>

      <!-- 美食结果 -->
      <view class="result-list" v-if="activeTab === 'food'">
        <view 
          class="result-item" 
          v-for="item in foodResults" 
          :key="item.food_id"
          @click="navigateToFoodDetail(item.food_id)"
        >
          <image class="result-image" :src="item.mainImage || '/static/food-default.jpg'" mode="aspectFill"></image>
          <view class="result-info">
            <text class="result-title">{{item.food_name}}</text>
            <text class="result-desc">{{item.food_description || '探索景德镇独特的地方美食文化与传统'}}</text>
          </view>
        </view>
        <view class="no-result" v-if="!foodResults.length">
          <image class="no-result-image" src="/static/no-result.png"></image>
          <text class="no-result-text">没有找到相关美食</text>
          <text class="no-result-tip">换个关键词试试吧</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { scenicSpotApi, shopApi, foodApi, imageApi } from '@/api';
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'

export default {
  components: {
    uniIcons
  },
  data() {
    return {
      keyword: '',
      activeTab: 'spot',
      searchResults: false,
      spotResults: [],
      shopResults: [],
      foodResults: [],
      hotKeywords: ['陶溪川', '御窑博物馆', '乐天集市', '拉坯体验', '景德镇美食', '瑶里古镇'],
      historyKeywords: [],
      loading: false,
      initialFocus: false
    }
  },
  onLoad(options) {
    this.initialFocus = !!options.keyword;
    if (options.keyword) {
      this.keyword = decodeURIComponent(options.keyword);
      this.doSearch();
    }
    this.loadHistory();
  },
  methods: {
    async doSearch() {
      if (!this.keyword.trim()) {
        uni.showToast({
          title: '请输入搜索内容',
          icon: 'none'
        });
        return;
      }
      
      this.loading = true;
      this.searchResults = true;
      this.activeTab = 'spot';
      
      try {
        // 使用单独的API调用搜索不同类型的数据
        const [spotsRes, shopsRes, foodsRes] = await Promise.all([
          scenicSpotApi.getAll({ keyword: this.keyword }),
          shopApi.getAll({ keyword: this.keyword }),
          foodApi.getAll({ keyword: this.keyword })
        ]);
        
        // 处理搜索结果
        this.spotResults = await this.processSearchResults(spotsRes.data || [], 'spot');
        this.shopResults = await this.processSearchResults(shopsRes.data || [], 'shop');
        this.foodResults = await this.processSearchResults(foodsRes.data || [], 'food');
        
      } catch (error) {
        console.error('搜索失败:', error);
        uni.showToast({
          title: '搜索失败,请重试',
          icon: 'none'
        });
      } finally {
        this.loading = false;
        this.saveToHistory();
      }
    },
    
    async processSearchResults(items, type) {
      if (!items.length) return [];
      
      // 过滤掉不匹配的结果（前端二次过滤，确保准确性）
      const keyword = this.keyword.toLowerCase();
      const filteredItems = items.filter(item => {
        const nameField = `${type}_name`;
        const descField = `${type}_description`;
        const addressField = type === 'food' ? 'food_address' : 'spot_address';
        
        return (
          (item[nameField] && item[nameField].toLowerCase().includes(keyword)) ||
          (item[descField] && item[descField].toLowerCase().includes(keyword)) ||
          (item[addressField] && item[addressField].toLowerCase().includes(keyword))
        );
      });
      
      // 加载图片
      const itemsWithImages = await Promise.all(
        filteredItems.map(async (item) => {
          try {
            const res = await imageApi.getByRelatedId(item[`${type}_id`], type);
            if (res.data && res.data.length > 0) {
              const mainImage = res.data.find(img => img.is_main) || res.data[0];
              return {
                ...item,
                mainImage: mainImage.image_url
              };
            }
            return item;
          } catch (error) {
            console.error(`获取${type}图片失败:`, error);
            return item;
          }
        })
      );
      
      return itemsWithImages;
    },
    
    switchTab(tab) {
      this.activeTab = tab;
    },
    
    searchByTag(tag) {
      this.keyword = tag;
      this.doSearch();
    },
    
    clearSearch() {
      this.keyword = '';
      this.searchResults = false;
    },
    
    goBack() {
      uni.navigateBack();
    },
    
    loadHistory() {
      try {
        const history = uni.getStorageSync('searchHistory') || [];
        this.historyKeywords = history;
      } catch (e) {
        console.error('加载搜索历史失败', e);
      }
    },
    
    saveToHistory() {
      if (!this.keyword.trim()) return;
      
      // 去重
      const index = this.historyKeywords.indexOf(this.keyword);
      if (index !== -1) {
        this.historyKeywords.splice(index, 1);
      }
      
      // 添加到开头
      this.historyKeywords.unshift(this.keyword);
      
      // 限制数量
      if (this.historyKeywords.length > 10) {
        this.historyKeywords = this.historyKeywords.slice(0, 10);
      }
      
      try {
        uni.setStorageSync('searchHistory', this.historyKeywords);
      } catch (e) {
        console.error('保存搜索历史失败', e);
      }
    },
    
    removeHistoryItem(index) {
      this.historyKeywords.splice(index, 1);
      try {
        uni.setStorageSync('searchHistory', this.historyKeywords);
      } catch (e) {
        console.error('删除搜索历史失败', e);
      }
    },
    
    clearHistory() {
      this.historyKeywords = [];
      try {
        uni.removeStorageSync('searchHistory');
      } catch (e) {
        console.error('清空搜索历史失败', e);
      }
    },
    
    navigateToSpotDetail(id) {
      uni.navigateTo({
        url: `/pages/spot/detail?id=${id}`
      });
    },
    
    navigateToShopDetail(id) {
      uni.navigateTo({
        url: `/pages/shop/detail?id=${id}`
      });
    },
    
    navigateToFoodDetail(id) {
      uni.navigateTo({
        url: `/pages/food/detail?id=${id}`
      });
    }
  }
}
</script>

<style>
.search-container {
  padding: 20rpx 30rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.search-input-container {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 50rpx;
  padding: 15rpx 30rpx;
  margin-right: 20rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  margin-left: 15rpx;
  margin-right: 15rpx;
}

.cancel-btn {
  font-size: 28rpx;
  color: #666;
}

.section-title {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
}

.hot-tag {
  background-color: #fff;
  border-radius: 30rpx;
  padding: 10rpx 25rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  font-size: 26rpx;
  color: #333;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.clear-btn {
  font-size: 26rpx;
  color: #999;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
}

.history-tag {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 30rpx;
  padding: 10rpx 25rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  font-size: 26rpx;
  color: #333;
}

.history-tag uni-icons {
  margin-left: 10rpx;
}

.result-tabs {
  display: flex;
  border-bottom: 1rpx solid #eee;
  margin-bottom: 30rpx;
}

.result-tab {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.result-tab.active {
  color: #00B4D8;
  font-weight: bold;
}

.result-tab.active:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80rpx;
  height: 4rpx;
  background-color: #00B4D8;
  border-radius: 2rpx;
}

.result-item {
  display: flex;
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  padding: 20rpx;
}

.result-image {
  width: 180rpx;
  height: 180rpx;
  border-radius: 8rpx;
}

.result-info {
  flex: 1;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.result-title {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.result-rating {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  color: #ffb400;
}

.result-rating text {
  margin-left: 5rpx;
}

.result-address {
  font-size: 24rpx;
  color: #999;
}

.result-type {
  font-size: 24rpx;
  color: #00B4D8;
  background-color: rgba(0, 180, 216, 0.1);
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  align-self: flex-start;
}

.result-price {
  font-size: 26rpx;
  color: #ff6b6b;
}

.result-desc {
  font-size: 24rpx;
  color: #999;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.no-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
  background-color: #fff;
  border-radius: 12rpx;
}

.no-result-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
}

.no-result-text {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 15rpx;
}

.no-result-tip {
  font-size: 24rpx;
  color: #999;
}
</style>