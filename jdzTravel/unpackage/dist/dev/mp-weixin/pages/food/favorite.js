"use strict";
const common_vendor = require("../../common/vendor.js");
const api = require("../../api.js");
const _sfc_main = {
  props: {
    relatedId: { type: [String, Number], required: true },
    relatedType: { type: String, required: true }
  },
  data() {
    return {
      isFavorite: false,
      favoriteId: null,
      checking: false,
      currentRelatedId: null,
      debugInfo: []
      // 用于存储调试信息
    };
  },
  watch: {
    relatedId: {
      immediate: true,
      async handler(newVal) {
        this.addDebugLog(`relatedId变化: ${newVal} (原值: ${this.currentRelatedId})`);
        if (newVal !== this.currentRelatedId) {
          this.addDebugLog("检测到新的relatedId，重置状态");
          this.isFavorite = false;
          this.favoriteId = null;
          this.currentRelatedId = newVal;
          await this.checkFavorite();
        }
      }
    }
  },
  methods: {
    addDebugLog(message) {
      const timestamp = (/* @__PURE__ */ new Date()).toISOString().substr(11, 8);
      this.debugInfo.push(`[${timestamp}] ${message}`);
    },
    async checkFavorite() {
      if (this.checking)
        return;
      this.checking = true;
      const userId = common_vendor.index.getStorageSync("user_id");
      if (!userId) {
        this.isFavorite = false;
        this.favoriteId = null;
        this.checking = false;
        return;
      }
      try {
        const res = await api.favoritesApi.checkFavorite(
          userId,
          this.relatedId,
          this.relatedType
        );
        const list = res.data || [];
        this.isFavorite = list.length > 0;
        this.favoriteId = this.isFavorite ? list[0].favorite_id : null;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/food/favorite.vue:72", "检查收藏状态失败:", e);
        this.isFavorite = false;
        this.favoriteId = null;
      } finally {
        this.checking = false;
      }
    },
    async toggleFavorite() {
      this.addDebugLog("--- 开始切换收藏状态 ---");
      this.addDebugLog("当前状态:", {
        isFavorite: this.isFavorite,
        favoriteId: this.favoriteId,
        relatedId: this.relatedId,
        userId: common_vendor.index.getStorageSync("user_id")
      });
      const userId = common_vendor.index.getStorageSync("user_id");
      if (!userId) {
        this.addDebugLog("操作中止: 用户未登录");
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return;
      }
      if (this.isFavorite) {
        if (!this.favoriteId) {
          this.addDebugLog("操作中止: 无效的favoriteId");
          common_vendor.index.showToast({ title: "收藏ID无效", icon: "none" });
          return;
        }
        try {
          this.addDebugLog(`尝试取消收藏，favoriteId=${this.favoriteId}`);
          const response = await api.favoritesApi.delete(this.favoriteId);
          this.addDebugLog("取消收藏API响应:", JSON.stringify(response));
          if (response && response.success !== false) {
            this.isFavorite = false;
            this.favoriteId = null;
            this.addDebugLog("状态更新: isFavorite=false, favoriteId=null");
            common_vendor.index.showToast({ title: "已取消收藏", icon: "none" });
          } else {
            throw new Error((response == null ? void 0 : response.message) || "取消收藏失败");
          }
        } catch (e) {
          this.addDebugLog("取消收藏失败:", e.message);
          common_vendor.index.__f__("error", "at pages/food/favorite.vue:119", e);
          common_vendor.index.showToast({ title: "取消失败: " + (e.message || "未知错误"), icon: "none" });
        }
      } else {
        try {
          this.addDebugLog("尝试添加收藏", {
            user_id: userId,
            related_id: this.relatedId,
            related_type: this.relatedType
          });
          const res = await api.favoritesApi.create({
            user_id: userId,
            related_id: this.relatedId,
            related_type: this.relatedType
          });
          this.addDebugLog("添加收藏API响应:", JSON.stringify(res));
          this.isFavorite = true;
          this.favoriteId = res.favorite_id || res.data && res.data.favorite_id;
          this.addDebugLog(`状态更新: isFavorite=true, favoriteId=${this.favoriteId}`);
          common_vendor.index.showToast({ title: "已收藏", icon: "success" });
        } catch (e) {
          this.addDebugLog("添加收藏失败:", e.message);
          common_vendor.index.__f__("error", "at pages/food/favorite.vue:145", e);
          common_vendor.index.showToast({ title: "收藏失败: " + (e.message || "未知错误"), icon: "none" });
        }
      }
      this.addDebugLog("--- 切换收藏状态完成 ---");
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
      type: $data.isFavorite ? "heart-filled" : "heart",
      size: "28",
      color: $data.isFavorite ? "#ff6b6b" : "#666"
    }),
    b: common_vendor.t($data.isFavorite ? "已收藏" : "收藏"),
    c: common_vendor.o((...args) => $options.toggleFavorite && $options.toggleFavorite(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-adba5f87"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/food/favorite.js.map
