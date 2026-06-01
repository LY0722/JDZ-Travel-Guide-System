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
      banners: [],
      spots: [],
      shops: [],
      foods: [],
      searchKeyword: ""
    };
  },
  async onLoad() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        let getRandom = function(arr) {
          if (!arr.length)
            return null;
          return arr[Math.floor(Math.random() * arr.length)];
        };
        const [spotsRes, shopsRes, foodsRes] = await Promise.all([
          api.scenicSpotApi.getAll({
            limit: 8,
            order: "average_rating",
            sort: "desc"
          }),
          api.shopApi.getAll({
            limit: 8,
            order: "average_rating",
            sort: "desc"
          }),
          api.foodApi.getAll({
            limit: 8,
            order: "average_rating",
            sort: "desc"
          })
        ]);
        let spots = await this.loadImagesForItems(spotsRes.data || [], "spot");
        const shops = await this.loadImagesForItems(shopsRes.data || [], "shop");
        const foods = await this.loadImagesForItems(foodsRes.data || [], "food");
        const priorityNames = ["雕塑瓷厂", "三宝村"];
        const prioritySpots = [];
        const otherSpots = [];
        spots.forEach((s) => {
          if (priorityNames.includes(s.spot_name)) {
            prioritySpots.push(s);
          } else {
            otherSpots.push(s);
          }
        });
        prioritySpots.sort((a, b) => priorityNames.indexOf(a.spot_name) - priorityNames.indexOf(b.spot_name));
        spots = [...prioritySpots, ...otherSpots];
        const bannerCount = 5;
        let banners = [];
        for (let i = 0; i < bannerCount; i++) {
          const typeRand = Math.floor(Math.random() * 3);
          let item = null;
          if (typeRand === 0) {
            item = getRandom(spots);
            if (item)
              banners.push({ image: item.mainImage, type: "spot", id: item.spot_id });
          } else if (typeRand === 1) {
            item = getRandom(shops);
            if (item)
              banners.push({ image: item.mainImage, type: "shop", id: item.shop_id });
          } else {
            item = getRandom(foods);
            if (item)
              banners.push({ image: item.mainImage, type: "food", id: item.food_id });
          }
        }
        if (banners.length < bannerCount) {
          banners = banners.concat(
            spots.slice(0, bannerCount - banners.length).map((item) => ({
              image: item.mainImage,
              type: "spot",
              id: item.spot_id
            }))
          );
        }
        this.banners = banners;
        this.spots = spots.slice(0, 4);
        this.shops = shops.slice(0, 3);
        if (foods.length > 0) {
          const randomIndex = Math.floor(Math.random() * foods.length);
          this.foods = [foods[randomIndex]];
        } else {
          this.foods = [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/home/home.vue:215", "数据加载失败:", error);
        common_vendor.index.showToast({
          title: "数据加载失败",
          icon: "none"
        });
      }
    },
    async loadImagesForItems(items, type) {
      const itemsWithImages = await Promise.all(
        items.map(async (item) => {
          try {
            const res = await api.imageApi.getByRelatedId(item[`${type}_id`], type);
            if (res.data && res.data.length > 0) {
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
            common_vendor.index.__f__("error", "at pages/home/home.vue:241", `获取${type}图片失败:`, error);
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
        common_vendor.index.navigateTo({
          url: `/pages/search/search?keyword=${encodeURIComponent(this.searchKeyword)}`
        });
      } else {
        common_vendor.index.showToast({
          title: "请输入搜索内容",
          icon: "none"
        });
      }
    },
    navigateToQA() {
      common_vendor.index.switchTab({
        url: "/pages/qa/qa"
      });
    },
    navigateToMap() {
      common_vendor.index.switchTab({
        url: "/pages/map/map"
      });
    },
    navigateToCommunity() {
      common_vendor.index.switchTab({
        url: "/pages/community/community"
      });
    },
    navigateToFood() {
      common_vendor.index.navigateTo({
        url: "/pages/food/food"
      });
    },
    navigateToSpotDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/spot/detail?id=${id}`
      });
    },
    navigateToShopDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/shop/detail?id=${id}`
      });
    },
    navigateToFoodDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/food/detail?id=${id}`
      });
    },
    navigateToSpotList() {
      common_vendor.index.navigateTo({
        url: "/pages/spot/list"
      });
    },
    navigateToShopList() {
      common_vendor.index.navigateTo({
        url: "/pages/shop/list"
      });
    },
    navigateToFoodList() {
      common_vendor.index.navigateTo({
        url: "/pages/food/list"
      });
    },
    navigateToSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/search/search"
      });
    },
    navigateToDetail(item) {
      if (item.type === "spot") {
        this.navigateToSpotDetail(item.id);
      } else if (item.type === "shop") {
        this.navigateToShopDetail(item.id);
      } else if (item.type === "food") {
        this.navigateToFoodDetail(item.id);
      }
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.banners, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.o(($event) => $options.navigateToDetail(item), index),
        c: index
      };
    }),
    b: common_vendor.o((...args) => $options.navigateToSearch && $options.navigateToSearch(...args)),
    c: $data.searchKeyword,
    d: common_vendor.o((...args) => $options.onSearchInput && $options.onSearchInput(...args)),
    e: common_vendor.o((...args) => $options.onSearchConfirm && $options.onSearchConfirm(...args)),
    f: common_vendor.o($options.onSearchConfirm),
    g: common_vendor.p({
      type: "search",
      size: "20",
      color: "#00B4D8"
    }),
    h: common_vendor.p({
      type: "help",
      size: "24",
      color: "#fff"
    }),
    i: common_vendor.o((...args) => $options.navigateToQA && $options.navigateToQA(...args)),
    j: common_vendor.p({
      type: "location",
      size: "24",
      color: "#fff"
    }),
    k: common_vendor.o((...args) => $options.navigateToMap && $options.navigateToMap(...args)),
    l: common_vendor.p({
      type: "person",
      size: "24",
      color: "#fff"
    }),
    m: common_vendor.o((...args) => $options.navigateToCommunity && $options.navigateToCommunity(...args)),
    n: common_vendor.p({
      type: "shop",
      size: "24",
      color: "#fff"
    }),
    o: common_vendor.o((...args) => $options.navigateToFood && $options.navigateToFood(...args)),
    p: common_vendor.o((...args) => $options.navigateToSpotList && $options.navigateToSpotList(...args)),
    q: common_vendor.f($data.spots, (spot, index, i0) => {
      return {
        a: spot.mainImage || "/static/spot-default.jpg",
        b: common_vendor.t(spot.spot_name),
        c: "77b2d0dc-5-" + i0,
        d: common_vendor.t(spot.average_rating || 0),
        e: common_vendor.t(spot.spot_address),
        f: index,
        g: common_vendor.o(($event) => $options.navigateToSpotDetail(spot.spot_id), index)
      };
    }),
    r: common_vendor.p({
      type: "star-filled",
      size: "16",
      color: "#ffb400"
    }),
    s: common_vendor.o((...args) => $options.navigateToShopList && $options.navigateToShopList(...args)),
    t: common_vendor.f($data.shops, (shop, index, i0) => {
      return {
        a: shop.mainImage || "/static/shop-default.jpg",
        b: common_vendor.t(shop.shop_name),
        c: common_vendor.t(shop.experience_type),
        d: common_vendor.t(shop.price_range || "价格待定"),
        e: "77b2d0dc-6-" + i0,
        f: common_vendor.t(shop.average_rating || 0),
        g: index,
        h: common_vendor.o(($event) => $options.navigateToShopDetail(shop.shop_id), index)
      };
    }),
    v: common_vendor.p({
      type: "star-filled",
      size: "16",
      color: "#ffb400"
    }),
    w: common_vendor.o((...args) => $options.navigateToFoodList && $options.navigateToFoodList(...args)),
    x: $data.foods.length > 0
  }, $data.foods.length > 0 ? {
    y: $data.foods[0].mainImage || "/static/food-default.jpg",
    z: common_vendor.t($data.foods[0].food_name),
    A: common_vendor.t($data.foods[0].food_description || "探索景德镇独特的地方美食文化与传统"),
    B: common_vendor.o(($event) => {
      var _a;
      return $options.navigateToFoodDetail((_a = $data.foods[0]) == null ? void 0 : _a.food_id);
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/home.js.map
