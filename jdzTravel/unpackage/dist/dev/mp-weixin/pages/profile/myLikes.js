"use strict";
const common_vendor = require("../../common/vendor.js");
const api = require("../../api.js");
const _sfc_main = {
  data() {
    return {
      userId: common_vendor.index.getStorageSync("user_id") || null,
      likes: []
    };
  },
  onShow() {
    this.loadLikes();
  },
  methods: {
    async loadLikes() {
      if (!this.userId)
        return;
      try {
        const res = await api.likesApi.getByUser(this.userId);
        this.likes = res.data || [];
      } catch (e) {
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      }
    },
    goDetail(postId) {
      common_vendor.index.navigateTo({ url: `/pages/community/detail?id=${postId}` });
    },
    formatTime(timeStr) {
      if (!timeStr)
        return "";
      const time = new Date(timeStr);
      return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.likes.length === 0
  }, $data.likes.length === 0 ? {} : {}, {
    b: common_vendor.f($data.likes, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: common_vendor.t($options.formatTime(item.created_at)),
        c: item.post_id,
        d: common_vendor.o(($event) => $options.goDetail(item.post_id), item.post_id)
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/myLikes.js.map
