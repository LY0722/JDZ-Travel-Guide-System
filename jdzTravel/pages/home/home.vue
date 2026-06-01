<template>
  <view class="home-container">
    <!-- 顶部轮播图 -->
    <swiper class="swiper" indicator-dots autoplay circular interval="3000">
      <swiper-item v-for="(item, index) in banners" :key="index">
        <image :src="item.image" mode="aspectFill" class="swiper-image" @click="navigateToDetail(item)"></image>
      </swiper-item>
    </swiper>

    <!-- 搜索框 -->
    <view class="search-bar">
      <input class="search-input" placeholder="搜索景点、店铺或美食" @click="navigateToSearch" :value="searchKeyword"
        @input="onSearchInput" confirm-type="search" @confirm="onSearchConfirm" />
      <uni-icons type="search" size="20" color="#00B4D8" @click="onSearchConfirm"></uni-icons>
    </view>

    <!-- 功能入口 -->
    <view class="function-grid">
      <view class="function-item" @tap="navigateToQA">
        <view class="function-icon" style="background-color: #FF6B6B;">
          <uni-icons type="help" size="24" color="#fff"></uni-icons>
        </view>
        <text class="function-text">智能问答</text>
      </view>
      <view class="function-item" @tap="navigateToMap">
        <view class="function-icon" style="background-color: #4ECDC4;">
          <uni-icons type="location" size="24" color="#fff"></uni-icons>
        </view>
        <text class="function-text">地图导航</text>
      </view>
      <view class="function-item" @tap="navigateToCommunity">
        <view class="function-icon" style="background-color: #45B7D1;">
          <uni-icons type="person" size="24" color="#fff"></uni-icons>
        </view>
        <text class="function-text">社区互动</text>
      </view>
      <view class="function-item" @tap="navigateToFood">
        <view class="function-icon" style="background-color: #FFA5A5;">
          <uni-icons type="shop" size="24" color="#fff"></uni-icons>
        </view>
        <text class="function-text">景德镇美食</text>
      </view>
    </view>

    <!-- 景点推荐 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">热门景点</text>
        <text class="section-more" @click="navigateToSpotList">查看更多 ></text>
      </view>
      <scroll-view class="scroll-view" scroll-x>
        <view class="spot-item" v-for="(spot, index) in spots" :key="index" @click="navigateToSpotDetail(spot.spot_id)">
          <image :src="spot.mainImage || '/static/spot-default.jpg'" mode="aspectFill" class="spot-image"></image>
          <view class="spot-info">
            <text class="spot-name">{{spot.spot_name}}</text>
            <view class="spot-rating">
              <uni-icons type="star-filled" size="16" color="#ffb400"></uni-icons>
              <text>{{spot.average_rating || 0}}</text>
            </view>
            <text class="spot-address">{{spot.spot_address}}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 非遗店铺推荐 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">非遗体验店</text>
        <text class="section-more" @click="navigateToShopList">查看更多 ></text>
      </view>
      <view class="shop-list">
        <view class="shop-item" v-for="(shop, index) in shops" :key="index" @click="navigateToShopDetail(shop.shop_id)">
          <image :src="shop.mainImage || '/static/shop-default.jpg'" mode="aspectFill" class="shop-image"></image>
          <view class="shop-detail">
            <text class="shop-name">{{shop.shop_name}}</text>
            <text class="shop-type">{{shop.experience_type}}</text>
            <text class="shop-price">{{shop.price_range || '价格待定'}}</text>
            <view class="shop-rating">
              <uni-icons type="star-filled" size="16" color="#ffb400"></uni-icons>
              <text>{{shop.average_rating || 0}}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 美食文化展示 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">景德镇美食</text>
        <text class="section-more" @click="navigateToFoodList">查看更多 ></text>
      </view>
      <view class="food-card" @click="navigateToFoodDetail(foods[0]?.food_id)" v-if="foods.length > 0">
        <image :src="foods[0].mainImage || '/static/food-default.jpg'" mode="aspectFill" class="food-image"></image>
        <view class="food-content">
          <text class="food-title">{{foods[0].food_name}}</text>
          <text class="food-desc">{{foods[0].food_description || '探索景德镇独特的地方美食文化与传统'}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {
    scenicSpotApi,
    shopApi,
    foodApi,
    imageApi
  } from '@/api';
  import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'

  export default {
    components: {
      uniIcons
    },
    data() {
      return {
        banners: [],
        spots: [],
        shops: [],
        foods: [],
        searchKeyword: '',
      }
    },
    async onLoad() {
      await this.loadData();
    },
    methods: {
      async loadData() {
        try {
          // 并行加载数据
          const [spotsRes, shopsRes, foodsRes] = await Promise.all([
            scenicSpotApi.getAll({
              limit: 8,
              order: 'average_rating',
              sort: 'desc'
            }),
            shopApi.getAll({
              limit: 8,
              order: 'average_rating',
              sort: 'desc'
            }),
            foodApi.getAll({
              limit: 8,
              order: 'average_rating',
              sort: 'desc'
            })
          ]);

          let spots = await this.loadImagesForItems(spotsRes.data || [], 'spot');
          const shops = await this.loadImagesForItems(shopsRes.data || [], 'shop');
          const foods = await this.loadImagesForItems(foodsRes.data || [], 'food');

          // === 重点：将雕塑瓷厂和三宝村提前 ===
          const priorityNames = ['雕塑瓷厂', '三宝村'];
          const prioritySpots = [];
          const otherSpots = [];
          spots.forEach(s => {
            if (priorityNames.includes(s.spot_name)) {
              prioritySpots.push(s);
            } else {
              otherSpots.push(s);
            }
          });
          // 保证顺序：雕塑瓷厂第一，三宝村第二
          prioritySpots.sort((a, b) => priorityNames.indexOf(a.spot_name) - priorityNames.indexOf(b.spot_name));
          spots = [...prioritySpots, ...otherSpots];

          // 随机抽取轮播图（从三类中各随机取，保证多样性）
          function getRandom(arr) {
            if (!arr.length) return null;
            return arr[Math.floor(Math.random() * arr.length)];
          }
          const bannerCount = 5;
          let banners = [];
          for (let i = 0; i < bannerCount; i++) {
            const typeRand = Math.floor(Math.random() * 3);
            let item = null;
            if (typeRand === 0) {
              item = getRandom(spots);
              if (item) banners.push({ image: item.mainImage, type: 'spot', id: item.spot_id });
            } else if (typeRand === 1) {
              item = getRandom(shops);
              if (item) banners.push({ image: item.mainImage, type: 'shop', id: item.shop_id });
            } else {
              item = getRandom(foods);
              if (item) banners.push({ image: item.mainImage, type: 'food', id: item.food_id });
            }
          }
          // 若有空位补齐
          if (banners.length < bannerCount) {
            banners = banners.concat(
              spots.slice(0, bannerCount - banners.length).map(item => ({
                image: item.mainImage,
                type: 'spot',
                id: item.spot_id
              }))
            );
          }
          this.banners = banners;

          // 其它数据赋值
          this.spots = spots.slice(0, 4);
          this.shops = shops.slice(0, 3);
          // 随机推荐一个美食
          if (foods.length > 0) {
            const randomIndex = Math.floor(Math.random() * foods.length);
            this.foods = [foods[randomIndex]];
          } else {
            this.foods = [];
          }
        } catch (error) {
          console.error('数据加载失败:', error);
          uni.showToast({
            title: '数据加载失败',
            icon: 'none'
          });
        }
      },

      async loadImagesForItems(items, type) {
        // 并行获取所有图片
        const itemsWithImages = await Promise.all(
          items.map(async (item) => {
            try {
              const res = await imageApi.getByRelatedId(item[`${type}_id`], type);
              if (res.data && res.data.length > 0) {
                // 找到主图或第一张图
                const mainImage = res.data.find((img) => img.is_main) || res.data[0];
                if (mainImage) {
                  return {
                    ...item,
                    mainImage: mainImage.image_url
                  };
                }
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

      onSearchInput(e) {
        this.searchKeyword = e.detail.value;
      },
      onSearchConfirm() {
        if (this.searchKeyword.trim()) {
          uni.navigateTo({
            url: `/pages/search/search?keyword=${encodeURIComponent(this.searchKeyword)}`
          });
        } else {
          uni.showToast({
            title: '请输入搜索内容',
            icon: 'none'
          });
        }
      },
      navigateToQA() {
        uni.switchTab({
          url: '/pages/qa/qa'
        });
      },
      navigateToMap() {
        uni.switchTab({
          url: '/pages/map/map'
        });
      },
      navigateToCommunity() {
        uni.switchTab({
          url: '/pages/community/community'
        });
      },
      navigateToFood() {
        uni.navigateTo({
          url: '/pages/food/food'
        });
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
      },
      navigateToSpotList() {
        uni.navigateTo({
          url: '/pages/spot/list'
        });
      },
      navigateToShopList() {
        uni.navigateTo({
          url: '/pages/shop/list'
        });
      },
      navigateToFoodList() {
        uni.navigateTo({
          url: '/pages/food/list'
        });
      },
      navigateToSearch() {
        uni.navigateTo({
          url: '/pages/search/search'
        });
      },
      navigateToDetail(item) {
        if (item.type === 'spot') {
          this.navigateToSpotDetail(item.id);
        } else if (item.type === 'shop') {
          this.navigateToShopDetail(item.id);
        } else if (item.type === 'food') {
          this.navigateToFoodDetail(item.id);
        }
      }
    }
  }
</script>

<style>
  /* 全局样式 */
  page {
    background-color: #f5f5f5;
    font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  }

  /* 首页容器 */
  .home-container {
    padding-bottom: 20rpx;
  }

  /* 轮播图样式 */
  .swiper {
    width: 100%;
    height: 350rpx;
  }

  .swiper-image {
    width: 100%;
    height: 100%;
  }

  /* 搜索框样式 */
  .search-bar {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 50rpx;
    padding: 15rpx 30rpx;
    margin: 20rpx 30rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 180, 216, 0.1);
  }

  .search-input {
    flex: 1;
    font-size: 28rpx;
    color: #666;
  }

  .icon-search {
    color: #00B4D8;
    font-size: 36rpx;
  }

  /* 功能入口样式 */
  .function-grid {
    display: flex;
    justify-content: space-around;
    padding: 30rpx 0;
    background-color: #fff;
    margin: 20rpx 30rpx;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 180, 216, 0.1);
  }

  .function-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .function-icon {
    width: 90rpx;
    height: 90rpx;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10rpx;
  }

  .function-icon .iconfont {
    color: #fff;
    font-size: 48rpx;
  }

  .function-text {
    font-size: 24rpx;
    color: #666;
  }

  /* 分区标题样式 */
  .section {
    background-color: #fff;
    margin: 30rpx;
    border-radius: 20rpx;
    padding: 20rpx;
    box-shadow: 0 4rpx 12rpx rgba(0, 180, 216, 0.1);
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
    font-size: 24rpx;
    color: #FF6B6B;
  }

  /* 景点滚动样式 */
  .scroll-view {
    white-space: nowrap;
    width: 100%;
  }

  .spot-item {
    display: inline-block;
    width: 280rpx;
    margin-right: 20rpx;
    background-color: #f9f9f9;
    border-radius: 12rpx;
    overflow: hidden;
  }

  .spot-image {
    width: 100%;
    height: 180rpx;
  }

  .spot-info {
    padding: 15rpx;
  }

  .spot-name {
    font-size: 26rpx;
    color: #333;
    font-weight: bold;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .spot-rating {
    display: flex;
    align-items: center;
    margin: 8rpx 0;
    font-size: 24rpx;
    color: #ffb400;
  }

  .spot-rating .iconfont {
    margin-right: 5rpx;
  }

  .spot-address {
    font-size: 22rpx;
    color: #999;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* 非遗店铺样式 */
  .shop-list {
    display: flex;
    flex-direction: column;
  }

  .shop-item {
    display: flex;
    margin-bottom: 20rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #eee;
  }

  .shop-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .shop-image {
    width: 200rpx;
    height: 150rpx;
    border-radius: 12rpx;
  }

  .shop-detail {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .shop-name {
    font-size: 28rpx;
    color: #333;
    font-weight: bold;
  }

  .shop-type {
    font-size: 24rpx;
    color: #00B4D8;
    background-color: rgba(0, 180, 216, 0.1);
    padding: 4rpx 12rpx;
    border-radius: 20rpx;
    align-self: flex-start;
  }

  .shop-price {
    font-size: 26rpx;
    color: #ff6b6b;
  }

  .shop-rating {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: #ffb400;
  }

  .shop-rating .iconfont {
    margin-right: 5rpx;
  }

  /* 美食卡片样式 */
  .food-card {
    background-color: #f9f9f9;
    border-radius: 12rpx;
    overflow: hidden;
  }

  .food-image {
    width: 100%;
    height: 300rpx;
  }

  .food-content {
    padding: 20rpx;
  }

  .food-title {
    font-size: 30rpx;
    color: #333;
    font-weight: bold;
    margin-bottom: 10rpx;
    display: block;
  }

  .food-desc {
    font-size: 26rpx;
    color: #666;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>