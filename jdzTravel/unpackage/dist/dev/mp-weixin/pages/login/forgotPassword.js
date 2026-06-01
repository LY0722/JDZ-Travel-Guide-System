"use strict";
const common_vendor = require("../../common/vendor.js");
const uniIcons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
const _sfc_main = {
  components: {
    uniIcons
  },
  data() {
    return {
      phone: "",
      verifyCode: "",
      newPassword: "",
      showPassword: false,
      countdown: 0,
      canGetCode: true
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async getVerifyCode() {
      if (!this.canGetCode)
        return;
      if (!this.phone) {
        common_vendor.index.showToast({
          title: "请输入手机号",
          icon: "none"
        });
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "发送中..."
      });
      try {
        setTimeout(() => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "验证码已发送",
            icon: "success"
          });
          this.countdown = 60;
          this.canGetCode = false;
          this.startCountdown();
        }, 1500);
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "发送失败: " + (error.message || "未知错误"),
          icon: "none"
        });
      }
    },
    startCountdown() {
      const timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(timer);
          this.canGetCode = true;
        }
      }, 1e3);
    },
    async handleSubmit() {
      if (!this.phone) {
        common_vendor.index.showToast({
          title: "请输入手机号",
          icon: "none"
        });
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return;
      }
      if (!this.verifyCode) {
        common_vendor.index.showToast({
          title: "请输入验证码",
          icon: "none"
        });
        return;
      }
      if (!this.newPassword) {
        common_vendor.index.showToast({
          title: "请输入新密码",
          icon: "none"
        });
        return;
      }
      if (this.newPassword.length < 6 || this.newPassword.length > 20) {
        common_vendor.index.showToast({
          title: "密码长度应为6-20位",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "提交中..."
      });
      try {
        setTimeout(() => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "密码修改成功",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        }, 2e3);
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "修改失败: " + (error.message || "未知错误"),
          icon: "none"
        });
      }
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
      type: "email",
      size: "24",
      color: "#13d8d2"
    }),
    e: $data.verifyCode,
    f: common_vendor.o(($event) => $data.verifyCode = $event.detail.value),
    g: common_vendor.t($data.countdown > 0 ? `${$data.countdown}s后重试` : "获取验证码"),
    h: common_vendor.o((...args) => $options.getVerifyCode && $options.getVerifyCode(...args)),
    i: $data.canGetCode ? "#00B4D8" : "#999",
    j: common_vendor.p({
      type: "locked",
      size: "24",
      color: "#13d8d2"
    }),
    k: $data.showPassword ? "text" : "password",
    l: $data.newPassword,
    m: common_vendor.o(($event) => $data.newPassword = $event.detail.value),
    n: common_vendor.o($options.togglePasswordVisibility),
    o: common_vendor.p({
      type: $data.showPassword ? "eye" : "eye-slash",
      size: "24",
      color: "#999"
    }),
    p: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9771209e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/forgotPassword.js.map
