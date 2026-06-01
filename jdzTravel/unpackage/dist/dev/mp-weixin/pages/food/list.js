"use strict";
const common_vendor = require("../../common/vendor.js");
const api = require("../../api.js");
const uniIcons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
const _sfc_main = {
  components: { uniIcons },
  data() {
    return {
      foods: [],
      page: 1,
      pageSize: 10,
      hasMore: true,
      loading: false,
      searchKeyword: "",
      currentLocation: null
    };
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
        const res = await common_vendor.index.getLocation({ type: "gcj02" });
        this.currentLocation = { longitude: res.longitude, latitude: res.latitude };
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/food/list.vue:75", "获取位置失败:", error);
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
        if (this.searchKeyword)
          params.keyword = this.searchKeyword;
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
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      this.page = 1;
      this.loadFoods();
    },
    navigateToDetail(id) {
      common_vendor.index.navigateTo({ url: `/pages/food/detail?id=${id}` });
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
    f: common_vendor.f($data.foods, (food, index, i0) => {
      return {
        a: food.mainImage || "/static/food-default.jpg",
        b: common_vendor.t(food.food_name),
        c: "3d5c7c7c-1-" + i0,
        d: common_vendor.t(food.average_rating || 0),
        e: common_vendor.t(food.food_address),
        f: common_vendor.t(food.food_description || "暂无美食描述"),
        g: common_vendor.t(food.price_range || "价格待定"),
        h: common_vendor.t($options.getDistance(food.longitude, food.latitude)),
        i: index,
        j: common_vendor.o(($event) => $options.navigateToDetail(food.food_id), index)
      };
    }),
    g: common_vendor.p({
      type: "star-filled",
      size: "14",
      color: "#ffb400"
    }),
    h: $data.loading
  }, $data.loading ? {
    i: common_vendor.p({
      type: "spinner-cycle",
      size: "16",
      color: "#999"
    })
  } : !$data.hasMore ? {} : {}, {
    j: !$data.hasMore
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/food/list.js.map
