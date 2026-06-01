const API_BASE_URL = 'http://localhost:3000/api';
export const IMAGE_BASE_URL = 'http://localhost:3000';

// 替代 URLSearchParams 的工具函数
function buildQueryString(params) {
  return Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

const request = (method, url, data = null) => {
  return new Promise((resolve, reject) => {
    // 处理GET和DELETE请求的查询参数
    if ((method === 'GET' || method === 'DELETE') && data) {
      const queryString = buildQueryString(data);
      url += (url.includes('?') ? '&' : '?') + queryString;
      data = null; // GET/DELETE请求不传body数据
    }

    uni.request({
      url: API_BASE_URL + url,
      method,
      data: method === 'GET' || method === 'DELETE' ? null : data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${uni.getStorageSync('token')}`
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          // 统一错误响应格式
          reject({
            statusCode: res.statusCode,
            message: res.data?.message || '请求失败',
            data: res.data
          });
        }
      },
      fail: (err) => {
        reject({
          statusCode: 0,
          message: '网络请求失败',
          error: err
        });
      }
    });
  });
};


// 景点API
export const scenicSpotApi = {
  getAll: (params = {}) => request('GET', '/scenic-spot', params),
  getById: (id) => request('GET', `/scenic-spot/${id}`),
  create: (data) => request('POST', '/scenic-spot', data),
  update: (id, data) => request('PUT', `/scenic-spot/${id}`, data),
  delete: (id) => request('DELETE', `/scenic-spot/${id}`),
  getImages: (id) => request('GET', `/images?related_id=${id}&related_type=spot`),
  getRatings: (id) => request('GET', `/ratings?related_id=${id}&related_type=spot`),
  addRating: (id, data) => request('POST', '/ratings', { ...data, related_id: id, related_type: 'spot' }),
};

// 体验店API
export const shopApi = {
  getAll: (params = {}) => request('GET', '/shop', params),
  getById: (id) => request('GET', `/shop/${id}`),
  create: (data) => request('POST', '/shop', data),
  update: (id, data) => request('PUT', `/shop/${id}`, data),
  delete: (id) => request('DELETE', `/shop/${id}`),
  getImages: (id) => request('GET', `/images?related_id=${id}&related_type=shop`),
  getRatings: (id) => request('GET', `/ratings?related_id=${id}&related_type=shop`),
  addRating: (id, data) => request('POST', '/ratings', { ...data, related_id: id, related_type: 'shop' }),
};

// 美食API
export const foodApi = {
  getAll: (params = {}) => request('GET', '/food', params),
  getById: (id) => request('GET', `/food/${id}`),
  create: (data) => request('POST', '/food', data),
  update: (id, data) => request('PUT', `/food/${id}`, data),
  delete: (id) => request('DELETE', `/food/${id}`),
  getImages: (id) => request('GET', `/images?related_id=${id}&related_type=food`),
  getRatings: (id) => request('GET', `/ratings?related_id=${id}&related_type=food`),
  addRating: (id, data) => request('POST', '/ratings', { ...data, related_id: id, related_type: 'food' }),
};

// 用户API
export const userApi = {
  getAll: (params = {}) => request('GET', '/user', params),
  getById: (id) => request('GET', `/user/${id}`),
  create: (data) => request('POST', '/user', data),
  update: (id, data) => request('PUT', `/user/${id}`, data),
  delete: (id) => request('DELETE', `/user/${id}`),
  getFavorites: (userId) => request('GET', `/favorites?user_id=${userId}`),
  getBrowseHistory: (userId) => request('GET', `/browse-history?user_id=${userId}`),
  getPosts: (userId) => request('GET', `/posts?user_id=${userId}`),
  getComments: (userId) => request('GET', `/comments?user_id=${userId}`),
  getRatings: (userId) => request('GET', `/ratings?user_id=${userId}`),
  getRoutePlans: (userId) => request('GET', `/route-plans?user_id=${userId}`),
  getQARecords: (userId) => request('GET', `/qa-records?user_id=${userId}`),
};

// 管理员日志API
export const adminLogsApi = {
  getAll: (params = {}) => request('GET', '/admin-logs', params),
  getById: (id) => request('GET', `/admin-logs/${id}`),
  create: (data) => request('POST', '/admin-logs', data),
  delete: (id) => request('DELETE', `/admin-logs/${id}`),
  getByAdminId: (adminId) => request('GET', `/admin-logs?admin_id=${adminId}`),
};

// 浏览历史API
export const browseHistoryApi = {
  getAll: (params = {}) => request('GET', '/browse-history', params),
  getById: (id) => request('GET', `/browse-history/${id}`),
  create: (data) => request('POST', '/browse-history', data),
  delete: (id) => request('DELETE', `/browse-history/${id}`),
  getByUser: (userId) => request('GET', `/browse-history?user_id=${userId}`), // 保留这一行
};

// 评论API
export const commentsApi = {
  getAll: (params = {}) => request('GET', '/comments', params),
  getById: (id) => request('GET', `/comments/${id}`),
  create: (data) => request('POST', '/comments', data),
  delete: (id) => request('DELETE', `/comments/${id}`),
  getByPost: (postId) => request('GET', `/comments?post_id=${postId}`),
  getByUser: (userId) => request('GET', `/comments?user_id=${userId}`), // 保留这一行
};

// 收藏API
export const favoritesApi = {
  getAll: (params = {}) => request('GET', '/favorites', params),
  getById: (id) => request('GET', `/favorites/${id}`),
  create: (data) => request('POST', '/favorites', data),
  delete: (id) => request('DELETE', `/favorites/${id}`),
  getByUser: (userId) => request('GET', `/favorites?user_id=${userId}`),
  // 修改检查收藏的方法，使用现有端点
  checkFavorite: (userId, relatedId, relatedType) => 
    request('GET', '/favorites', {
      user_id: userId,
      related_id: relatedId,
      related_type: relatedType
    })
};

// 帖子API
export const postsApi = {
  getAll: (params) => request('GET', '/posts', params),
  getById: (id) => request('GET', `/posts/${id}`),
  create: (data) => request('POST', '/posts', data),
  update: (id, data) => request('PUT', `/posts/${id}`, data),
  delete: (id) => request('DELETE', `/posts/${id}`),
  getImages: (postId) => request('GET', `/post-images?post_id=${postId}`),getByUser: (userId) => request('GET', `/posts/user/${userId}`)
};

// AI问答记录API
export const qaRecordsApi = {
  getAll: (params = {}) => request('GET', '/qa-records', params),
  getById: (id) => request('GET', `/qa-records/${id}`),
  create: (data) => request('POST', '/qa-records', data),
  delete: (id) => request('DELETE', `/qa-records/${id}`),
  getByUser: (userId) => request('GET', `/qa-records?user_id=${userId}`),
};

// 评分API
export const ratingsApi = {
  getAll: (params = {}) => request('GET', '/ratings', params),
  getById: (id) => request('GET', `/ratings/${id}`),
  create: (data) => request('POST', '/ratings', data),
  delete: (id) => request('DELETE', `/ratings/${id}`),
  getByUser: (userId) => request('GET', `/ratings?user_id=${userId}`),
  getByRelated: (relatedId, relatedType) => 
    request('GET', `/ratings?related_id=${relatedId}&related_type=${relatedType}`),
};

// 路线规划API
export const routePlansApi = {
  getAll: (params = {}) => request('GET', '/route-plans', params),
  getById: (id) => request('GET', `/route-plans/${id}`),
  create: (data) => request('POST', '/route-plans', data),
  delete: (id) => request('DELETE', `/route-plans/${id}`),
  getByUser: (userId) => request('GET', `/route-plans?user_id=${userId}`),
};

// 搜索API
export const searchApi = {
  search: (query, type) => request('POST', '/search', { query, type }),
  searchSpots: (query) => request('POST', '/search', { query, type: 'spot' }),
  searchShops: (query) => request('POST', '/search', { query, type: 'shop' }),
  searchFood: (query) => request('POST', '/search', { query, type: 'food' }),
  searchPosts: (query) => request('POST', '/search', { query, type: 'post' }),
  searchKnowledge: (query) => request('POST', '/search', { query, type: 'ceramic_knowledge' }),
};

// 图片API
export const imageApi = {
  getByRelatedId: (id, type) => request('GET', `/images?related_id=${id}&related_type=${type}`),
  upload: (data) => request('POST', '/images', data),
  delete: (id) => request('DELETE', `/images/${id}`),
  uploadPostImage: (postId, imageUrl) => request('POST', '/post-images', { post_id: postId, image_url: imageUrl }),
  deletePostImage: (id) => request('DELETE', `/post-images/${id}`),
  setMainImage: (imageId, isMain) => request('PUT', `/images/${imageId}`, { is_main: isMain }),
};

// 陶瓷知识API
export const ceramicKnowledgeApi = {
  getAll: (params = {}) => request('GET', '/ceramic-knowledge', params),
  getById: (id) => request('GET', `/ceramic-knowledge/${id}`),
  create: (data) => request('POST', '/ceramic-knowledge', data),
  update: (id, data) => request('PUT', `/ceramic-knowledge/${id}`, data),
  delete: (id) => request('DELETE', `/ceramic-knowledge/${id}`),
  search: (keywords) => request('GET', `/ceramic-knowledge/search?keywords=${keywords}`),
  getByCategory: (category) => request('GET', `/ceramic-knowledge?category=${category}`),
};

export const likesApi = {
  getByPost: (postId, userId) => request('GET', `/likes?post_id=${postId}&user_id=${userId}`),
  addLike: (postId, userId) => request('POST', '/likes', { post_id: postId, user_id: userId }),
  deleteLike: (postId, userId) => request('DELETE', `/likes?post_id=${postId}&user_id=${userId}`),
  getByUser: (userId) => request('GET', `/likes/user?user_id=${userId}`), // 新增
};


export const postImagesApi = {
  upload: ({ postId, filePath }) => {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: API_BASE_URL + '/post-images',
        filePath,
        name: 'file',
        formData: { post_id: postId },
        header: {
          // 如果你的后端没做鉴权，可以去掉 Authorization
          'Authorization': `Bearer ${uni.getStorageSync('token')}`
        },
        success: (res) => {
          try {
            const data = JSON.parse(res.data)
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(data)
            } else {
              reject(data)
            }
          } catch (e) {
            reject(e)
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
  getByPost: (postId) => request('GET', `/post-images?post_id=${postId}`),
  delete: (id) => request('DELETE', `/post-images/${id}`)
}

export default {
  scenicSpotApi,
  shopApi,
  foodApi,
  userApi,
  adminLogsApi,
  browseHistoryApi,
  commentsApi,
  favoritesApi,
  postsApi,
  qaRecordsApi,
  ratingsApi,
  routePlansApi,
  searchApi,
  imageApi,
  ceramicKnowledgeApi,
  likesApi,
  postImagesApi // 添加这一行
};