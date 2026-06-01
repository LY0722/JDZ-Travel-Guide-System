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
      phone: "",
      password: "",
      showPassword: false
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async handleLogin() {
      if (!this.phone) {
        common_vendor.index.showToast({ title: "请输入手机号", icon: "none" });
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return;
      }
      if (!this.password) {
        common_vendor.index.showToast({ title: "请输入密码", icon: "none" });
        return;
      }
      if (this.password.length < 6) {
        common_vendor.index.showToast({ title: "密码长度不能少于6位", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "登录中..." });
      try {
        const res = await api.userApi.getAll();
        const userList = res.data || [];
        const user = userList.find((u) => u.phone === this.phone);
        if (!user) {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "账号不存在", icon: "none" });
          return;
        }
        if (user.password !== this.password) {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "密码错误", icon: "none" });
          return;
        }
        common_vendor.index.setStorageSync("token", "user-token-" + user.user_id);
        common_vendor.index.setStorageSync("user_id", user.user_id);
        common_vendor.index.setStorageSync("userInfo", user);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "登录成功", icon: "success" });
        setTimeout(() => {
          common_vendor.index.switchTab({ url: "/pages/profile/profile" });
        }, 1500);
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/login/login.vue:128", "登录失败:", error);
        common_vendor.index.showToast({
          title: "登录失败: " + (error.message || "未知错误"),
          icon: "none"
        });
      }
    },
    navigateTo(url) {
      common_vendor.index.navigateTo({ url });
    },
    loginWithWeChat() {
      common_vendor.index.showToast({ title: "微信登录功能暂未实现", icon: "none" });
    },
    loginWithQQ() {
      common_vendor.index.showToast({ title: "QQ登录功能暂未实现", icon: "none" });
    },
    loginWithWeibo() {
      common_vendor.index.showToast({ title: "微博登录功能暂未实现", icon: "none" });
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      type: "phone",
      size: "20",
      color: "#999"
    }),
    b: $data.phone,
    c: common_vendor.o(($event) => $data.phone = $event.detail.value),
    d: common_vendor.p({
      type: "locked",
      size: "20",
      color: "#999"
    }),
    e: $data.showPassword ? "text" : "password",
    f: $data.password,
    g: common_vendor.o(($event) => $data.password = $event.detail.value),
    h: common_vendor.o($options.togglePasswordVisibility),
    i: common_vendor.p({
      type: $data.showPassword ? "eye-filled" : "eye",
      size: "20",
      color: "#999"
    }),
    j: common_vendor.o(($event) => $options.navigateTo("/pages/login/forgotPassword")),
    k: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    l: common_vendor.o(($event) => $options.navigateTo("/pages/login/register")),
    m: common_vendor.p({
      type: "weixin",
      size: "40",
      color: "#09BB07"
    }),
    n: common_vendor.o((...args) => $options.loginWithWeChat && $options.loginWithWeChat(...args)),
    o: common_vendor.p({
      type: "qq",
      size: "40",
      color: "#12B7F5"
    }),
    p: common_vendor.o((...args) => $options.loginWithQQ && $options.loginWithQQ(...args)),
    q: common_vendor.p({
      type: "weibo",
      size: "40",
      color: "#E6162D"
    }),
    r: common_vendor.o((...args) => $options.loginWithWeibo && $options.loginWithWeibo(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
