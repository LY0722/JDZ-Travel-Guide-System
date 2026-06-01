"use strict";
const common_vendor = require("../../common/vendor.js");
const api = require("../../api.js");
const _sfc_main = {
  data() {
    return {
      userId: common_vendor.index.getStorageSync("user_id") || null,
      form: {
        nickname: "",
        phone: "",
        email: "",
        avatar_url: ""
      },
      defaultAvatar: api.IMAGE_BASE_URL + "/static/default-avatar.png"
    };
  },
  computed: {
    IMAGE_BASE_URL_COMPUTED() {
      return api.IMAGE_BASE_URL;
    }
  },
  onLoad() {
    this.loadProfile();
  },
  methods: {
    async loadProfile() {
      if (!this.userId)
        return;
      try {
        const res = await api.userApi.getById(this.userId);
        this.form = {
          nickname: res.nickname || "",
          phone: res.phone || "",
          email: res.email || "",
          avatar_url: res.avatar_url || ""
        };
      } catch (e) {
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      }
    },
    chooseAvatar() {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          const filePath = res.tempFilePaths[0];
          common_vendor.index.uploadFile({
            url: api.IMAGE_BASE_URL + "/api/user/upload-avatar",
            filePath,
            name: "file",
            header: {
              "Authorization": `Bearer ${common_vendor.index.getStorageSync("token")}`
            },
            success: (uploadRes) => {
              try {
                const data = JSON.parse(uploadRes.data);
                if (data.avatar_url) {
                  this.form.avatar_url = data.avatar_url;
                  common_vendor.index.showToast({ title: "头像上传成功" });
                } else {
                  common_vendor.index.showToast({ title: "上传失败", icon: "none" });
                }
              } catch (e) {
                common_vendor.index.showToast({ title: "上传失败", icon: "none" });
              }
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/profile/editProfile.vue:99", "上传失败:", err);
              common_vendor.index.showToast({ title: "上传失败", icon: "none" });
            }
          });
        }
      });
    },
    async saveProfile() {
      try {
        const currentUser = common_vendor.index.getStorageSync("userInfo");
        const updateData = {
          ...this.form,
          username: currentUser.username,
          // 保留原用户名
          password: currentUser.password
          // 保留原密码
        };
        await api.userApi.update(this.userId, updateData);
        const updatedUser = { ...currentUser, ...this.form };
        common_vendor.index.setStorageSync("userInfo", updatedUser);
        common_vendor.index.showToast({ title: "保存成功" });
        common_vendor.index.navigateBack();
      } catch (e) {
        common_vendor.index.showToast({ title: "保存失败", icon: "none" });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.form.nickname,
    b: common_vendor.o(($event) => $data.form.nickname = $event.detail.value),
    c: $data.form.phone,
    d: common_vendor.o(($event) => $data.form.phone = $event.detail.value),
    e: $data.form.email,
    f: common_vendor.o(($event) => $data.form.email = $event.detail.value),
    g: $data.form.avatar_url ? $data.form.avatar_url.startsWith("http") ? $data.form.avatar_url : _ctx.IMAGE_BASE_URL + $data.form.avatar_url : $data.defaultAvatar,
    h: common_vendor.o((...args) => $options.chooseAvatar && $options.chooseAvatar(...args)),
    i: common_vendor.o((...args) => $options.saveProfile && $options.saveProfile(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4a20362c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/editProfile.js.map
