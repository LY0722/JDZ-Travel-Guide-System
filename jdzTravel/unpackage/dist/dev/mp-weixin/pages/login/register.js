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
      username: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      agreed: false
    };
  },
  computed: {
    canRegister() {
      return this.phone && this.username && this.password && this.confirmPassword && this.agreed;
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
    handleAgreementChange(e) {
      this.agreed = e.detail.value.length > 0;
    },
    async handleRegister() {
      if (!this.phone) {
        common_vendor.index.showToast({ title: "请输入手机号", icon: "none" });
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return;
      }
      if (!this.username) {
        common_vendor.index.showToast({ title: "请输入昵称", icon: "none" });
        return;
      }
      if (!this.password) {
        common_vendor.index.showToast({ title: "请输入密码", icon: "none" });
        return;
      }
      if (this.password.length < 6 || this.password.length > 20) {
        common_vendor.index.showToast({ title: "密码长度应为6-20位", icon: "none" });
        return;
      }
      if (this.password !== this.confirmPassword) {
        common_vendor.index.showToast({ title: "两次输入的密码不一致", icon: "none" });
        return;
      }
      if (!this.agreed) {
        common_vendor.index.showToast({ title: "请先同意用户协议和隐私政策", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "注册中..." });
      try {
        const res = await api.userApi.create({
          username: this.username,
          // 用户名
          password: this.password,
          nickname: this.username,
          // 昵称，这里用和用户名一样的值，也可单独加输入框
          avatar_url: "",
          // 头像，默认空
          phone: this.phone,
          email: ""
        });
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("log", "at pages/login/register.vue:124", "注册接口返回:", res);
        if (res.user_id || res.data && res.data.user_id || res.code === 0 || res.code === 200) {
          common_vendor.index.showToast({ title: "注册成功", icon: "success" });
          common_vendor.index.setStorageSync("user_id", res.user_id || res.data && res.data.user_id);
          setTimeout(() => {
            common_vendor.index.switchTab({ url: "/pages/profile/profile" });
          }, 1200);
        } else {
          common_vendor.index.__f__("log", "at pages/login/register.vue:132", "注册失败返回:", res);
          common_vendor.index.showToast({ title: res.msg || res.error || "注册失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("log", "at pages/login/register.vue:137", "注册接口异常:", error);
        common_vendor.index.showToast({ title: "注册失败: " + (error.message || "未知错误"), icon: "none" });
      }
    },
    navigateTo(url) {
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
  return {
    a: common_vendor.p({
      type: "phone",
      size: "24",
      color: "#13d8d2"
    }),
    b: $data.phone,
    c: common_vendor.o(($event) => $data.phone = $event.detail.value),
    d: common_vendor.p({
      type: "person",
      size: "24",
      color: "#13d8d2"
    }),
    e: $data.username,
    f: common_vendor.o(($event) => $data.username = $event.detail.value),
    g: common_vendor.p({
      type: "locked",
      size: "24",
      color: "#13d8d2"
    }),
    h: $data.showPassword ? "text" : "password",
    i: $data.password,
    j: common_vendor.o(($event) => $data.password = $event.detail.value),
    k: common_vendor.o($options.togglePasswordVisibility),
    l: common_vendor.p({
      type: $data.showPassword ? "eye" : "eye-slash",
      size: "24",
      color: "#999"
    }),
    m: common_vendor.p({
      type: "locked",
      size: "24",
      color: "#13d8d2"
    }),
    n: $data.showConfirmPassword ? "text" : "password",
    o: $data.confirmPassword,
    p: common_vendor.o(($event) => $data.confirmPassword = $event.detail.value),
    q: common_vendor.o($options.toggleConfirmPasswordVisibility),
    r: common_vendor.p({
      type: $data.showConfirmPassword ? "eye" : "eye-slash",
      size: "24",
      color: "#999"
    }),
    s: $data.agreed,
    t: common_vendor.o(($event) => $options.navigateTo("/pages/login/userAgreement")),
    v: common_vendor.o(($event) => $options.navigateTo("/pages/login/privacyPolicy")),
    w: common_vendor.o((...args) => $options.handleAgreementChange && $options.handleAgreementChange(...args)),
    x: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args)),
    y: !$options.canRegister,
    z: common_vendor.o(($event) => $options.navigateTo("/pages/login/login"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-838b72c9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/register.js.map
