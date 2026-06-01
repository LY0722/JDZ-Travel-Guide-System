"use strict";
const common_vendor = require("../../common/vendor.js");
const api = require("../../api.js");
const Favorite = () => "./favorite.js";
const uniIcons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
const _sfc_main = {
  components: { Favorite, uniIcons },
  data() {
    return {
      food_id: null,
      food: null,
      images: [],
      isFavorite: false,
      // 必须声明
      favoriteId: null
      // 必须声明
    };
  },
  async onLoad(options) {
    const id = options.id;
    if (!id) {
      common_vendor.index.showToast({ title: "参数错误", icon: "none" });
      return;
    }
    try {
      const res = await api.foodApi.getById(id);
      if (!res) {
        common_vendor.index.showToast({ title: "未找到美食", icon: "none" });
        return;
      }
      let food = res;
      try {
        const imageRes = await api.imageApi.getByRelatedId(id, "food");
        if (imageRes.data && imageRes.data.length > 0) {
          const mainImage = imageRes.data.find((img) => img.is_main) || imageRes.data[0];
          food.mainImage = mainImage.image_url;
          this.images = imageRes.data;
        }
      } catch (e) {
      }
      this.food = food;
    } catch (error) {
      common_vendor.index.__f__("error", "at pages/food/detail.vue:109", "加载美食详情失败:", error);
      common_vendor.index.showToast({ title: "加载失败", icon: "none" });
    }
    await this.checkFavorite();
  },
  methods: {
    async checkFavorite() {
      var _a;
      const userId = common_vendor.index.getStorageSync("user_id");
      if (!userId || !this.food) {
        this.isFavorite = false;
        this.favoriteId = null;
        return;
      }
      try {
        const res = await api.favoritesApi.checkFavorite(userId, this.food.food_id, "food");
        const list = ((_a = res.data) == null ? void 0 : _a.data) || res.data || [];
        if (Array.isArray(list) && list.length > 0) {
          this.isFavorite = true;
          this.favoriteId = list[0].favorite_id;
        } else {
          this.isFavorite = false;
          this.favoriteId = null;
        }
      } catch (e) {
        this.isFavorite = false;
        this.favoriteId = null;
      }
    },
    async handleFavorite() {
      const userId = common_vendor.index.getStorageSync("user_id");
      if (!userId) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return;
      }
      if (this.isFavorite) {
        if (!this.favoriteId) {
          common_vendor.index.showToast({ title: "收藏ID无效", icon: "none" });
          return;
        }
        try {
          await api.favoritesApi.delete(this.favoriteId);
          this.isFavorite = false;
          this.favoriteId = null;
          common_vendor.index.showToast({ title: "已取消收藏", icon: "none" });
        } catch (e) {
          common_vendor.index.showToast({ title: "取消失败", icon: "none" });
        }
      } else {
        try {
          const res = await api.favoritesApi.create({
            user_id: userId,
            related_id: this.food.food_id,
            related_type: "food"
          });
          this.isFavorite = true;
          this.favoriteId = res.favorite_id || res.data && res.data.favorite_id;
          common_vendor.index.showToast({ title: "已收藏", icon: "success" });
        } catch (e) {
          common_vendor.index.showToast({ title: "收藏失败", icon: "none" });
        }
      }
    },
    previewImage(index) {
      const urls = this.images.map((img) => img.image_url);
      common_vendor.index.previewImage({
        current: index,
        urls
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
    a: $data.food
  }, $data.food ? common_vendor.e({
    b: $data.images.length > 0
  }, $data.images.length > 0 ? {
    c: common_vendor.f($data.images, (img, idx, i0) => {
      return {
        a: img.image_url,
        b: common_vendor.o(($event) => $options.previewImage(idx), idx),
        c: idx
      };
    })
  } : {
    d: $data.food.mainImage || "/static/food-default.jpg"
  }, {
    e: common_vendor.t($data.food.food_name),
    f: common_vendor.f(5, (i, k0, i0) => {
      return {
        a: i,
        b: "439dd92f-0-" + i0,
        c: common_vendor.p({
          type: "star-filled",
          size: "18",
          color: i <= Math.round($data.food.average_rating) ? "#ffb400" : "#eee"
        })
      };
    }),
    g: common_vendor.t($data.food.average_rating || 0),
    h: common_vendor.p({
      type: "location-filled",
      size: "16",
      color: "#00B4D8"
    }),
    i: common_vendor.t($data.food.food_address),
    j: common_vendor.p({
      type: "time-filled",
      size: "16",
      color: "#00B4D8"
    }),
    k: common_vendor.t($data.food.business_hours || "暂无"),
    l: common_vendor.p({
      type: "money",
      size: "16",
      color: "#FF6B6B"
    }),
    m: common_vendor.t($data.food.price_range || "价格待定"),
    n: common_vendor.t($data.food.food_description || "暂无美食介绍"),
    o: common_vendor.t($data.isFavorite ? "已收藏" : "收藏"),
    p: $data.isFavorite ? 1 : "",
    q: common_vendor.o((...args) => $options.handleFavorite && $options.handleFavorite(...args))
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/food/detail.js.map
