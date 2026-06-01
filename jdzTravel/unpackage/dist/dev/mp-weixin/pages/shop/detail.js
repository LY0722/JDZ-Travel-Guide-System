"use strict";
const common_vendor = require("../../common/vendor.js");
const api = require("../../api.js");
const Favorite = () => "./favorite.js";
const uniIcons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
const _sfc_main = {
  components: { Favorite, uniIcons },
  data() {
    return {
      shop_id: null,
      loading: true,
      shop: {},
      images: [],
      shopId: null
    };
  },
  onLoad(options) {
    this.shopId = options.id;
    this.loadShopDetail();
  },
  methods: {
    async loadShopDetail() {
      this.loading = true;
      try {
        const shopRes = await api.shopApi.getById(this.shopId);
        this.shop = shopRes;
        const imageRes = await api.imageApi.getByRelatedId(this.shopId, "shop");
        this.images = imageRes.data || [];
        if (this.images.length > 0) {
          const mainImage = this.images.find((img) => img.is_main) || this.images[0];
          this.shop.mainImage = mainImage.image_url;
        }
      } catch (error) {
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        this.loading = false;
      }
    },
    makePhoneCall() {
      if (this.shop.contact_phone) {
        common_vendor.index.makePhoneCall({ phoneNumber: this.shop.contact_phone });
      }
    },
    handleBooking() {
      common_vendor.index.showToast({
        title: "预约成功",
        icon: "success",
        duration: 2e3
      });
    },
    previewImage(index) {
      const urls = this.images.map((img) => img.image_url);
      common_vendor.index.previewImage({ current: index, urls });
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  const _component_Favorite = common_vendor.resolveComponent("Favorite");
  (_component_uni_icons + _component_Favorite)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.loading
  }, $data.loading ? {
    b: common_vendor.p({
      type: "spinner-cycle",
      size: "32",
      color: "#00B4D8"
    })
  } : common_vendor.e({
    c: $data.shop.mainImage || "/static/shop-default.jpg",
    d: common_vendor.t($data.shop.shop_name),
    e: common_vendor.t($data.shop.experience_type),
    f: common_vendor.t($data.shop.price_range),
    g: common_vendor.p({
      type: "info",
      size: "16",
      color: "#00B4D8"
    }),
    h: common_vendor.t($data.shop.shop_address),
    i: common_vendor.t($data.shop.contact_phone || "暂无电话"),
    j: common_vendor.t($data.shop.business_hours || "09:00-18:00"),
    k: common_vendor.t($data.shop.price_range || "价格待定"),
    l: common_vendor.p({
      type: "paperclip",
      size: "16",
      color: "#00B4D8"
    }),
    m: common_vendor.t($data.shop.shop_description || "暂无详细介绍"),
    n: $data.images.length > 0
  }, $data.images.length > 0 ? {
    o: common_vendor.p({
      type: "image",
      size: "16",
      color: "#00B4D8"
    }),
    p: common_vendor.f($data.images, (img, index, i0) => {
      return {
        a: index,
        b: img.image_url,
        c: common_vendor.o(($event) => $options.previewImage(index), index)
      };
    })
  } : {}, {
    q: "favorite-" + $data.shop.shop_id,
    r: common_vendor.p({
      relatedId: $data.shop.shop_id,
      relatedType: "shop"
    }),
    s: $data.shop.contact_phone
  }, $data.shop.contact_phone ? {
    t: common_vendor.p({
      type: "phone",
      size: "20",
      color: "#666"
    }),
    v: common_vendor.o((...args) => $options.makePhoneCall && $options.makePhoneCall(...args))
  } : {}, {
    w: common_vendor.o((...args) => $options.handleBooking && $options.handleBooking(...args))
  }));
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/shop/detail.js.map
