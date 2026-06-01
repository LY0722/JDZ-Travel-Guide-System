"use strict";
const common_vendor = require("./common/vendor.js");
const API_BASE_URL = "http://localhost:3000/api";
const IMAGE_BASE_URL = "http://localhost:3000";
function buildQueryString(params) {
  return Object.keys(params).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join("&");
}
const request = (method, url, data = null) => {
  return new Promise((resolve, reject) => {
    if ((method === "GET" || method === "DELETE") && data) {
      const queryString = buildQueryString(data);
      url += (url.includes("?") ? "&" : "?") + queryString;
      data = null;
    }
    common_vendor.index.request({
      url: API_BASE_URL + url,
      method,
      data: method === "GET" || method === "DELETE" ? null : data,
      header: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${common_vendor.index.getStorageSync("token")}`
      },
      success: (res) => {
        var _a;
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject({
            statusCode: res.statusCode,
            message: ((_a = res.data) == null ? void 0 : _a.message) || "请求失败",
            data: res.data
          });
        }
      },
      fail: (err) => {
        reject({
          statusCode: 0,
          message: "网络请求失败",
          error: err
        });
      }
    });
  });
};
const scenicSpotApi = {
  getAll: (params = {}) => request("GET", "/scenic-spot", params),
  getById: (id) => request("GET", `/scenic-spot/${id}`),
  create: (data) => request("POST", "/scenic-spot", data),
  update: (id, data) => request("PUT", `/scenic-spot/${id}`, data),
  delete: (id) => request("DELETE", `/scenic-spot/${id}`),
  getImages: (id) => request("GET", `/images?related_id=${id}&related_type=spot`),
  getRatings: (id) => request("GET", `/ratings?related_id=${id}&related_type=spot`),
  addRating: (id, data) => request("POST", "/ratings", { ...data, related_id: id, related_type: "spot" })
};
const shopApi = {
  getAll: (params = {}) => request("GET", "/shop", params),
  getById: (id) => request("GET", `/shop/${id}`),
  create: (data) => request("POST", "/shop", data),
  update: (id, data) => request("PUT", `/shop/${id}`, data),
  delete: (id) => request("DELETE", `/shop/${id}`),
  getImages: (id) => request("GET", `/images?related_id=${id}&related_type=shop`),
  getRatings: (id) => request("GET", `/ratings?related_id=${id}&related_type=shop`),
  addRating: (id, data) => request("POST", "/ratings", { ...data, related_id: id, related_type: "shop" })
};
const foodApi = {
  getAll: (params = {}) => request("GET", "/food", params),
  getById: (id) => request("GET", `/food/${id}`),
  create: (data) => request("POST", "/food", data),
  update: (id, data) => request("PUT", `/food/${id}`, data),
  delete: (id) => request("DELETE", `/food/${id}`),
  getImages: (id) => request("GET", `/images?related_id=${id}&related_type=food`),
  getRatings: (id) => request("GET", `/ratings?related_id=${id}&related_type=food`),
  addRating: (id, data) => request("POST", "/ratings", { ...data, related_id: id, related_type: "food" })
};
const userApi = {
  getAll: (params = {}) => request("GET", "/user", params),
  getById: (id) => request("GET", `/user/${id}`),
  create: (data) => request("POST", "/user", data),
  update: (id, data) => request("PUT", `/user/${id}`, data),
  delete: (id) => request("DELETE", `/user/${id}`),
  getFavorites: (userId) => request("GET", `/favorites?user_id=${userId}`),
  getBrowseHistory: (userId) => request("GET", `/browse-history?user_id=${userId}`),
  getPosts: (userId) => request("GET", `/posts?user_id=${userId}`),
  getComments: (userId) => request("GET", `/comments?user_id=${userId}`),
  getRatings: (userId) => request("GET", `/ratings?user_id=${userId}`),
  getRoutePlans: (userId) => request("GET", `/route-plans?user_id=${userId}`),
  getQARecords: (userId) => request("GET", `/qa-records?user_id=${userId}`)
};
const browseHistoryApi = {
  getAll: (params = {}) => request("GET", "/browse-history", params),
  getById: (id) => request("GET", `/browse-history/${id}`),
  create: (data) => request("POST", "/browse-history", data),
  delete: (id) => request("DELETE", `/browse-history/${id}`),
  getByUser: (userId) => request("GET", `/browse-history?user_id=${userId}`)
  // 保留这一行
};
const commentsApi = {
  getAll: (params = {}) => request("GET", "/comments", params),
  getById: (id) => request("GET", `/comments/${id}`),
  create: (data) => request("POST", "/comments", data),
  delete: (id) => request("DELETE", `/comments/${id}`),
  getByPost: (postId) => request("GET", `/comments?post_id=${postId}`),
  getByUser: (userId) => request("GET", `/comments?user_id=${userId}`)
  // 保留这一行
};
const favoritesApi = {
  getAll: (params = {}) => request("GET", "/favorites", params),
  getById: (id) => request("GET", `/favorites/${id}`),
  create: (data) => request("POST", "/favorites", data),
  delete: (id) => request("DELETE", `/favorites/${id}`),
  getByUser: (userId) => request("GET", `/favorites?user_id=${userId}`),
  // 修改检查收藏的方法，使用现有端点
  checkFavorite: (userId, relatedId, relatedType) => request("GET", "/favorites", {
    user_id: userId,
    related_id: relatedId,
    related_type: relatedType
  })
};
const postsApi = {
  getAll: (params) => request("GET", "/posts", params),
  getById: (id) => request("GET", `/posts/${id}`),
  create: (data) => request("POST", "/posts", data),
  update: (id, data) => request("PUT", `/posts/${id}`, data),
  delete: (id) => request("DELETE", `/posts/${id}`),
  getImages: (postId) => request("GET", `/post-images?post_id=${postId}`),
  getByUser: (userId) => request("GET", `/posts/user/${userId}`)
};
const imageApi = {
  getByRelatedId: (id, type) => request("GET", `/images?related_id=${id}&related_type=${type}`),
  upload: (data) => request("POST", "/images", data),
  delete: (id) => request("DELETE", `/images/${id}`),
  uploadPostImage: (postId, imageUrl) => request("POST", "/post-images", { post_id: postId, image_url: imageUrl }),
  deletePostImage: (id) => request("DELETE", `/post-images/${id}`),
  setMainImage: (imageId, isMain) => request("PUT", `/images/${imageId}`, { is_main: isMain })
};
const likesApi = {
  getByPost: (postId, userId) => request("GET", `/likes?post_id=${postId}&user_id=${userId}`),
  addLike: (postId, userId) => request("POST", "/likes", { post_id: postId, user_id: userId }),
  deleteLike: (postId, userId) => request("DELETE", `/likes?post_id=${postId}&user_id=${userId}`),
  getByUser: (userId) => request("GET", `/likes/user?user_id=${userId}`)
  // 新增
};
const postImagesApi = {
  upload: ({ postId, filePath }) => {
    return new Promise((resolve, reject) => {
      common_vendor.index.uploadFile({
        url: API_BASE_URL + "/post-images",
        filePath,
        name: "file",
        formData: { post_id: postId },
        header: {
          // 如果你的后端没做鉴权，可以去掉 Authorization
          "Authorization": `Bearer ${common_vendor.index.getStorageSync("token")}`
        },
        success: (res) => {
          try {
            const data = JSON.parse(res.data);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(data);
            } else {
              reject(data);
            }
          } catch (e) {
            reject(e);
          }
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },
  getByPost: (postId) => request("GET", `/post-images?post_id=${postId}`),
  delete: (id) => request("DELETE", `/post-images/${id}`)
};
exports.IMAGE_BASE_URL = IMAGE_BASE_URL;
exports.browseHistoryApi = browseHistoryApi;
exports.commentsApi = commentsApi;
exports.favoritesApi = favoritesApi;
exports.foodApi = foodApi;
exports.imageApi = imageApi;
exports.likesApi = likesApi;
exports.postImagesApi = postImagesApi;
exports.postsApi = postsApi;
exports.scenicSpotApi = scenicSpotApi;
exports.shopApi = shopApi;
exports.userApi = userApi;
//# sourceMappingURL=../.sourcemap/mp-weixin/api.js.map
