"use strict";
const common_vendor = require("../../common/vendor.js");
const api = require("../../api.js");
const _sfc_main = {
  data() {
    return {
      posts: [],
      userId: common_vendor.index.getStorageSync("user_id") || null
    };
  },
  onShow() {
    this.loadPosts();
  },
  methods: {
    async loadPosts() {
      if (!this.userId)
        return;
      const res = await api.postsApi.getByUser(this.userId);
      this.posts = res.data || res;
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
    a: $data.posts.length === 0
  }, $data.posts.length === 0 ? {} : {}, {
    b: common_vendor.f($data.posts, (post, k0, i0) => {
      return {
        a: common_vendor.t(post.title),
        b: common_vendor.t($options.formatTime(post.created_at)),
        c: post.post_id,
        d: common_vendor.o(($event) => $options.goDetail(post.post_id), post.post_id)
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/myPosts.js.map
