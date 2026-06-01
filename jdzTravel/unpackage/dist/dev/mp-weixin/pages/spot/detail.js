"use strict";
const common_vendor = require("../../common/vendor.js");
const api = require("../../api.js");
const Favorite = () => "./favorite.js";
const uniIcons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
const _sfc_main = {
  components: { Favorite, uniIcons },
  data() {
    return {
      id: null,
      spot: {
        spot_id: null,
        spot_name: "",
        spot_description: "",
        spot_address: "",
        opening_hours: "",
        ticket_price: null,
        phone: "",
        longitude: null,
        latitude: null,
        average_rating: 0,
        images: [],
        features: []
      },
      markers: [],
      isFavorite: false,
      favoriteId: null
    };
  },
  onLoad(options) {
    this.id = options.id;
    this.loadSpotDetail();
  },
  methods: {
    async loadSpotDetail() {
      try {
        common_vendor.index.showLoading({ title: "加载中..." });
        const spotRes = await api.scenicSpotApi.getById(this.id);
        this.spot = {
          ...this.spot,
          ...spotRes,
          // 确保数值类型正确
          ticket_price: parseFloat(spotRes.ticket_price) || 0,
          average_rating: parseFloat(spotRes.average_rating) || 0,
          longitude: parseFloat(spotRes.longitude),
          latitude: parseFloat(spotRes.latitude)
        };
        const imagesRes = await api.imageApi.getByRelatedId(this.id, "spot");
        this.spot.images = imagesRes.data || [];
        this.markers = [{
          id: 0,
          latitude: this.spot.latitude,
          longitude: this.spot.longitude,
          title: this.spot.spot_name,
          iconPath: "/static/marker.png"
        }];
        await this.checkFavorite();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/spot/detail.vue:159", "加载景点详情失败:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
      await this.checkFavorite();
    },
    async checkFavorite() {
      var _a;
      const userId = common_vendor.index.getStorageSync("user_id");
      if (!userId) {
        this.isFavorite = false;
        this.favoriteId = null;
        return;
      }
      try {
        const res = await api.favoritesApi.checkFavorite(userId, this.id, "spot");
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
            related_id: this.id,
            related_type: "spot"
          });
          this.isFavorite = true;
          this.favoriteId = res.favorite_id || res.data && res.data.favorite_id;
          common_vendor.index.showToast({ title: "已收藏", icon: "success" });
        } catch (e) {
          common_vendor.index.showToast({ title: "收藏失败", icon: "none" });
        }
      }
    },
    async toggleFavorite() {
      try {
        const userId = common_vendor.index.getStorageSync("userId");
        if (!userId) {
          common_vendor.index.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        if (this.isFavorite) {
          const favRes = await api.favoritesApi.getByUser(userId);
          const favorite = favRes.data.find(
            (item) => item.related_id == this.id && item.related_type === "spot"
          );
          if (favorite) {
            await api.favoritesApi.delete(favorite.favorite_id);
          }
        } else {
          await api.favoritesApi.create({
            user_id: userId,
            related_id: this.id,
            related_type: "spot"
          });
        }
        this.isFavorite = !this.isFavorite;
        common_vendor.index.showToast({
          title: this.isFavorite ? "已收藏" : "已取消收藏",
          icon: "none"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/spot/detail.vue:260", "收藏操作失败:", error);
        common_vendor.index.showToast({
          title: "操作失败",
          icon: "none"
        });
      }
    },
    shareSpot() {
      common_vendor.index.showActionSheet({
        itemList: ["分享给好友", "分享到朋友圈", "复制链接"],
        success: (res) => {
          common_vendor.index.showToast({
            title: "分享成功",
            icon: "success"
          });
        }
      });
    },
    openMap() {
      common_vendor.index.openLocation({
        latitude: this.spot.latitude,
        longitude: this.spot.longitude,
        name: this.spot.spot_name,
        address: this.spot.spot_address,
        success: () => {
          common_vendor.index.__f__("log", "at pages/spot/detail.vue:288", "打开地图成功");
        }
      });
    },
    navigateToPay() {
      common_vendor.index.navigateTo({
        url: `/pages/spot/pay?id=${this.spot.spot_id}&name=${this.spot.spot_name}&price=${this.spot.ticket_price || 0}`
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
    a: common_vendor.f($data.spot.images, (image, index, i0) => {
      return {
        a: image.image_url,
        b: index
      };
    }),
    b: common_vendor.t($data.spot.spot_name),
    c: common_vendor.t($data.spot.average_rating || 0),
    d: common_vendor.p({
      type: "star-filled",
      size: "16",
      color: "#ffb400"
    }),
    e: common_vendor.p({
      type: "location-filled",
      size: "16",
      color: "#00B4D8"
    }),
    f: common_vendor.t($data.spot.spot_address),
    g: common_vendor.p({
      type: "time-filled",
      size: "16",
      color: "#00B4D8"
    }),
    h: common_vendor.t($data.spot.opening_hours || "暂无信息"),
    i: common_vendor.p({
      type: "money",
      size: "16",
      color: "#00B4D8"
    }),
    j: common_vendor.t($data.spot.ticket_price ? `¥${$data.spot.ticket_price}` : "免费"),
    k: $data.spot.phone
  }, $data.spot.phone ? {
    l: common_vendor.p({
      type: "phone-filled",
      size: "16",
      color: "#00B4D8"
    }),
    m: common_vendor.t($data.spot.phone)
  } : {}, {
    n: common_vendor.o((...args) => $options.openMap && $options.openMap(...args)),
    o: $data.spot.latitude,
    p: $data.spot.longitude,
    q: $data.markers,
    r: common_vendor.t($data.spot.spot_description || "暂无景点描述"),
    s: $data.spot.features && $data.spot.features.length > 0
  }, $data.spot.features && $data.spot.features.length > 0 ? {
    t: common_vendor.f($data.spot.features, (feature, index, i0) => {
      return {
        a: "30ba5e0b-5-" + i0,
        b: common_vendor.t(feature),
        c: index
      };
    }),
    v: common_vendor.p({
      type: "checkmarkempty",
      size: "16",
      color: "#4ECDC4"
    })
  } : {}, {
    w: common_vendor.p({
      type: $data.isFavorite ? "heart-filled" : "heart",
      size: "26",
      color: $data.isFavorite ? "#ff6b6b" : "#00B4D8"
    }),
    x: common_vendor.t($data.isFavorite ? "已收藏" : "收藏"),
    y: common_vendor.o((...args) => $options.handleFavorite && $options.handleFavorite(...args)),
    z: common_vendor.p({
      type: "wallet",
      size: "26",
      color: "#fff"
    }),
    A: common_vendor.o((...args) => $options.navigateToPay && $options.navigateToPay(...args)),
    B: common_vendor.p({
      type: "redo",
      size: "26",
      color: "#00B4D8"
    }),
    C: common_vendor.o((...args) => $options.shareSpot && $options.shareSpot(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/spot/detail.js.map
