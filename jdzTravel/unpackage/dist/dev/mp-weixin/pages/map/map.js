"use strict";
const common_vendor = require("../../common/vendor.js");
const api = require("../../api.js");
const uniIcons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
const _sfc_main = {
  components: {
    uniIcons
  },
  data() {
    return {
      latitude: 29.3195,
      // 景德镇默认纬度
      longitude: 117.1702,
      // 景德镇默认经度
      scale: 14,
      currentLocation: null,
      scenicSpots: [],
      markers: [],
      polyline: [],
      selectedSpot: null,
      routeDistance: 0,
      routeDuration: 0,
      locationPermissionGranted: false,
      directionText: "",
      heading: null,
      compassInterval: null,
      loadingStatus: "more"
      // more, loading, noMore
    };
  },
  async onLoad() {
    await this.initMap();
    this.requestLocationPermission();
    await this.fetchScenicSpots();
  },
  onUnload() {
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
        this.markers = this.scenicSpots.map((spot) => ({
          id: spot.spot_id,
          latitude: spot.latitude,
          longitude: spot.longitude,
          title: spot.spot_name,
          iconPath: "/static/marker.png",
          width: 30,
          height: 30,
          callout: {
            content: spot.spot_name,
            color: "#ffffff",
            fontSize: 14,
            borderRadius: 4,
            bgColor: "#00B4D8",
            padding: 8,
            display: "ALWAYS"
          }
        }));
      }
    },
    // 从API获取景点数据
    async fetchScenicSpots() {
      this.loadingStatus = "loading";
      try {
        const res = await api.scenicSpotApi.getAll();
        if (res.data) {
          this.scenicSpots = await Promise.all(
            res.data.map(async (spot) => {
              try {
                const imageRes = await api.imageApi.getByRelatedId(spot.spot_id, "spot");
                if (imageRes.data && imageRes.data.length > 0) {
                  const mainImage = imageRes.data.find((img) => img.is_main) || imageRes.data[0];
                  return { ...spot, mainImage: mainImage.image_url };
                }
                return spot;
              } catch (error) {
                common_vendor.index.__f__("error", "at pages/map/map.vue:155", "加载图片失败:", error);
                return spot;
              }
            })
          );
          this.initMap();
        } else {
          throw new Error("获取景点数据失败");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/map/map.vue:165", "获取景点数据失败:", error);
        common_vendor.index.showToast({
          title: "获取景点数据失败",
          icon: "none"
        });
      } finally {
        this.loadingStatus = "more";
      }
    },
    // 请求定位权限
    requestLocationPermission() {
      common_vendor.index.authorize({
        scope: "scope.userLocation",
        success: () => {
          this.locationPermissionGranted = true;
          this.getCurrentLocation();
          this.startCompass();
        },
        fail: () => {
          common_vendor.index.showModal({
            title: "提示",
            content: "需要获取您的位置信息才能提供导航服务",
            confirmText: "去设置",
            success: (res) => {
              if (res.confirm) {
                common_vendor.index.openSetting({
                  success: (settingRes) => {
                    if (settingRes.authSetting["scope.userLocation"]) {
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
      this.compassInterval = setInterval(() => {
        common_vendor.index.onCompassChange((res) => {
          this.heading = res.direction;
          this.updateDirectionHint();
        });
      }, 1e3);
    },
    // 更新方向提示
    updateDirectionHint() {
      if (!this.selectedSpot || !this.currentLocation || !this.heading)
        return;
      const bearing = this.calculateBearing(
        this.currentLocation.latitude,
        this.currentLocation.longitude,
        this.selectedSpot.latitude,
        this.selectedSpot.longitude
      );
      const relativeAngle = (bearing - this.heading + 360) % 360;
      this.directionText = this.getDirectionText(relativeAngle);
    },
    // 获取当前位置
    getCurrentLocation() {
      if (!this.locationPermissionGranted) {
        common_vendor.index.showToast({
          title: "请先授权位置权限",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "定位中...",
        mask: true
      });
      common_vendor.index.getLocation({
        type: "gcj02",
        isHighAccuracy: true,
        // 高精度定位
        success: (res) => {
          common_vendor.index.hideLoading();
          this.currentLocation = {
            latitude: res.latitude,
            longitude: res.longitude
          };
          this.latitude = res.latitude;
          this.longitude = res.longitude;
          this.markers = this.markers.filter((marker) => marker.id !== 0);
          this.markers.push({
            id: 0,
            latitude: res.latitude,
            longitude: res.longitude,
            iconPath: "/static/current-location.png",
            width: 30,
            height: 30,
            zIndex: 999
          });
          common_vendor.index.showToast({
            title: "定位成功",
            icon: "success",
            duration: 1500
          });
          if (this.selectedSpot) {
            this.updateDirectionHint();
          }
        },
        fail: (err) => {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/map/map.vue:290", "获取位置失败:", err);
          common_vendor.index.showToast({
            title: "定位失败，请检查GPS和网络",
            icon: "none",
            duration: 2e3
          });
        }
      });
    },
    // 点击标记点
    onMarkerTap(e) {
      const markerId = e.markerId;
      if (markerId === 0)
        return;
      const spot = this.scenicSpots.find((item) => item.spot_id === markerId);
      if (spot) {
        this.selectSpot(spot);
      }
    },
    // 选择景点
    selectSpot(spot) {
      this.selectedSpot = spot;
      if (this.currentLocation) {
        this.routeDistance = this.calculateDistance(
          this.currentLocation.latitude,
          this.currentLocation.longitude,
          spot.latitude,
          spot.longitude
        );
        this.routeDuration = Math.round(this.routeDistance / 5 * 60);
        this.drawRoute(
          this.currentLocation.longitude,
          this.currentLocation.latitude,
          spot.longitude,
          spot.latitude
        );
        this.adjustMapView(
          this.currentLocation.longitude,
          this.currentLocation.latitude,
          spot.longitude,
          spot.latitude
        );
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
        common_vendor.index.showToast({
          title: "请先获取当前位置",
          icon: "none"
        });
      }
    },
    // 计算两点间距离(公里)
    calculateDistance(lat1, lng1, lat2, lng2) {
      const radLat1 = lat1 * Math.PI / 180;
      const radLat2 = lat2 * Math.PI / 180;
      const a = radLat1 - radLat2;
      const b = lng1 * Math.PI / 180 - lng2 * Math.PI / 180;
      let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * 6378.137;
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
        color: "#00B4D8",
        width: 6,
        dottedLine: false,
        arrowLine: true
      }];
    },
    // 调整地图视角以显示路线
    adjustMapView(startLng, startLat, endLng, endLat) {
      const centerLng = (startLng + endLng) / 2;
      const centerLat = (startLat + endLat) / 2;
      const distance = this.calculateDistance(startLat, startLng, endLat, endLng);
      let newScale = 14;
      if (distance > 10)
        newScale = 11;
      else if (distance > 5)
        newScale = 12;
      else if (distance > 2)
        newScale = 13;
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
      const x = Math.cos(startLatRad) * Math.sin(endLatRad) - Math.sin(startLatRad) * Math.cos(endLatRad) * Math.cos(endLngRad - startLngRad);
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
        "正北",
        "东北",
        "正东",
        "东南",
        "正南",
        "西南",
        "正西",
        "西北"
      ];
      const index = Math.round(bearing / 45) % 8;
      return directions[index];
    },
    // 打开导航
    openNavigation() {
      if (!this.selectedSpot) {
        common_vendor.index.showToast({
          title: "请先选择目的地",
          icon: "none"
        });
        return;
      }
      if (!this.currentLocation) {
        common_vendor.index.showToast({
          title: "请先获取当前位置",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "准备导航中..."
      });
      common_vendor.index.openLocation({
        latitude: Number(this.selectedSpot.latitude),
        longitude: Number(this.selectedSpot.longitude),
        scale: 18,
        name: this.selectedSpot.spot_name,
        address: this.selectedSpot.spot_address,
        success: () => {
          common_vendor.index.hideLoading();
        },
        fail: (err) => {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/map/map.vue:481", "打开地图失败:", err);
          common_vendor.index.showToast({
            title: "打开地图失败，请检查是否安装地图应用",
            icon: "none"
          });
        }
      });
    },
    // 步行导航
    startWalkingNavigation() {
      if (!this.selectedSpot || !this.currentLocation) {
        common_vendor.index.showToast({
          title: "请先获取当前位置并选择目的地",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "准备步行导航..."
      });
      common_vendor.index.showModal({
        title: "步行导航",
        content: `请往${this.directionText}方向步行，距离约${this.routeDistance.toFixed(2)}公里，预计需要${this.routeDuration}分钟`,
        showCancel: false,
        success: () => {
          common_vendor.index.hideLoading();
        }
      });
    },
    // 关闭路线面板
    closeRoutePanel() {
      this.selectedSpot = null;
      this.polyline = [];
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  const _component_uni_load_more = common_vendor.resolveComponent("uni-load-more");
  (_component_uni_icons + _component_uni_load_more)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.latitude,
    b: $data.longitude,
    c: $data.markers,
    d: $data.polyline,
    e: $data.scale,
    f: common_vendor.o((...args) => $options.onMarkerTap && $options.onMarkerTap(...args)),
    g: $data.selectedSpot && $data.currentLocation
  }, $data.selectedSpot && $data.currentLocation ? {
    h: common_vendor.p({
      type: "location-filled",
      size: "20",
      color: "#00B4D8"
    }),
    i: common_vendor.t($data.directionText),
    j: common_vendor.t($data.routeDistance.toFixed(2))
  } : {}, {
    k: common_vendor.f($data.scenicSpots, (spot, index, i0) => {
      return common_vendor.e({
        a: spot.mainImage || "/static/spot-default.jpg",
        b: common_vendor.t(spot.spot_name),
        c: common_vendor.t(spot.spot_address)
      }, $data.currentLocation ? {
        d: common_vendor.t($options.calculateDistance($data.currentLocation.latitude, $data.currentLocation.longitude, spot.latitude, spot.longitude).toFixed(2))
      } : {}, {
        e: index,
        f: common_vendor.o(($event) => $options.selectSpot(spot), index)
      });
    }),
    l: $data.currentLocation,
    m: $data.selectedSpot
  }, $data.selectedSpot ? {
    n: common_vendor.o($options.closeRoutePanel),
    o: common_vendor.p({
      type: "closeempty",
      size: "24",
      color: "#999"
    }),
    p: common_vendor.t($data.selectedSpot.spot_name),
    q: common_vendor.t($data.routeDistance.toFixed(2)),
    r: common_vendor.t($data.routeDuration),
    s: common_vendor.t($data.directionText),
    t: common_vendor.p({
      type: "paperplane-filled",
      size: "18",
      color: "#fff"
    }),
    v: common_vendor.o((...args) => $options.openNavigation && $options.openNavigation(...args)),
    w: common_vendor.p({
      type: "person-filled",
      size: "18",
      color: "#00B4D8"
    }),
    x: common_vendor.o((...args) => $options.startWalkingNavigation && $options.startWalkingNavigation(...args))
  } : {}, {
    y: common_vendor.p({
      type: "location-filled",
      size: "24",
      color: "#00B4D8"
    }),
    z: common_vendor.o((...args) => $options.getCurrentLocation && $options.getCurrentLocation(...args)),
    A: $data.loadingStatus !== "more"
  }, $data.loadingStatus !== "more" ? {
    B: common_vendor.p({
      status: $data.loadingStatus
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/map/map.js.map
