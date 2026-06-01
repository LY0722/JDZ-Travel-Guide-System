"use strict";
const common_vendor = require("../../common/vendor.js");
const api = require("../../api.js");
const uniIcons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
const _sfc_main = {
  components: {
    uniIcons
  },
  data() {
    return {
      userInfo: {},
      favoritesCount: 0,
      historyCount: 0,
      postsCount: 0,
      recentPosts: []
    };
  },
  filters: {
    truncate(value, length) {
      if (!value)
        return "";
      if (value.length > length) {
        return value.substring(0, length) + "...";
      }
      return value;
    },
    formatTime(value) {
      if (!value)
        return "";
      const date = new Date(value);
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  },
  async onShow() {
    await this.loadUserData();
  },
  methods: {
    async loadUserData() {
      const userId = common_vendor.index.getStorageSync("user_id");
      if (!userId) {
        common_vendor.index.redirectTo({ url: "/pages/login/login" });
        return;
      }
      common_vendor.index.showLoading({ title: "加载中..." });
      try {
        const userRes = await api.userApi.getById(userId);
        this.userInfo = userRes.data || userRes;
        const favRes = await api.favoritesApi.getByUser(userId);
        this.favoritesCount = (favRes.data || favRes).length;
        const historyRes = await api.browseHistoryApi.getByUser(userId);
        this.historyCount = (historyRes.data || historyRes).length;
        const postsRes = await api.postsApi.getByUser(userId);
        const posts = postsRes.data || postsRes;
        this.postsCount = posts.length;
        this.recentPosts = posts.slice(0, 2);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/success.vue:149", "加载用户数据失败:", error);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    navigateTo(url) {
      common_vendor.index.navigateTo({ url });
    },
    handleLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗?",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.clearStorageSync();
            common_vendor.index.reLaunch({ url: "/pages/login/login" });
          }
        }
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
    a: $data.userInfo.avatar_url || "/static/default-avatar.png",
    b: common_vendor.t($data.userInfo.username || "未设置昵称"),
    c: common_vendor.t($data.userInfo.phone || "未绑定手机"),
    d: common_vendor.t($data.favoritesCount),
    e: common_vendor.o(($event) => $options.navigateTo("/pages/profile/favorites")),
    f: common_vendor.t($data.historyCount),
    g: common_vendor.o(($event) => $options.navigateTo("/pages/profile/history")),
    h: common_vendor.t($data.postsCount),
    i: common_vendor.o(($event) => $options.navigateTo("/pages/profile/posts")),
    j: common_vendor.p({
      type: "gear",
      size: "24",
      color: "#13d8d2"
    }),
    k: common_vendor.o(($event) => $options.navigateTo("/pages/profile/settings")),
    l: common_vendor.p({
      type: "heart",
      size: "24",
      color: "#FF6B6B"
    }),
    m: common_vendor.o(($event) => $options.navigateTo("/pages/profile/favorites")),
    n: common_vendor.p({
      type: "eye",
      size: "24",
      color: "#4ECDC4"
    }),
    o: common_vendor.o(($event) => $options.navigateTo("/pages/profile/history")),
    p: common_vendor.p({
      type: "map",
      size: "24",
      color: "#45B7D1"
    }),
    q: common_vendor.o(($event) => $options.navigateTo("/pages/profile/plans")),
    r: common_vendor.o(($event) => $options.navigateTo("/pages/profile/posts")),
    s: common_vendor.f($data.recentPosts, (post, index, i0) => {
      return {
        a: common_vendor.t(post.title),
        b: common_vendor.t(post.content | _ctx.truncate(50)),
        c: common_vendor.t(post.created_at | _ctx.formatTime),
        d: "4a27f8f9-4-" + i0,
        e: common_vendor.t(post.view_count),
        f: "4a27f8f9-5-" + i0,
        g: common_vendor.t(post.like_count),
        h: "4a27f8f9-6-" + i0,
        i: common_vendor.t(post.comment_count),
        j: index,
        k: common_vendor.o(($event) => $options.navigateTo(`/pages/community/post?id=${post.post_id}`), index)
      };
    }),
    t: common_vendor.p({
      type: "eye",
      size: "14",
      color: "#999"
    }),
    v: common_vendor.p({
      type: "heart",
      size: "14",
      color: "#999"
    }),
    w: common_vendor.p({
      type: "chat",
      size: "14",
      color: "#999"
    }),
    x: $data.recentPosts.length === 0
  }, $data.recentPosts.length === 0 ? {
    y: common_vendor.p({
      type: "info",
      size: "20",
      color: "#999"
    })
  } : {}, {
    z: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4a27f8f9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/success.js.map
