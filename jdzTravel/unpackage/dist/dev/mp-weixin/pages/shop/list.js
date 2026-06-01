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
      filterType: "all",
      loading: false,
      hasMore: true,
      page: 1,
      pageSize: 10,
      shops: [],
      currentLocation: null
    };
  },
  computed: {
    filteredShops() {
      let result = [...this.shops];
      if (this.filterType !== "all") {
        result = result.filter((shop) => {
          const type = shop.experience_type || "";
          return type.toLowerCase().includes(this.filterType);
        });
      }
      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase();
        result = result.filter(
          (shop) => shop.shop_name.toLowerCase().includes(keyword) || shop.shop_description && shop.shop_description.toLowerCase().includes(keyword) || shop.shop_address && shop.shop_address.toLowerCase().includes(keyword)
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
        const res = await common_vendor.index.getLocation({
          type: "gcj02"
        });
        this.currentLocation = {
          longitude: res.longitude,
          latitude: res.latitude
        };
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/shop/list.vue:123", "获取位置失败:", error);
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
    async loadShops() {
      if (this.loading)
        return;
      this.loading = true;
      try {
        const params = {
          page: this.page,
          limit: this.pageSize
        };
        if (this.filterType !== "all") {
          params.experience_type = this.filterType;
        }
        if (this.searchKeyword) {
          params.keyword = this.searchKeyword;
        }
        const res = await api.shopApi.getAll(params);
        const shopsWithImages = await Promise.all(
          res.data.map(async (shop) => {
            try {
              const imageRes = await api.imageApi.getByRelatedId(shop.shop_id, "shop");
              if (imageRes.data && imageRes.data.length > 0) {
                const mainImage = imageRes.data.find((img) => img.is_main) || imageRes.data[0];
                return { ...shop, mainImage: mainImage.image_url };
              }
              return shop;
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/shop/list.vue:179", "加载图片失败:", error);
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
        common_vendor.index.__f__("error", "at pages/shop/list.vue:193", "加载店铺失败:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
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
      common_vendor.index.navigateTo({
        url: `/pages/shop/detail?id=${id}`
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
    f: common_vendor.f($options.filteredShops, (shop, index, i0) => {
      return {
        a: shop.mainImage || "/static/shop-default.jpg",
        b: common_vendor.t(shop.shop_name),
        c: common_vendor.t($options.getDistance(shop.longitude, shop.latitude)),
        d: common_vendor.t(shop.experience_type || "非遗体验"),
        e: "d0ccce38-1-" + i0,
        f: common_vendor.t(shop.average_rating || 0),
        g: common_vendor.t(shop.price_range || "价格待定"),
        h: index,
        i: common_vendor.o(($event) => $options.navigateToShopDetail(shop.shop_id), index)
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
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/shop/list.js.map
