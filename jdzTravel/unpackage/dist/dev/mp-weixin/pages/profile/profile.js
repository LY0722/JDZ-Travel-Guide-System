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
      isLoggedIn: false,
      userInfo: {
        user_id: "",
        username: "",
        avatar_url: "",
        phone: "",
        email: "",
        registration_time: "",
        last_login_time: ""
      },
      userStats: {
        likes: 0,
        posts: 0,
        comments: 0
      }
    };
  },
  onShow() {
    this.checkLoginStatus();
    if (this.isLoggedIn) {
      this.loadUserInfo();
      this.getUserStats();
    }
  },
  methods: {
    checkLoginStatus() {
      try {
        const token = common_vendor.index.getStorageSync("token");
        const userId = common_vendor.index.getStorageSync("user_id");
        this.isLoggedIn = !!token && !!userId;
        if (this.isLoggedIn) {
          const cachedUserInfo = common_vendor.index.getStorageSync("userInfo");
          if (cachedUserInfo) {
            this.userInfo = {
              ...this.userInfo,
              ...cachedUserInfo
            };
          }
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/profile/profile.vue:140", "检查登录状态失败:", e);
        this.isLoggedIn = false;
      }
    },
    async loadUserInfo() {
      try {
        const userId = common_vendor.index.getStorageSync("user_id");
        if (!userId) {
          this.isLoggedIn = false;
          return;
        }
        const res = await api.userApi.getById(userId);
        if (res && res.data) {
          this.userInfo = {
            ...this.userInfo,
            ...res.data,
            registration_time: this.formatDate(res.data.registration_time),
            last_login_time: this.formatDate(res.data.last_login_time)
          };
          common_vendor.index.setStorageSync("userInfo", this.userInfo);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/profile.vue:166", "获取用户信息失败:", error);
        common_vendor.index.showToast({
          title: "获取用户信息失败",
          icon: "none"
        });
      }
    },
    async getUserStats() {
      try {
        const userId = common_vendor.index.getStorageSync("user_id");
        if (!userId)
          return;
        const [likesRes, postsRes, commentsRes] = await Promise.all([
          api.likesApi.getByUser(userId),
          api.userApi.getPosts(userId),
          api.userApi.getComments(userId)
        ]);
        const getCount = (res) => {
          if (Array.isArray(res))
            return res.length;
          if (res && Array.isArray(res.data))
            return res.data.length;
          return 0;
        };
        this.userStats = {
          likes: getCount(likesRes),
          posts: getCount(postsRes),
          comments: getCount(commentsRes)
        };
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/profile.vue:197", "获取用户统计失败:", error);
        common_vendor.index.showToast({
          title: "获取用户统计失败",
          icon: "none"
        });
      }
    },
    formatDate(timestamp) {
      if (!timestamp)
        return "";
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
    },
    handleLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    },
    async handleLogout() {
      try {
        common_vendor.index.removeStorageSync("token");
        common_vendor.index.removeStorageSync("user_id");
        common_vendor.index.removeStorageSync("userInfo");
        this.isLoggedIn = false;
        this.userInfo = {
          user_id: "",
          username: "",
          avatar_url: "",
          phone: "",
          email: "",
          registration_time: "",
          last_login_time: ""
        };
        this.userStats = {
          favorites: 0,
          posts: 0,
          comments: 0
        };
        common_vendor.index.showToast({
          title: "已退出登录",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/profile/profile.vue:242", "退出登录失败:", error);
        common_vendor.index.showToast({
          title: "退出登录失败",
          icon: "none"
        });
      }
    },
    navigateTo(url) {
      if (!this.isLoggedIn && url !== "/pages/login/login") {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url
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
    b: common_vendor.t($data.isLoggedIn ? $data.userInfo.nickname || "未设置昵称" : "登录/注册"),
    c: common_vendor.t($data.userInfo.user_id || "未登录"),
    d: $data.isLoggedIn && $data.userInfo.phone
  }, $data.isLoggedIn && $data.userInfo.phone ? {
    e: common_vendor.t($data.userInfo.phone)
  } : {}, {
    f: common_vendor.t($data.userStats.likes),
    g: common_vendor.o(($event) => $options.navigateTo("/pages/profile/myLikes")),
    h: common_vendor.t($data.userStats.posts),
    i: common_vendor.o(($event) => $options.navigateTo("/pages/profile/myPosts")),
    j: common_vendor.t($data.userStats.comments),
    k: common_vendor.o(($event) => $options.navigateTo("/pages/profile/myComments")),
    l: common_vendor.p({
      type: "compose",
      size: "30",
      color: "#13d8d2"
    }),
    m: common_vendor.o(($event) => $options.navigateTo("/pages/profile/myPosts")),
    n: common_vendor.p({
      type: "heart",
      size: "30",
      color: "#13d8d2"
    }),
    o: common_vendor.o(($event) => $options.navigateTo("/pages/profile/myLikes")),
    p: common_vendor.p({
      type: "chat",
      size: "30",
      color: "#13d8d2"
    }),
    q: common_vendor.o(($event) => $options.navigateTo("/pages/profile/myComments")),
    r: common_vendor.p({
      type: "eye",
      size: "30",
      color: "#13d8d2"
    }),
    s: common_vendor.o(($event) => $options.navigateTo("/pages/profile/browsehistory")),
    t: common_vendor.p({
      type: "person",
      size: "30",
      color: "#13d8d2"
    }),
    v: common_vendor.p({
      type: "arrowright",
      size: "20",
      color: "#999"
    }),
    w: common_vendor.o(($event) => $options.navigateTo("/pages/profile/editProfile")),
    x: common_vendor.p({
      type: "gear",
      size: "30",
      color: "#13d8d2"
    }),
    y: common_vendor.p({
      type: "arrowright",
      size: "20",
      color: "#999"
    }),
    z: common_vendor.o(($event) => $options.navigateTo("/pages/profile/settings")),
    A: common_vendor.p({
      type: "help",
      size: "30",
      color: "#13d8d2"
    }),
    B: common_vendor.p({
      type: "arrowright",
      size: "20",
      color: "#999"
    }),
    C: common_vendor.o(($event) => $options.navigateTo("/pages/profile/feedback")),
    D: $data.isLoggedIn
  }, $data.isLoggedIn ? {
    E: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args))
  } : {
    F: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-dd383ca2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
