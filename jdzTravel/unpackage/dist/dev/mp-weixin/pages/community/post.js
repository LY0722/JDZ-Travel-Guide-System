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
      postForm: {
        title: "",
        content: "",
        images: []
      },
      userId: ""
    };
  },
  onShow() {
    this.userId = common_vendor.index.getStorageSync("user_id");
  },
  computed: {
    canSubmit() {
      return this.postForm.title.trim() && this.postForm.content.trim();
    }
  },
  methods: {
    fullImageUrl(url) {
      if (!url)
        return "";
      if (url.startsWith("http"))
        return url;
      return api.IMAGE_BASE_URL + url;
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 9 - this.postForm.images.length,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          res.tempFilePaths.forEach((path) => {
            this.postForm.images.push(path);
          });
        }
      });
    },
    deleteImage(index) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这张图片吗？",
        success: (res) => {
          if (res.confirm) {
            this.postForm.images.splice(index, 1);
          }
        }
      });
    },
    async submitPost() {
      const userId = this.userId || common_vendor.index.getStorageSync("user_id");
      if (!userId) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录后再发布帖子",
          confirmText: "去登录",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateTo({ url: "/pages/login/login" });
            }
          }
        });
        return;
      }
      if (!this.canSubmit)
        return;
      common_vendor.index.showLoading({ title: "发布中...", mask: true });
      try {
        const postRes = await api.postsApi.create({
          user_id: userId,
          title: this.postForm.title,
          content: this.postForm.content
        });
        if (!postRes.post_id)
          throw new Error("帖子创建失败，未返回post_id");
        const postId = postRes.post_id;
        let imageIds = [];
        if (this.postForm.images.length > 0) {
          const uploadPromises = this.postForm.images.map(
            (filePath) => api.postImagesApi.upload({ postId, filePath })
          );
          const uploadResults = await Promise.all(uploadPromises);
          imageIds = uploadResults.map((res) => res.image_id);
          if (imageIds.length > 0) {
            await api.postsApi.update(postId, { main_image_id: imageIds[0] });
          }
        }
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "发布成功",
          icon: "success",
          duration: 2e3
        });
        setTimeout(() => common_vendor.index.navigateBack(), 2e3);
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: error.message || "发布失败，请重试",
          icon: "none",
          duration: 3e3
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
  return common_vendor.e({
    a: common_vendor.p({
      type: "arrowleft",
      size: "24",
      color: "#333"
    }),
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: common_vendor.o((...args) => $options.submitPost && $options.submitPost(...args)),
    d: !$options.canSubmit ? 1 : "",
    e: $data.postForm.title,
    f: common_vendor.o(($event) => $data.postForm.title = $event.detail.value),
    g: common_vendor.t($data.postForm.title.length),
    h: $data.postForm.content,
    i: common_vendor.o(($event) => $data.postForm.content = $event.detail.value),
    j: common_vendor.t($data.postForm.content.length),
    k: common_vendor.f($data.postForm.images, (image, index, i0) => {
      return {
        a: $options.fullImageUrl(image),
        b: "407b9209-1-" + i0,
        c: common_vendor.o(($event) => $options.deleteImage(index), image),
        d: image
      };
    }),
    l: common_vendor.p({
      type: "closeempty",
      size: "16",
      color: "#fff"
    }),
    m: $data.postForm.images.length < 9
  }, $data.postForm.images.length < 9 ? {
    n: common_vendor.p({
      type: "plusempty",
      size: "32",
      color: "#999"
    }),
    o: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {}, {
    p: common_vendor.p({
      type: "info",
      size: "14",
      color: "#999"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/community/post.js.map
