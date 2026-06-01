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
      searchKeyword: "",
      sortIndex: 0,
      sortOptions: [
        { label: "智能排序", value: "default", field: "", order: "" },
        { label: "评分最高", value: "rating", field: "average_rating", order: "desc" },
        { label: "距离最近", value: "distance", field: "distance", order: "asc" },
        { label: "价格最低", value: "price", field: "ticket_price", order: "asc" }
      ],
      regionIndex: 0,
      regionOptions: [
        { label: "全部区域", value: "all" },
        { label: "昌江区", value: "changjiang" },
        { label: "珠山区", value: "zhushan" },
        { label: "浮梁县", value: "fuliang" }
      ],
      priceIndex: 0,
      priceOptions: [
        { label: "全部价格", value: "all" },
        { label: "免费", value: "free" },
        { label: "50元以下", value: "50" },
        { label: "50-100元", value: "50-100" },
        { label: "100元以上", value: "100" }
      ],
      spots: [],
      page: 1,
      pageSize: 10,
      hasMore: true,
      loading: false,
      currentLocation: null
    };
  },
  computed: {
    filteredSpots() {
      let result = [...this.spots];
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        result = result.filter(
          (spot) => spot.spot_name.toLowerCase().includes(keyword) || spot.spot_address.toLowerCase().includes(keyword)
        );
      }
      if (this.regionIndex > 0) {
        const region = this.regionOptions[this.regionIndex].value;
        result = result.filter((spot) => spot.spot_address.includes(region));
      }
      if (this.priceIndex > 0) {
        const priceRange = this.priceOptions[this.priceIndex].value;
        result = result.filter((spot) => {
          const price = spot.ticket_price || 0;
          if (priceRange === "free")
            return price === 0;
          if (priceRange === "50")
            return price > 0 && price < 50;
          if (priceRange === "50-100")
            return price >= 50 && price <= 100;
          if (priceRange === "100")
            return price > 100;
          return true;
        });
      }
      const sortType = this.sortOptions[this.sortIndex].value;
      if (sortType === "rating") {
        result.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
      } else if (sortType === "distance" && this.currentLocation) {
        result.sort((a, b) => {
          const distA = this.getDistance(a.longitude, a.latitude);
          const distB = this.getDistance(b.longitude, b.latitude);
          return distA - distB;
        });
      } else if (sortType === "price") {
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
        const res = await common_vendor.index.getLocation({
          type: "gcj02"
        });
        this.currentLocation = {
          longitude: res.longitude,
          latitude: res.latitude
        };
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/spot/list.vue:175", "获取位置失败:", error);
      }
    },
    getDistance(longitude, latitude) {
      if (!this.currentLocation || !longitude || !latitude)
        return "--";
      const R = 6371;
      const dLat = (latitude - this.currentLocation.latitude) * Math.PI / 180;
      const dLon = (longitude - this.currentLocation.longitude) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.currentLocation.latitude * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance.toFixed(1);
    },
    async loadSpots() {
      if (this.loading)
        return;
      this.loading = true;
      try {
        const params = {
          page: this.page,
          limit: this.pageSize
        };
        const sortOption = this.sortOptions[this.sortIndex];
        if (sortOption.field) {
          params.order = sortOption.field;
          params.sort = sortOption.order;
        }
        if (this.regionIndex > 0) {
          params.region = this.regionOptions[this.regionIndex].value;
        }
        if (this.priceIndex > 0) {
          params.price_range = this.priceOptions[this.priceIndex].value;
        }
        if (this.searchKeyword) {
          params.keyword = this.searchKeyword;
        }
        const res = await api.scenicSpotApi.getAll(params);
        const spotsWithImages = await Promise.all(
          res.data.map(async (spot) => {
            try {
              const imageRes = await api.imageApi.getByRelatedId(spot.spot_id, "spot");
              if (imageRes.data && imageRes.data.length > 0) {
                const mainImage = imageRes.data.find((img) => img.is_main) || imageRes.data[0];
                return { ...spot, mainImage: mainImage.image_url };
              }
              return spot;
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/spot/list.vue:243", "加载图片失败:", error);
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
        common_vendor.index.__f__("error", "at pages/spot/list.vue:257", "加载景点失败:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
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
      common_vendor.index.navigateTo({
        url: `/pages/spot/detail?id=${id}`
      });
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    b: $data.searchKeyword,
    c: common_vendor.o(($event) => $data.searchKeyword = $event.detail.value),
    d: common_vendor.o($options.handleSearch),
    e: common_vendor.p({
      type: "search",
      size: "20",
      color: "#00B4D8"
    }),
    f: common_vendor.t($data.sortOptions[$data.sortIndex].label),
    g: common_vendor.p({
      type: "arrowdown",
      size: "14",
      color: "#999"
    }),
    h: $data.sortOptions,
    i: common_vendor.o((...args) => $options.handleSortChange && $options.handleSortChange(...args)),
    j: common_vendor.t($data.priceOptions[$data.priceIndex].label),
    k: common_vendor.p({
      type: "arrowdown",
      size: "14",
      color: "#999"
    }),
    l: $data.priceOptions,
    m: common_vendor.o((...args) => $options.handlePriceChange && $options.handlePriceChange(...args)),
    n: common_vendor.f($options.filteredSpots, (spot, index, i0) => {
      return {
        a: spot.mainImage || "/static/spot-default.jpg",
        b: common_vendor.t(spot.spot_name),
        c: "b366ef50-3-" + i0,
        d: common_vendor.t(spot.average_rating || 0),
        e: common_vendor.t(spot.spot_address),
        f: common_vendor.t(spot.spot_description || "暂无景点描述"),
        g: common_vendor.t(spot.ticket_price ? `¥${spot.ticket_price}` : "免费"),
        h: common_vendor.t($options.getDistance(spot.longitude, spot.latitude)),
        i: index,
        j: common_vendor.o(($event) => $options.navigateToDetail(spot.spot_id), index)
      };
    }),
    o: common_vendor.p({
      type: "star-filled",
      size: "14",
      color: "#ffb400"
    }),
    p: $data.loading
  }, $data.loading ? {
    q: common_vendor.p({
      type: "spinner-cycle",
      size: "16",
      color: "#999"
    })
  } : !$data.hasMore ? {} : {}, {
    r: !$data.hasMore
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/spot/list.js.map
