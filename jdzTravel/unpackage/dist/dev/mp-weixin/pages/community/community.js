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
      posts: [],
      page: 1,
      pageSize: 10,
      hasMore: true,
      loading: false,
      userId: null
    };
  },
  onShow() {
    this.userId = common_vendor.index.getStorageSync("user_id");
    this.page = 1;
    this.hasMore = true;
    this.posts = [];
    this.loadPosts();
  },
  methods: {
    fullImageUrl(url) {
      if (!url)
        return "";
      if (url.startsWith("http"))
        return url;
      return api.IMAGE_BASE_URL + url;
    },
    onImgError(e, img) {
      common_vendor.index.__f__("error", "at pages/community/community.vue:105", "图片加载失败:", img.image_url, "实际src:", this.fullImageUrl(img.image_url), e);
    },
    onImgLoad(e, img) {
    },
    async loadPosts() {
      if (this.loading || !this.hasMore)
        return;
      this.loading = true;
      try {
        const res = await api.postsApi.getAll({
          page: this.page,
          limit: this.pageSize,
          order: "created_at",
          sort: "desc"
        });
        const posts = await Promise.all(res.data.map(async (post) => {
          let user = {};
          try {
            const userRes = await api.userApi.getById(post.user_id);
            user = userRes;
          } catch (error) {
          }
          let images = [];
          try {
            const imgRes = await api.postsApi.getImages(post.post_id);
            images = Array.isArray(imgRes.data) ? imgRes.data : [];
          } catch (error) {
          }
          let likeInfo = { like_count: 0, is_liked: false };
          try {
            if (this.userId) {
              likeInfo = await api.likesApi.getByPost(post.post_id, this.userId);
            }
          } catch (error) {
          }
          let comment_count = 0;
          try {
            const commentRes = await api.commentsApi.getByPost(post.post_id);
            comment_count = Array.isArray(commentRes) ? commentRes.filter((c) => !c.parent_id).length : 0;
          } catch (error) {
          }
          return {
            ...post,
            user,
            images,
            like_count: likeInfo.like_count || post.like_count || 0,
            isLiked: likeInfo.is_liked || false,
            comment_count,
            view_count: post.view_count || 0
          };
        }));
        if (this.page === 1) {
          this.posts = posts;
        } else {
          this.posts = [...this.posts, ...posts];
        }
        this.hasMore = posts.length >= this.pageSize;
        this.page += 1;
      } catch (error) {
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        this.loading = false;
      }
    },
    loadMore() {
      this.loadPosts();
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
      const urls = images.map((img) => img.image_url);
      common_vendor.index.previewImage({
        current: urls[current],
        urls
      });
    },
    navigateToPost() {
      if (!this.userId) {
        common_vendor.index.showToast({
          title: "请先登录",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/community/post"
      });
    },
    navigateToPostDetail(postId) {
      common_vendor.index.navigateTo({
        url: `/pages/community/detail?id=${postId}`
      });
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
      type: "plus",
      size: "20",
      color: "#fff"
    }),
    b: common_vendor.o((...args) => $options.navigateToPost && $options.navigateToPost(...args)),
    c: common_vendor.f($data.posts, (post, k0, i0) => {
      return common_vendor.e({
        a: post.user.avatar_url || "/static/default-avatar.png",
        b: common_vendor.t(post.user.nickname || post.user.username || "瓷都游客"),
        c: common_vendor.t($options.formatTime(post.created_at)),
        d: common_vendor.t(post.title),
        e: common_vendor.t(post.content),
        f: post.images && post.images.length > 0
      }, post.images && post.images.length > 0 ? {
        g: common_vendor.f(post.images.slice(0, 3), (img, idx, i1) => {
          return {
            a: idx,
            b: $options.fullImageUrl(img.image_url),
            c: common_vendor.o(($event) => $options.previewImage(post.images, idx), idx),
            d: common_vendor.o((e) => $options.onImgError(e, img), idx),
            e: common_vendor.o((e) => $options.onImgLoad(e, img), idx)
          };
        })
      } : {}, {
        h: "44c4c9d0-1-" + i0,
        i: common_vendor.t(post.view_count || 0),
        j: "44c4c9d0-2-" + i0,
        k: common_vendor.p({
          type: "heart",
          size: "16",
          color: post.isLiked ? "#ff6b6b" : "#666"
        }),
        l: common_vendor.t(post.like_count || 0),
        m: "44c4c9d0-3-" + i0,
        n: common_vendor.t(post.comment_count || 0),
        o: post.post_id,
        p: common_vendor.o(($event) => $options.navigateToPostDetail(post.post_id), post.post_id)
      });
    }),
    d: common_vendor.p({
      type: "eye",
      size: "16",
      color: "#666"
    }),
    e: common_vendor.p({
      type: "chat",
      size: "16",
      color: "#666"
    }),
    f: $data.hasMore && !$data.loading
  }, $data.hasMore && !$data.loading ? {
    g: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  } : !$data.hasMore && $data.posts.length > 0 ? {} : !$data.loading && $data.posts.length === 0 ? {} : {}, {
    h: !$data.hasMore && $data.posts.length > 0,
    i: !$data.loading && $data.posts.length === 0,
    j: $data.loading
  }, $data.loading ? {
    k: common_vendor.p({
      type: "spinner-cycle",
      size: "16",
      color: "#999"
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/community/community.js.map
