"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  methods: {
    clearCache() {
      common_vendor.index.clearStorageSync();
      common_vendor.index.showToast({ title: "缓存已清除" });
    },
    checkUpdate() {
      common_vendor.index.showToast({ title: "已是最新版本" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.clearCache && $options.clearCache(...args)),
    b: common_vendor.o((...args) => $options.checkUpdate && $options.checkUpdate(...args)),
    c: common_assets._imports_0$1
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-eeefe5cd"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/settings.js.map
