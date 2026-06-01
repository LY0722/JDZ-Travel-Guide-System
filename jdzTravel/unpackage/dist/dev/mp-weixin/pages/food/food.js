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
        { label: "价格最低", value: "price", field: "price_range", order: "asc" }
      ],
      priceIndex: 0,
      priceOptions: [
        { label: "全部价格", value: "all" },
        { label: "50元以下", value: "50" },
        { label: "50-100元", value: "50-100" },
        { label: "100元以上", value: "100" }
      ],
      foods: [],
      page: 1,
      pageSize: 10,
      hasMore: true,
      loading: false,
      currentLocation: null
    };
  },
  computed: {
    filteredFoods() {
      let result = [...this.foods];
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        result = result.filter((food) => food.food_name.toLowerCase().includes(keyword) || food.food_address.toLowerCase().includes(keyword));
      }
      if (this.priceIndex > 0) {
        const priceRange = this.priceOptions[this.priceIndex].value;
        result = result.filter((food) => {
          const price = food.price_range || "";
          if (priceRange === "50")
            return price.includes("50以下") || price.includes("10-20") || price.includes("20-30");
          if (priceRange === "50-100")
            return price.includes("50-100") || price.includes("60-70") || price.includes("70-80");
          if (priceRange === "100")
            return price.includes("100以上");
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
      if (!priceRange)
        return 0;
      const match = priceRange.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    },
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
        common_vendor.index.__f__("error", "at pages/food/food.vue:178", "获取位置失败:", error);
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
    async loadFoods() {
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
        if (this.priceIndex > 0) {
          params.price_range = this.priceOptions[this.priceIndex].value;
        }
        if (this.searchKeyword) {
          params.keyword = this.searchKeyword;
        }
        const res = await api.foodApi.getAll(params);
        const foodsWithImages = await Promise.all(
          res.data.map(async (food) => {
            try {
              const imageRes = await api.imageApi.getByRelatedId(food.food_id, "food");
              if (imageRes.data && imageRes.data.length > 0) {
                const mainImage = imageRes.data.find((img) => img.is_main) || imageRes.data[0];
                return { ...food, mainImage: mainImage.image_url };
              }
              return food;
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/food/food.vue:239", "加载图片失败:", error);
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
        common_vendor.index.__f__("error", "at pages/food/food.vue:253", "加载美食失败:", error);
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
      common_vendor.index.navigateTo({
        url: `/pages/food/detail?id=${id}`
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
    n: common_vendor.f($options.filteredFoods, (food, index, i0) => {
      return {
        a: food.mainImage || "/static/food-default.jpg",
        b: common_vendor.t(food.food_name),
        c: common_vendor.t($options.getDistance(food.longitude, food.latitude)),
        d: common_vendor.t(food.food_address),
        e: common_vendor.t(food.food_description || "暂无美食描述"),
        f: "03c5f83c-3-" + i0,
        g: common_vendor.t(food.average_rating || 0),
        h: common_vendor.t(food.price_range || "价格待定"),
        i: index,
        j: common_vendor.o(($event) => $options.navigateToDetail(food.food_id), index)
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
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/food/food.js.map
