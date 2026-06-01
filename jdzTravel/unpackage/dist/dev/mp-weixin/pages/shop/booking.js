"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    const currentDate = this.getDate();
    return {
      shop: {
        id: 1,
        name: "传统拉坯体验馆",
        image: "/static/shop1.jpg",
        type: "拉坯体验",
        rating: 4.9
      },
      projects: [
        { name: "基础拉坯体验", price: "¥80", value: 80 },
        { name: "进阶拉坯体验", price: "¥120", value: 120 },
        { name: "拉坯+上釉全流程", price: "¥150", value: 150 }
      ],
      projectIndex: 0,
      date: currentDate,
      time: "10:00",
      number: 1,
      contact: "",
      phone: "",
      remark: ""
    };
  },
  computed: {
    startDate() {
      return this.getDate("start");
    },
    endDate() {
      return this.getDate("end");
    },
    totalPrice() {
      return this.projects[this.projectIndex].value * this.number;
    }
  },
  onLoad(options) {
    options.id;
  },
  methods: {
    getDate(type) {
      const date = /* @__PURE__ */ new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      if (type === "start") {
        year = year;
        month = month;
        day = day;
      } else if (type === "end") {
        year = year + 1;
      }
      month = month > 9 ? month : "0" + month;
      day = day > 9 ? day : "0" + day;
      return `${year}-${month}-${day}`;
    },
    bindProjectChange(e) {
      this.projectIndex = e.detail.value;
    },
    bindDateChange(e) {
      this.date = e.detail.value;
    },
    bindTimeChange(e) {
      this.time = e.detail.value;
    },
    increaseNumber() {
      this.number++;
    },
    decreaseNumber() {
      if (this.number > 1) {
        this.number--;
      }
    },
    submitBooking() {
      if (!this.contact) {
        common_vendor.index.showToast({
          title: "请输入联系人姓名",
          icon: "none"
        });
        return;
      }
      if (!this.phone) {
        common_vendor.index.showToast({
          title: "请输入联系电话",
          icon: "none"
        });
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(this.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号码",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "提交中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "预约成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }, 2e3);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.shop.image,
    b: common_vendor.t($data.shop.name),
    c: common_vendor.t($data.shop.type),
    d: common_vendor.t($data.shop.rating),
    e: common_vendor.t($data.projects[$data.projectIndex].name),
    f: common_vendor.t($data.projects[$data.projectIndex].price),
    g: common_vendor.o((...args) => $options.bindProjectChange && $options.bindProjectChange(...args)),
    h: $data.projectIndex,
    i: $data.projects,
    j: common_vendor.t($data.date),
    k: $data.date,
    l: $options.startDate,
    m: $options.endDate,
    n: common_vendor.o((...args) => $options.bindDateChange && $options.bindDateChange(...args)),
    o: common_vendor.t($data.time),
    p: $data.time,
    q: common_vendor.o((...args) => $options.bindTimeChange && $options.bindTimeChange(...args)),
    r: common_vendor.o((...args) => $options.decreaseNumber && $options.decreaseNumber(...args)),
    s: common_vendor.t($data.number),
    t: common_vendor.o((...args) => $options.increaseNumber && $options.increaseNumber(...args)),
    v: $data.contact,
    w: common_vendor.o(($event) => $data.contact = $event.detail.value),
    x: $data.phone,
    y: common_vendor.o(($event) => $data.phone = $event.detail.value),
    z: $data.remark,
    A: common_vendor.o(($event) => $data.remark = $event.detail.value),
    B: common_vendor.t($options.totalPrice),
    C: common_vendor.o((...args) => $options.submitBooking && $options.submitBooking(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/shop/booking.js.map
