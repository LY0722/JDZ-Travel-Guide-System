"use strict";
const common_vendor = require("../../common/vendor.js");
const api = require("../../api.js");
const common_assets = require("../../common/assets.js");
const uniIcons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
const _sfc_main = {
  components: {
    uniIcons
  },
  data() {
    return {
      keyword: "",
      activeTab: "spot",
      searchResults: false,
      spotResults: [],
      shopResults: [],
      foodResults: [],
      hotKeywords: ["陶溪川", "御窑博物馆", "乐天集市", "拉坯体验", "景德镇美食", "瑶里古镇"],
      historyKeywords: [],
      loading: false,
      initialFocus: false
    };
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
        common_vendor.index.showToast({
          title: "请输入搜索内容",
          icon: "none"
        });
        return;
      }
      this.loading = true;
      this.searchResults = true;
      this.activeTab = "spot";
      try {
        const [spotsRes, shopsRes, foodsRes] = await Promise.all([
          api.scenicSpotApi.getAll({ keyword: this.keyword }),
          api.shopApi.getAll({ keyword: this.keyword }),
          api.foodApi.getAll({ keyword: this.keyword })
        ]);
        this.spotResults = await this.processSearchResults(spotsRes.data || [], "spot");
        this.shopResults = await this.processSearchResults(shopsRes.data || [], "shop");
        this.foodResults = await this.processSearchResults(foodsRes.data || [], "food");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/search/search.vue:202", "搜索失败:", error);
        common_vendor.index.showToast({
          title: "搜索失败,请重试",
          icon: "none"
        });
      } finally {
        this.loading = false;
        this.saveToHistory();
      }
    },
    async processSearchResults(items, type) {
      if (!items.length)
        return [];
      const keyword = this.keyword.toLowerCase();
      const filteredItems = items.filter((item) => {
        const nameField = `${type}_name`;
        const descField = `${type}_description`;
        const addressField = type === "food" ? "food_address" : "spot_address";
        return item[nameField] && item[nameField].toLowerCase().includes(keyword) || item[descField] && item[descField].toLowerCase().includes(keyword) || item[addressField] && item[addressField].toLowerCase().includes(keyword);
      });
      const itemsWithImages = await Promise.all(
        filteredItems.map(async (item) => {
          try {
            const res = await api.imageApi.getByRelatedId(item[`${type}_id`], type);
            if (res.data && res.data.length > 0) {
              const mainImage = res.data.find((img) => img.is_main) || res.data[0];
              return {
                ...item,
                mainImage: mainImage.image_url
              };
            }
            return item;
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/search/search.vue:244", `获取${type}图片失败:`, error);
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
      this.keyword = "";
      this.searchResults = false;
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    loadHistory() {
      try {
        const history = common_vendor.index.getStorageSync("searchHistory") || [];
        this.historyKeywords = history;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/search/search.vue:276", "加载搜索历史失败", e);
      }
    },
    saveToHistory() {
      if (!this.keyword.trim())
        return;
      const index = this.historyKeywords.indexOf(this.keyword);
      if (index !== -1) {
        this.historyKeywords.splice(index, 1);
      }
      this.historyKeywords.unshift(this.keyword);
      if (this.historyKeywords.length > 10) {
        this.historyKeywords = this.historyKeywords.slice(0, 10);
      }
      try {
        common_vendor.index.setStorageSync("searchHistory", this.historyKeywords);
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/search/search.vue:300", "保存搜索历史失败", e);
      }
    },
    removeHistoryItem(index) {
      this.historyKeywords.splice(index, 1);
      try {
        common_vendor.index.setStorageSync("searchHistory", this.historyKeywords);
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/search/search.vue:309", "删除搜索历史失败", e);
      }
    },
    clearHistory() {
      this.historyKeywords = [];
      try {
        common_vendor.index.removeStorageSync("searchHistory");
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/search/search.vue:318", "清空搜索历史失败", e);
      }
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
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      type: "search",
      size: "20",
      color: "#999"
    }),
    b: common_vendor.o((...args) => $options.doSearch && $options.doSearch(...args)),
    c: !!$data.initialFocus,
    d: $data.keyword,
    e: common_vendor.o(($event) => $data.keyword = $event.detail.value),
    f: $data.keyword
  }, $data.keyword ? {
    g: common_vendor.o($options.clearSearch),
    h: common_vendor.p({
      type: "clear",
      size: "20",
      color: "#999"
    })
  } : {}, {
    i: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    j: !$data.searchResults && !$data.historyKeywords.length
  }, !$data.searchResults && !$data.historyKeywords.length ? {
    k: common_vendor.f($data.hotKeywords, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: index,
        c: common_vendor.o(($event) => $options.searchByTag(tag), index)
      };
    })
  } : {}, {
    l: !$data.searchResults && $data.historyKeywords.length
  }, !$data.searchResults && $data.historyKeywords.length ? {
    m: common_vendor.o((...args) => $options.clearHistory && $options.clearHistory(...args)),
    n: common_vendor.f($data.historyKeywords, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: common_vendor.o(($event) => $options.removeHistoryItem(index), index),
        c: "6a712e3c-2-" + i0,
        d: index,
        e: common_vendor.o(($event) => $options.searchByTag(item), index)
      };
    }),
    o: common_vendor.p({
      type: "closeempty",
      size: "16",
      color: "#999"
    })
  } : {}, {
    p: $data.searchResults
  }, $data.searchResults ? common_vendor.e({
    q: $data.activeTab === "spot" ? 1 : "",
    r: common_vendor.o(($event) => $options.switchTab("spot")),
    s: $data.activeTab === "shop" ? 1 : "",
    t: common_vendor.o(($event) => $options.switchTab("shop")),
    v: $data.activeTab === "food" ? 1 : "",
    w: common_vendor.o(($event) => $options.switchTab("food")),
    x: $data.activeTab === "spot"
  }, $data.activeTab === "spot" ? common_vendor.e({
    y: common_vendor.f($data.spotResults, (item, k0, i0) => {
      return {
        a: item.mainImage || "/static/spot-default.jpg",
        b: common_vendor.t(item.spot_name),
        c: "6a712e3c-3-" + i0,
        d: common_vendor.t(item.average_rating || 0),
        e: common_vendor.t(item.spot_address),
        f: item.spot_id,
        g: common_vendor.o(($event) => $options.navigateToSpotDetail(item.spot_id), item.spot_id)
      };
    }),
    z: common_vendor.p({
      type: "star-filled",
      size: "14",
      color: "#ffb400"
    }),
    A: !$data.spotResults.length
  }, !$data.spotResults.length ? {
    B: common_assets._imports_0$4
  } : {}) : {}, {
    C: $data.activeTab === "shop"
  }, $data.activeTab === "shop" ? common_vendor.e({
    D: common_vendor.f($data.shopResults, (item, k0, i0) => {
      return {
        a: item.mainImage || "/static/shop-default.jpg",
        b: common_vendor.t(item.shop_name),
        c: common_vendor.t(item.experience_type || "非遗体验"),
        d: common_vendor.t(item.price_range || "价格待定"),
        e: item.shop_id,
        f: common_vendor.o(($event) => $options.navigateToShopDetail(item.shop_id), item.shop_id)
      };
    }),
    E: !$data.shopResults.length
  }, !$data.shopResults.length ? {
    F: common_assets._imports_0$4
  } : {}) : {}, {
    G: $data.activeTab === "food"
  }, $data.activeTab === "food" ? common_vendor.e({
    H: common_vendor.f($data.foodResults, (item, k0, i0) => {
      return {
        a: item.mainImage || "/static/food-default.jpg",
        b: common_vendor.t(item.food_name),
        c: common_vendor.t(item.food_description || "探索景德镇独特的地方美食文化与传统"),
        d: item.food_id,
        e: common_vendor.o(($event) => $options.navigateToFoodDetail(item.food_id), item.food_id)
      };
    }),
    I: !$data.foodResults.length
  }, !$data.foodResults.length ? {
    J: common_assets._imports_0$4
  } : {}) : {}) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/search/search.js.map
