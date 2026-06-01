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
      spot: {
        spot_id: null,
        spot_name: "",
        spot_address: "",
        opening_hours: "",
        ticket_price: null,
        mainImage: ""
      },
      tickets: [
        {
          id: 1,
          name: "成人票",
          desc: "18周岁(含)以上",
          price: 95,
          originalPrice: 120,
          tag: "立减25元"
        },
        {
          id: 2,
          name: "学生票",
          desc: "全日制大中小学生(不含研究生)凭有效学生证",
          price: 50,
          originalPrice: 60,
          tag: "特惠"
        },
        {
          id: 3,
          name: "儿童/老人票",
          desc: "1.2米(含)-1.5米(含)儿童/60周岁(含)以上老人凭身份证",
          price: 45,
          tag: "优惠"
        }
      ],
      dates: [],
      selectedIndex: 0,
      selectedDateIndex: 0,
      quantity: 1
    };
  },
  computed: {
    selectedTicket() {
      return this.tickets[this.selectedIndex];
    },
    selectedDate() {
      return this.dates[this.selectedDateIndex];
    },
    totalPrice() {
      const ticketPrice = this.selectedDate.price || this.selectedTicket.price;
      return ticketPrice * this.quantity;
    }
  },
  async onLoad(options) {
    if (options.id) {
      await this.loadSpotDetail(options.id);
    }
    this.initDates();
  },
  methods: {
    async loadSpotDetail(id) {
      try {
        common_vendor.index.showLoading({ title: "加载中..." });
        const spotRes = await api.scenicSpotApi.getById(id);
        this.spot = {
          ...this.spot,
          ...spotRes,
          ticket_price: parseFloat(spotRes.ticket_price) || 0
        };
        const imagesRes = await api.imageApi.getByRelatedId(id, "spot");
        if (imagesRes.data && imagesRes.data.length > 0) {
          const mainImage = imagesRes.data.find((img) => img.is_main) || imagesRes.data[0];
          this.spot.mainImage = mainImage.image_url;
        }
        if (this.spot.ticket_price > 0) {
          this.tickets[0].price = this.spot.ticket_price;
          this.tickets[0].originalPrice = Math.round(this.spot.ticket_price * 1.2);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/spot/pay.vue:195", "加载景点详情失败:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    initDates() {
      const weekMap = ["日", "一", "二", "三", "四", "五", "六"];
      const today = /* @__PURE__ */ new Date();
      const dates = [];
      for (let i = 0; i < 15; i++) {
        const date = /* @__PURE__ */ new Date();
        date.setDate(today.getDate() + i);
        const week = "周" + weekMap[date.getDay()];
        const day = `${date.getMonth() + 1}月${date.getDate()}日`;
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const price = isWeekend ? Math.round(this.tickets[0].price * 1.1) : null;
        dates.push({
          date,
          week,
          day,
          price
        });
      }
      this.dates = dates;
    },
    selectTicket(index) {
      this.selectedIndex = index;
    },
    selectDate(index) {
      this.selectedDateIndex = index;
    },
    increaseQuantity() {
      this.quantity++;
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    // 新增的预订处理方法
    handleConfirmOrder() {
      const validateResult = this.validateOrderInfo();
      if (!validateResult.isValid) {
        common_vendor.index.showToast({
          title: validateResult.message,
          icon: "none",
          duration: 2e3
        });
        return;
      }
      common_vendor.index.showModal({
        title: "提示",
        content: "恭喜您预订成功！",
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            ({
              spotId: this.spot.spot_id,
              spotName: this.spot.spot_name,
              ticketId: this.selectedTicket.id,
              ticketName: this.selectedTicket.name,
              date: this.selectedDate.day,
              price: this.selectedDate.price || this.selectedTicket.price,
              quantity: this.quantity,
              totalPrice: this.totalPrice
            });
            common_vendor.index.navigateTo({
              // url: `/pages/spot/confirm?data=${encodeURIComponent(JSON.stringify(orderInfo))}`
            });
          }
        }
      });
    },
    // 信息校验方法
    validateOrderInfo() {
      const errors = [];
      if (!this.spot.spot_id || !this.spot.spot_name) {
        errors.push("景点信息不完整");
      }
      if (this.selectedIndex === void 0) {
        errors.push("请选择门票类型");
      }
      if (this.selectedDateIndex === void 0) {
        errors.push("请选择游玩日期");
      }
      if (this.quantity <= 0) {
        errors.push("请选择购票数量");
      }
      if (errors.length > 0) {
        return { isValid: false, message: errors.join("，") };
      }
      return { isValid: true, message: "" };
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.spot.spot_name),
    b: common_vendor.p({
      type: "location-filled",
      size: "16",
      color: "#00B4D8"
    }),
    c: common_vendor.t($data.spot.spot_address),
    d: $data.spot.mainImage || "/static/spot-default.jpg",
    e: common_vendor.f($data.dates, (date, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(date.week),
        b: common_vendor.t(date.day),
        c: date.price
      }, date.price ? {
        d: common_vendor.t($data.spot.ticket_price ? `¥${$data.spot.ticket_price}` : "免费")
      } : {
        e: common_vendor.t($data.spot.ticket_price ? `¥${$data.spot.ticket_price}` : "免费")
      }, {
        f: index,
        g: common_vendor.o(($event) => $options.selectDate(index), index),
        h: $data.selectedDateIndex === index ? 1 : ""
      });
    }),
    f: common_vendor.o((...args) => $options.decreaseQuantity && $options.decreaseQuantity(...args)),
    g: $data.quantity <= 1 ? 1 : "",
    h: common_vendor.t($data.quantity),
    i: common_vendor.o((...args) => $options.increaseQuantity && $options.increaseQuantity(...args)),
    j: common_vendor.t($data.spot.opening_hours || "08:00-17:30(最晚入园17:00)"),
    k: common_vendor.t($data.spot.ticket_price ? `¥${$data.spot.ticket_price}` : "免费"),
    l: common_vendor.o((...args) => $options.handleConfirmOrder && $options.handleConfirmOrder(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/spot/pay.js.map
