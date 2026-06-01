"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      orderId: ""
    };
  },
  onLoad(options) {
    if (options.orderId) {
      this.orderId = options.orderId;
    }
  },
  methods: {
    viewOrder() {
      common_vendor.index.navigateTo({
        url: "/pages/order/detail?id=" + this.orderId
      });
    },
    backToHome() {
      common_vendor.index.switchTab({
        url: "/pages/home/home"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$3,
    b: common_vendor.t($data.orderId),
    c: common_assets._imports_1$1,
    d: common_vendor.o((...args) => $options.viewOrder && $options.viewOrder(...args)),
    e: common_vendor.o((...args) => $options.backToHome && $options.backToHome(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/spot/success.js.map
