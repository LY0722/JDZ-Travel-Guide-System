"use strict";
const common_vendor = require("../../common/vendor.js");
const api = require("../../api.js");
const _sfc_main = {
  data() {
    return {
      comments: [],
      userId: common_vendor.index.getStorageSync("user_id") || null
    };
  },
  onShow() {
    this.loadComments();
  },
  methods: {
    async loadComments() {
      if (!this.userId)
        return;
      const res = await api.commentsApi.getByUser(this.userId);
      this.comments = res.data || res;
    },
    goDetail(item) {
      common_vendor.index.navigateTo({ url: `/pages/community/detail?id=${item.post_id}` });
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
    a: $data.comments.length === 0
  }, $data.comments.length === 0 ? {} : {}, {
    b: common_vendor.f($data.comments, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.content),
        b: common_vendor.t($options.formatTime(item.created_at)),
        c: item.comment_id,
        d: common_vendor.o(($event) => $options.goDetail(item), item.comment_id)
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/myComments.js.map
