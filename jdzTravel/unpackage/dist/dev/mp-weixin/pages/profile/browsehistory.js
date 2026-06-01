"use strict";
const common_vendor = require("../../common/vendor.js");
const api = require("../../api.js");
const _sfc_main = {
  data() {
    return {
      userId: common_vendor.index.getStorageSync("user_id") || null,
      history: []
    };
  },
  onShow() {
    this.loadHistory();
  },
  methods: {
    async loadHistory() {
      if (!this.userId)
        return;
      try {
        const res = await api.browseHistoryApi.getByUser(this.userId);
        this.history = await Promise.all((res.data || []).filter((h) => h.related_type === "post").map(async (h) => {
          let post = {};
          try {
            const postRes = await api.postsApi.getById(h.related_id);
            post = postRes.data || postRes;
          } catch {
          }
          let cover = post.main_image_url || "";
          if (cover && !cover.startsWith("http")) {
            cover = api.IMAGE_BASE_URL + cover;
          }
          if (!cover) {
            cover = api.IMAGE_BASE_URL + "/static/default-avatar.png";
          }
          return {
            ...h,
            title: post.title || "帖子已删除",
            cover
          };
        }));
      } catch (e) {
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      }
    },
    formatTime(timeStr) {
      if (!timeStr)
        return "";
      const time = new Date(timeStr);
      const now = /* @__PURE__ */ new Date();
      const diff = (now - time) / 1e3;
      if (diff < 60)
        return "刚刚";
      if (diff < 3600)
        return `${Math.floor(diff / 60)}分钟前`;
      if (diff < 86400)
        return `${Math.floor(diff / 3600)}小时前`;
      if (diff < 2592e3)
        return `${Math.floor(diff / 86400)}天前`;
      return time.toLocaleDateString();
    },
    goDetail(postId) {
      common_vendor.index.navigateTo({ url: `/pages/community/detail?id=${postId}` });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.history.length === 0
  }, $data.history.length === 0 ? {} : {}, {
    b: common_vendor.f($data.history, (item, k0, i0) => {
      return {
        a: item.cover,
        b: common_vendor.t(item.title),
        c: common_vendor.t($options.formatTime(item.browse_time)),
        d: item.history_id,
        e: common_vendor.o(($event) => $options.goDetail(item.related_id), item.history_id)
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/browsehistory.js.map
