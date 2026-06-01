<!-- pages/culture-map/culture-map.vue -->
<template>
  <view class="container">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">瓷都匠艺之旅</text>
      <text class="subtitle">探索景德镇陶瓷文化</text>
    </view>

    <!-- 地图容器 -->
    <view class="map-container">
      <map id="cultureMap" :latitude="latitude" :longitude="longitude" :markers="markers" 
           :polyline="polyline" :scale="scale" :show-location="true" 
           @markertap="onMarkerTap" class="map">
      </map>
      
      <!-- 方向提示 -->
      <view class="direction-hint" v-if="selectedSpot && currentLocation">
        <uni-icons type="location-filled" size="20" color="#00B4D8"></uni-icons>
        <text class="direction-text">
          往{{directionText}}方向 {{routeDistance.toFixed(2)}}公里
        </text>
      </view>
    </view>

    <!-- 底部景点列表 -->
    <view class="spots-list">
      <scroll-view scroll-x class="scroll-view" :scroll-with-animation="true" :show-scrollbar="false">
        <view v-for="(spot, index) in scenicSpots" :key="index" class="spot-item" @click="selectSpot(spot)">
          <image :src="spot.mainImage || '/static/spot-default.jpg'" class="spot-image" mode="aspectFill"></image>
          <view class="spot-info">
            <text class="spot-name">{{spot.spot_name}}</text>
            <text class="spot-address">{{spot.spot_address}}</text>
            <text class="spot-distance" v-if="currentLocation">
              距离: {{calculateDistance(currentLocation.latitude, currentLocation.longitude, spot.latitude, spot.longitude).toFixed(2)}} km
            </text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 路线规划面板 -->
    <view class="route-panel" v-if="selectedSpot">
      <view class="panel-header">
        <text class="panel-title">路线规划</text>
        <uni-icons type="closeempty" size="24" color="#999" @click="closeRoutePanel"></uni-icons>
      </view>
      <view class="route-info">
        <text class="route-text">从您的位置到 {{selectedSpot.spot_name}}</text>
        <text class="route-distance">距离: {{routeDistance.toFixed(2)}} km</text>
        <text class="route-time">预计时间: {{routeDuration}} 分钟</text>
        <text class="route-direction">方向: 往{{directionText}}方向</text>
      </view>
      <button class="nav-btn" @click="openNavigation">
        <uni-icons type="paperplane-filled" size="18" color="#fff"></uni-icons>
        开始导航
      </button>
      <button class="walk-btn" @click="startWalkingNavigation">
        <uni-icons type="person-filled" size="18" color="#00B4D8"></uni-icons>
        步行导航
      </button>
    </view>

    <!-- 定位按钮 -->
    <view class="location-btn" @click="getCurrentLocation">
      <uni-icons type="location-filled" size="24" color="#00B4D8"></uni-icons>
    </view>
    
    <!-- 加载提示 -->
    <uni-load-more :status="loadingStatus" v-if="loadingStatus !== 'more'"></uni-load-more>
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
      latitude: 29.3195, // 景德镇默认纬度
      longitude: 117.1702, // 景德镇默认经度
      scale: 14,
      currentLocation: null,
      scenicSpots: [],
      markers: [],
      polyline: [],
      selectedSpot: null,
      routeDistance: 0,
      routeDuration: 0,
      locationPermissionGranted: false,
      directionText: '',
      heading: null,
      compassInterval: null,
      loadingStatus: 'more' // more, loading, noMore
    }
  },
  async onLoad() {
    await this.initMap();
    this.requestLocationPermission();
    await this.fetchScenicSpots();
  },
  onUnload() {
    // 清除指南针监听
    if (this.compassInterval) {
      clearInterval(this.compassInterval);
      this.compassInterval = null;
    }
  },
  methods: {
    // 初始化地图
    async initMap() {
      this.markers = [];
      if (this.scenicSpots.length > 0) {
        this.markers = this.scenicSpots.map(spot => ({
          id: spot.spot_id,
          latitude: spot.latitude,
          longitude: spot.longitude,
          title: spot.spot_name,
          iconPath: '/static/marker.png',
          width: 30,
          height: 30,
          callout: {
            content: spot.spot_name,
            color: '#ffffff',
            fontSize: 14,
            borderRadius: 4,
            bgColor: '#00B4D8',
            padding: 8,
            display: 'ALWAYS'
          }
        }));
      }
    },

    // 从API获取景点数据
    async fetchScenicSpots() {
      this.loadingStatus = 'loading';
      try {
        const res = await scenicSpotApi.getAll();
        if (res.data) {
          // 加载景点图片
          this.scenicSpots = await Promise.all(
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
          this.initMap();
        } else {
          throw new Error('获取景点数据失败');
        }
      } catch (error) {
        console.error('获取景点数据失败:', error);
        uni.showToast({
          title: '获取景点数据失败',
          icon: 'none'
        });
      } finally {
        this.loadingStatus = 'more';
      }
    },
    
    // 请求定位权限
    requestLocationPermission() {
      uni.authorize({
        scope: 'scope.userLocation',
        success: () => {
          this.locationPermissionGranted = true;
          this.getCurrentLocation();
          this.startCompass();
        },
        fail: () => {
          uni.showModal({
            title: '提示',
            content: '需要获取您的位置信息才能提供导航服务',
            confirmText: '去设置',
            success: (res) => {
              if (res.confirm) {
                uni.openSetting({
                  success: (settingRes) => {
                    if (settingRes.authSetting['scope.userLocation']) {
                      this.locationPermissionGranted = true;
                      this.getCurrentLocation();
                      this.startCompass();
                    }
                  }
                });
              }
            }
          });
        }
      });
    },
    
    // 开始监听指南针
    startCompass() {
      if (this.compassInterval) {
        clearInterval(this.compassInterval);
      }
      
      // 监听设备方向
      this.compassInterval = setInterval(() => {
        uni.onCompassChange((res) => {
          this.heading = res.direction;
          this.updateDirectionHint();
        });
      }, 1000);
    },
    
    // 更新方向提示
    updateDirectionHint() {
      if (!this.selectedSpot || !this.currentLocation || !this.heading) return;
      
      const bearing = this.calculateBearing(
        this.currentLocation.latitude,
        this.currentLocation.longitude,
        this.selectedSpot.latitude,
        this.selectedSpot.longitude
      );
      
      // 计算相对方向
      const relativeAngle = (bearing - this.heading + 360) % 360;
      this.directionText = this.getDirectionText(relativeAngle);
    },
    
    // 获取当前位置
    getCurrentLocation() {
      if (!this.locationPermissionGranted) {
        uni.showToast({
          title: '请先授权位置权限',
          icon: 'none'
        });
        return;
      }

      uni.showLoading({
        title: '定位中...',
        mask: true
      });

      uni.getLocation({
        type: 'gcj02',
        isHighAccuracy: true, // 高精度定位
        success: (res) => {
          uni.hideLoading();
          this.currentLocation = {
            latitude: res.latitude,
            longitude: res.longitude
          };
          this.latitude = res.latitude;
          this.longitude = res.longitude;

          // 添加当前位置标记
          this.markers = this.markers.filter(marker => marker.id !== 0); // 移除旧的位置标记
          this.markers.push({
            id: 0,
            latitude: res.latitude,
            longitude: res.longitude,
            iconPath: '/static/current-location.png',
            width: 30,
            height: 30,
            zIndex: 999
          });

          uni.showToast({
            title: '定位成功',
            icon: 'success',
            duration: 1500
          });
          
          // 更新方向提示
          if (this.selectedSpot) {
            this.updateDirectionHint();
          }
        },
        fail: (err) => {
          uni.hideLoading();
          console.error('获取位置失败:', err);
          uni.showToast({
            title: '定位失败，请检查GPS和网络',
            icon: 'none',
            duration: 2000
          });
        }
      });
    },

    // 点击标记点
    onMarkerTap(e) {
      const markerId = e.markerId;
      if (markerId === 0) return; // 当前位置标记不处理

      const spot = this.scenicSpots.find(item => item.spot_id === markerId);
      if (spot) {
        this.selectSpot(spot);
      }
    },

    // 选择景点
    selectSpot(spot) {
      this.selectedSpot = spot;

      if (this.currentLocation) {
        // 计算距离
        this.routeDistance = this.calculateDistance(
          this.currentLocation.latitude,
          this.currentLocation.longitude,
          spot.latitude,
          spot.longitude
        );

        // 简单估算时间(假设步行速度5km/h)
        this.routeDuration = Math.round(this.routeDistance / 5 * 60);

        // 绘制路线
        this.drawRoute(
          this.currentLocation.longitude,
          this.currentLocation.latitude,
          spot.longitude,
          spot.latitude
        );

        // 调整地图视角
        this.adjustMapView(
          this.currentLocation.longitude,
          this.currentLocation.latitude,
          spot.longitude,
          spot.latitude
        );
        
        // 计算方向
        const bearing = this.calculateBearing(
          this.currentLocation.latitude,
          this.currentLocation.longitude,
          spot.latitude,
          spot.longitude
        );
        
        if (this.heading) {
          const relativeAngle = (bearing - this.heading + 360) % 360;
          this.directionText = this.getDirectionText(relativeAngle);
        } else {
          this.directionText = this.getDirectionText(bearing);
        }
      } else {
        uni.showToast({
          title: '请先获取当前位置',
          icon: 'none'
        });
      }
    },

    // 计算两点间距离(公里)
    calculateDistance(lat1, lng1, lat2, lng2) {
      const radLat1 = lat1 * Math.PI / 180.0;
      const radLat2 = lat2 * Math.PI / 180.0;
      const a = radLat1 - radLat2;
      const b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
      let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * 6378.137; // 地球半径
      return s;
    },

    // 绘制路线
    drawRoute(startLng, startLat, endLng, endLat) {
      this.polyline = [{
        points: [
          {
            longitude: startLng,
            latitude: startLat
          },
          {
            longitude: endLng,
            latitude: endLat
          }
        ],
        color: '#00B4D8',
        width: 6,
        dottedLine: false,
        arrowLine: true
      }];
    },

    // 调整地图视角以显示路线
    adjustMapView(startLng, startLat, endLng, endLat) {
      // 简单计算中点
      const centerLng = (startLng + endLng) / 2;
      const centerLat = (startLat + endLat) / 2;

      // 计算缩放级别(简单估算)
      const distance = this.calculateDistance(startLat, startLng, endLat, endLng);
      let newScale = 14;
      if (distance > 10) newScale = 11;
      else if (distance > 5) newScale = 12;
      else if (distance > 2) newScale = 13;

      this.longitude = centerLng;
      this.latitude = centerLat;
      this.scale = newScale;
    },
    
    // 计算方位角度
    calculateBearing(startLat, startLng, endLat, endLng) {
      const startLatRad = this.degToRad(startLat);
      const startLngRad = this.degToRad(startLng);
      const endLatRad = this.degToRad(endLat);
      const endLngRad = this.degToRad(endLng);
      
      const y = Math.sin(endLngRad - startLngRad) * Math.cos(endLatRad);
      const x = Math.cos(startLatRad) * Math.sin(endLatRad) - 
                Math.sin(startLatRad) * Math.cos(endLatRad) * Math.cos(endLngRad - startLngRad);
      let bearing = Math.atan2(y, x);
      bearing = this.radToDeg(bearing);
      return (bearing + 360) % 360;
    },
    
    degToRad(deg) {
      return deg * Math.PI / 180;
    },
    
    radToDeg(rad) {
      return rad * 180 / Math.PI;
    },
    
    // 获取方向描述
    getDirectionText(bearing) {
      const directions = [
        '正北', '东北', '正东', '东南', 
        '正南', '西南', '正西', '西北'
      ];
      const index = Math.round(bearing / 45) % 8;
      return directions[index];
    },
    
    // 打开导航
    openNavigation() {
      if (!this.selectedSpot) {
        uni.showToast({
          title: '请先选择目的地',
          icon: 'none'
        });
        return;
      }
      
      if (!this.currentLocation) {
        uni.showToast({
          title: '请先获取当前位置',
          icon: 'none'
        });
        return;
      }
      
      uni.showLoading({
        title: '准备导航中...'
      });
      
      uni.openLocation({
        latitude: Number(this.selectedSpot.latitude),
        longitude: Number(this.selectedSpot.longitude),
        scale: 18,
        name: this.selectedSpot.spot_name,
        address: this.selectedSpot.spot_address,
        success: () => {
          uni.hideLoading();
        },
        fail: (err) => {
          uni.hideLoading();
          console.error('打开地图失败:', err);
          uni.showToast({
            title: '打开地图失败，请检查是否安装地图应用',
            icon: 'none'
          });
        }
      });
    },
    
    // 步行导航
    startWalkingNavigation() {
      if (!this.selectedSpot || !this.currentLocation) {
        uni.showToast({
          title: '请先获取当前位置并选择目的地',
          icon: 'none'
        });
        return;
      }
      
      uni.showLoading({
        title: '准备步行导航...'
      });
      
      uni.showModal({
        title: '步行导航',
        content: `请往${this.directionText}方向步行，距离约${this.routeDistance.toFixed(2)}公里，预计需要${this.routeDuration}分钟`,
        showCancel: false,
        success: () => {
          uni.hideLoading();
        }
      });
    },

    // 关闭路线面板
    closeRoutePanel() {
      this.selectedSpot = null;
      this.polyline = [];
    }
  }
}
</script>

<style lang="scss">
  /* 青色主题色 */
  $primary-color: #00B4D8;
  $secondary-color: #e0f7fa;
  $text-color: #333;
  $light-text: #777;

  .container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f5f5f5;
    position: relative;
  }

  .header {
    flex: none;
    padding: 20rpx 30rpx;
    background-color: $primary-color;
    color: white;
    z-index: 10;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);

    .title {
      font-size: 36rpx;
      font-weight: bold;
      display: block;
    }

    .subtitle {
      font-size: 24rpx;
      display: block;
      margin-top: 10rpx;
      opacity: 0.9;
    }
  }

  .map-container {
    flex: 1;
    min-height:0;
    position: relative;

    .map {
      width: 100%;
      height: 100%;
    }
    
    .direction-hint {
      position: absolute;
      top: 20rpx;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(255, 255, 255, 0.95);
      padding: 12rpx 25rpx;
      border-radius: 50rpx;
      box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.15);
      z-index: 1000;
      display: flex;
      align-items: center;
      border: 1rpx solid #f0f0f0;
      min-width: 300rpx;
      justify-content: center;
      
      .direction-text {
        font-size: 28rpx;
        color: $text-color;
        font-weight: 500;
        margin-left: 10rpx;
      }
    }
  }

  .spots-list {
    flex: none;
    height: 280rpx;
    background-color: white;
    border-top: 1rpx solid #eee;
    padding: 10rpx 0;
    box-sizing: border-box;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

    .scroll-view {
      height: 100%;
      white-space: nowrap;
      width: 100%;
    }

    .spot-item {
      display: inline-block;
      width: 280rpx;
      height: 240rpx;
      margin: 0 15rpx;
      background-color: white;
      border-radius: 12rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
      overflow: hidden;
      vertical-align: top;
      transition: transform 0.2s;
      
      &:active {
        transform: scale(0.98);
      }
      
      &:first-child {
        margin-left: 20rpx;
      }
      
      &:last-child {
        margin-right: 20rpx;
      }

      .spot-image {
        width: 100%;
        height: 150rpx;
        display: block;
      }

      .spot-info {
        padding: 15rpx;
        display: flex;
        flex-direction: column;

        .spot-name {
          font-size: 26rpx;
          font-weight: bold;
          color: $text-color;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .spot-address {
          font-size: 22rpx;
          color: $light-text;
          margin-top: 5rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .spot-distance {
          font-size: 22rpx;
          color: $primary-color;
          margin-top: 8rpx;
          font-weight: 500;
        }
      }
    }
  }

  .route-panel {
    position: absolute;
    bottom: 100rpx;
    left: 30rpx;
    right: 30rpx;
    background-color: white;
    border-radius: 16rpx;
    padding: 25rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
    z-index: 1000;
    transform: translateY(0);
    transition: transform 0.3s ease;
    border: 1rpx solid #f0f0f0;

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .panel-title {
        font-size: 30rpx;
        font-weight: bold;
        color: $text-color;
      }
    }

    .route-info {
      margin-bottom: 25rpx;

      .route-text {
        display: block;
        font-size: 28rpx;
        color: $text-color;
        margin-bottom: 12rpx;
        font-weight: 500;
      }

      .route-distance,
      .route-time,
      .route-direction {
        display: block;
        font-size: 26rpx;
        color: $light-text;
        margin-top: 8rpx;
      }
      
      .route-direction {
        color: $primary-color;
        font-weight: 500;
      }
    }

    .nav-btn {
      background-color: $primary-color;
      color: white;
      border-radius: 50rpx;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 30rpx;
      margin-top: 10rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &::after {
        border: none;
      }
      
      &:active {
        background-color: darken($primary-color, 10%);
      }
      
      uni-icons {
        margin-right: 10rpx;
      }
    }
    
    .walk-btn {
      background-color: #f8f8f8;
      color: $primary-color;
      border-radius: 50rpx;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 30rpx;
      margin-top: 20rpx;
      border: 1rpx solid #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &::after {
        border: none;
      }
      
      &:active {
        background-color: #f0f0f0;
      }
      
      uni-icons {
        margin-right: 10rpx;
      }
    }
  }

  .location-btn {
    position: absolute;
    right: 30rpx;
    bottom: 320rpx;
    width: 80rpx;
    height: 80rpx;
    background-color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
    z-index: 100;
    transition: transform 0.2s;
    border: 1rpx solid #f0f0f0;

    &:active {
      transform: scale(0.95);
    }
  }
</style>