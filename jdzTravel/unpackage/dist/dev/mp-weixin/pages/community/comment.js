"use strict";
const common_vendor = require("../../common/vendor.js");
const api = require("../../api.js");
const _sfc_main = {
  props: {
    postId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      comments: [],
      commentContent: "",
      replyContent: "",
      replyTo: null,
      userId: null
    };
  },
  mounted() {
    this.userId = common_vendor.index.getStorageSync("user_id");
    this.loadComments();
  },
  methods: {
    async loadComments() {
      try {
        const res = await api.commentsApi.getByPost(this.postId);
        let comments = res.data || res;
        const userMap = {};
        for (let c of comments) {
          if (!userMap[c.user_id]) {
            userMap[c.user_id] = await api.userApi.getById(c.user_id);
          }
          c.user = userMap[c.user_id];
        }
        const map = {}, roots = [];
        comments.forEach((c) => {
          c.children = [];
          map[c.comment_id] = c;
        });
        comments.forEach((c) => {
          var _a;
          if (c.parent_id) {
            (_a = map[c.parent_id]) == null ? void 0 : _a.children.push(c);
          } else {
            roots.push(c);
          }
        });
        this.comments = roots;
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/community/comment.vue:95", "加载评论失败:", e);
        common_vendor.index.showToast({ title: "加载评论失败", icon: "none" });
      }
    },
    async submitComment() {
      if (!this.commentContent.trim()) {
        common_vendor.index.showToast({ title: "评论内容不能为空", icon: "none" });
        return;
      }
      if (!this.userId) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return;
      }
      try {
        await api.commentsApi.create({
          post_id: this.postId,
          user_id: this.userId,
          content: this.commentContent
        });
        this.commentContent = "";
        await this.loadComments();
        common_vendor.index.showToast({ title: "评论成功", icon: "success" });
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/community/comment.vue:118", "评论失败:", e);
        common_vendor.index.showToast({ title: "评论失败", icon: "none" });
      }
    },
    setReply(comment) {
      this.replyTo = comment;
      this.replyContent = "";
    },
    cancelReply() {
      this.replyTo = null;
      this.replyContent = "";
    },
    async submitReply() {
      if (!this.replyContent.trim()) {
        common_vendor.index.showToast({ title: "回复内容不能为空", icon: "none" });
        return;
      }
      if (!this.userId) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return;
      }
      try {
        await api.commentsApi.create({
          post_id: this.postId,
          user_id: this.userId,
          parent_id: this.replyTo.comment_id,
          content: this.replyContent
        });
        this.replyContent = "";
        this.replyTo = null;
        await this.loadComments();
        common_vendor.index.showToast({ title: "回复成功", icon: "success" });
      } catch (e) {
        common_vendor.index.__f__("error", "at pages/community/comment.vue:151", "回复失败:", e);
        common_vendor.index.showToast({ title: "回复失败", icon: "none" });
      }
    },
    formatTime(timeStr) {
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
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.submitComment && $options.submitComment(...args)),
    b: $data.commentContent,
    c: common_vendor.o(($event) => $data.commentContent = $event.detail.value),
    d: common_vendor.o((...args) => $options.submitComment && $options.submitComment(...args)),
    e: common_vendor.f($data.comments, (comment, k0, i0) => {
      return common_vendor.e({
        a: comment.user.avatar_url || "/static/default-avatar.png",
        b: common_vendor.t(comment.user.username || "瓷都游客"),
        c: common_vendor.t($options.formatTime(comment.created_at)),
        d: common_vendor.t(comment.content),
        e: common_vendor.o(($event) => $options.setReply(comment), comment.comment_id),
        f: comment.children && comment.children.length
      }, comment.children && comment.children.length ? {
        g: common_vendor.f(comment.children, (sub, k1, i1) => {
          return {
            a: sub.user.avatar_url || "/static/default-avatar.png",
            b: common_vendor.t(sub.user.username || "瓷都游客"),
            c: common_vendor.t($options.formatTime(sub.created_at)),
            d: common_vendor.t(sub.content),
            e: sub.comment_id
          };
        })
      } : {}, {
        h: comment.comment_id
      });
    }),
    f: $data.replyTo
  }, $data.replyTo ? {
    g: `回复 @${$data.replyTo.user.username || "瓷都游客"}：`,
    h: common_vendor.o((...args) => $options.submitReply && $options.submitReply(...args)),
    i: $data.replyContent,
    j: common_vendor.o(($event) => $data.replyContent = $event.detail.value),
    k: common_vendor.o((...args) => $options.submitReply && $options.submitReply(...args)),
    l: common_vendor.o((...args) => $options.cancelReply && $options.cancelReply(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ee3fe2f5"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/community/comment.js.map
