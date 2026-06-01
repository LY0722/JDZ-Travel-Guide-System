"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      orderData: {},
      visitor: {
        name: "",
        phone: "",
        studentId: "",
        idCard: ""
      },
      paymentMethod: "wechat"
    };
  },
  onLoad(options) {
    if (options.data) {
      this.orderData = JSON.parse(decodeURIComponent(options.data));
    }
  },
  methods: {
    selectPayment(method) {
      this.paymentMethod = method;
    },
    submitOrder() {
      if (!this.visitor.name) {
        common_vendor.index.showToast({
          title: "请输入姓名",
          icon: "none"
        });
        return;
      }
      if (!this.visitor.phone || !/^1[3-9]\d{9}$/.test(this.visitor.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return;
      }
      if (this.orderData.ticketName === "学生票" && !this.visitor.studentId) {
        common_vendor.index.showToast({
          title: "请输入学生证号",
          icon: "none"
        });
        return;
      }
      if (this.orderData.ticketName === "儿童/老人票" && !this.visitor.idCard) {
        common_vendor.index.showToast({
          title: "请输入身份证号",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "提交中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.redirectTo({
          url: `/pages/spot/success?orderId=${Math.random().toString(36).substr(2, 10)}`
        });
      }, 1500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.orderData.spotName),
    b: common_vendor.t($data.orderData.ticketName),
    c: common_vendor.t($data.orderData.date),
    d: common_vendor.t($data.orderData.quantity),
    e: common_vendor.t($data.orderData.price),
    f: $data.visitor.name,
    g: common_vendor.o(($event) => $data.visitor.name = $event.detail.value),
    h: $data.visitor.phone,
    i: common_vendor.o(($event) => $data.visitor.phone = $event.detail.value),
    j: $data.orderData.ticketName === "学生票"
  }, $data.orderData.ticketName === "学生票" ? {
    k: $data.visitor.studentId,
    l: common_vendor.o(($event) => $data.visitor.studentId = $event.detail.value)
  } : {}, {
    m: $data.orderData.ticketName === "儿童/老人票"
  }, $data.orderData.ticketName === "儿童/老人票" ? {
    n: $data.visitor.idCard,
    o: common_vendor.o(($event) => $data.visitor.idCard = $event.detail.value)
  } : {}, {
    p: common_assets._imports_0$2,
    q: common_vendor.o(($event) => $options.selectPayment("wechat")),
    r: $data.paymentMethod === "wechat" ? 1 : "",
    s: common_assets._imports_1,
    t: common_vendor.o(($event) => $options.selectPayment("alipay")),
    v: $data.paymentMethod === "alipay" ? 1 : "",
    w: common_vendor.t($data.orderData.totalPrice),
    x: common_vendor.t($data.orderData.totalPrice),
    y: common_vendor.t($data.orderData.totalPrice),
    z: common_vendor.o((...args) => $options.submitOrder && $options.submitOrder(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/spot/confirm.js.map
