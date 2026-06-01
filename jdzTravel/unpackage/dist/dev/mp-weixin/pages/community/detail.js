"use strict";
const common_vendor = require("../../common/vendor.js");
const api = require("../../api.js");
const uniIcons = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-icons/uni-icons.js";
const Comment = () => "./comment.js";
const _sfc_main = {
  components: { Comment, uniIcons },
  data() {
    return {
      postId: "",
      post: null,
      userId: common_vendor.index.getStorageSync("user_id") || null
    };
  },
  onLoad(options) {
    this.postId = options.id;
    if (!this.postId) {
      common_vendor.index.showToast({ title: "参数错误", icon: "none" });
      return;
    }
    this.loadPostDetail();
    if (this.userId) {
      api.browseHistoryApi.create({
        user_id: this.userId,
        related_id: this.postId,
        related_type: "post"
      }).catch(() => {
      });
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
    formatTime(timeStr) {
      if (!timeStr)
        return "";
      const time = new Date(timeStr);
      const now = /* @__PURE__ */ new Date();
      const diff = (now - time) / 1e3;
      if (diff < 60)
        return "刚刚";
      if (diff < 3600)
        return `${Math.floor(diff / 60)}分钟前`;
      if (diff < 86400)
        return `${Math.floor(diff / 3600)}小时前`;
      if (diff < 2592e3)
        return `${Math.floor(diff / 86400)}天前`;
      return time.toLocaleDateString();
    },
    previewImage(images, current) {
      const urls = images.map((img) => this.fullImageUrl(img.image_url));
      common_vendor.index.previewImage({
        current: urls[current],
        urls
      });
    },
    async toggleLike() {
      if (!this.userId) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return;
      }
      if (!this.post)
        return;
      try {
        if (this.post.is_liked) {
          await api.likesApi.deleteLike(this.postId, this.userId);
          this.post.is_liked = false;
          this.post.like_count = Math.max(0, (this.post.like_count || 1) - 1);
        } else {
          await api.likesApi.addLike(this.postId, this.userId);
          this.post.is_liked = true;
          this.post.like_count = (this.post.like_count || 0) + 1;
        }
      } catch (e) {
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      }
    },
    async loadPostDetail() {
      try {
        const res = await api.postsApi.getById(this.postId);
        const post = res.data || res;
        let user = {};
        try {
          user = await api.userApi.getById(post.user_id);
        } catch {
        }
        let images = [];
        try {
          const imgRes = await api.postsApi.getImages(post.post_id);
          images = imgRes.data || [];
        } catch {
        }
        let likeInfo = { like_count: 0, is_liked: false };
        try {
          likeInfo = await api.likesApi.getByPost(this.postId, this.userId);
        } catch {
        }
        let comment_count = 0;
        try {
          const commentRes = await api.commentsApi.getByPost(post.post_id);
          comment_count = Array.isArray(commentRes) ? commentRes.filter((c) => !c.parent_id).length : 0;
        } catch {
        }
        this.post = { ...post, user, images, ...likeInfo, comment_count };
      } catch (error) {
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      }
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  const _component_Comment = common_vendor.resolveComponent("Comment");
  (_component_uni_icons + _component_Comment)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.post
  }, $data.post ? common_vendor.e({
    b: $data.post.user.avatar_url || "/static/default-avatar.png",
    c: common_vendor.t($data.post.user.username || "瓷都游客"),
    d: common_vendor.t($options.formatTime($data.post.created_at)),
    e: common_vendor.t($data.post.title),
    f: common_vendor.t($data.post.content),
    g: $data.post.images && $data.post.images.length > 0
  }, $data.post.images && $data.post.images.length > 0 ? {
    h: common_vendor.f($data.post.images, (img, idx, i0) => {
      return {
        a: idx,
        b: $options.fullImageUrl(img.image_url),
        c: common_vendor.o(($event) => $options.previewImage($data.post.images, idx), idx)
      };
    })
  } : {}, {
    i: common_vendor.p({
      type: "eye",
      size: "16",
      color: "#666"
    }),
    j: common_vendor.t($data.post.view_count || 0),
    k: common_vendor.p({
      type: "heart",
      size: "16",
      color: $data.post.is_liked ? "#ff6b6b" : "#666"
    }),
    l: common_vendor.t($data.post.like_count || 0),
    m: common_vendor.o((...args) => $options.toggleLike && $options.toggleLike(...args)),
    n: common_vendor.p({
      postId: $data.postId
    }),
    o: common_vendor.t($data.post.comment_count || 0)
  }) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/community/detail.js.map
