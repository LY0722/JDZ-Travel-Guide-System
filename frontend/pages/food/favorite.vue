<template>
  <view class="favorite-btn" @click="toggleFavorite">
    <uni-icons :type="isFavorite ? 'heart-filled' : 'heart'" size="28" :color="isFavorite ? '#ff6b6b' : '#666'"></uni-icons>
    <text class="favorite-text">{{ isFavorite ? '已收藏' : '收藏' }}</text>
  </view>
</template>

<script>
import { favoritesApi } from '@/api'

export default {
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
      debugInfo: [] // 用于存储调试信息
    }
  },
  watch: {
    relatedId: {
      immediate: true,
      async handler(newVal) {
        this.addDebugLog(`relatedId变化: ${newVal} (原值: ${this.currentRelatedId})`);
        
        if (newVal !== this.currentRelatedId) {
          this.addDebugLog('检测到新的relatedId，重置状态');
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
      const timestamp = new Date().toISOString().substr(11, 8);
      this.debugInfo.push(`[${timestamp}] ${message}`);
      // console.log(message); // 同时输出到控制台
    },
    
async checkFavorite() {
  if (this.checking) return;
  this.checking = true;
  
  const userId = uni.getStorageSync('user_id');
  if (!userId) {
    this.isFavorite = false;
    this.favoriteId = null;
    this.checking = false;
    return;
  }
  
  try {
    const res = await favoritesApi.checkFavorite(
      userId, 
      this.relatedId, 
      this.relatedType
    );
    
    // 修改响应处理逻辑
    const list = res.data || [];
    this.isFavorite = list.length > 0;
    this.favoriteId = this.isFavorite ? list[0].favorite_id : null;
  } catch (e) {
    console.error('检查收藏状态失败:', e);
    this.isFavorite = false;
    this.favoriteId = null;
  } finally {
    this.checking = false;
  }
},
    
    async toggleFavorite() {
      this.addDebugLog('--- 开始切换收藏状态 ---');
      this.addDebugLog('当前状态:', {
        isFavorite: this.isFavorite,
        favoriteId: this.favoriteId,
        relatedId: this.relatedId,
        userId: uni.getStorageSync('user_id')
      });
      
      const userId = uni.getStorageSync('user_id');
      if (!userId) {
        this.addDebugLog('操作中止: 用户未登录');
        uni.showToast({ title: '请先登录', icon: 'none' });
        return;
      }
      
      if (this.isFavorite) {
        // 取消收藏逻辑
        if (!this.favoriteId) {
          this.addDebugLog('操作中止: 无效的favoriteId');
          uni.showToast({ title: '收藏ID无效', icon: 'none' });
          return;
        }
        
        try {
          this.addDebugLog(`尝试取消收藏，favoriteId=${this.favoriteId}`);
          const response = await favoritesApi.delete(this.favoriteId);
          this.addDebugLog('取消收藏API响应:', JSON.stringify(response));
          
          if (response && response.success !== false) {
            this.isFavorite = false;
            this.favoriteId = null;
            this.addDebugLog('状态更新: isFavorite=false, favoriteId=null');
            uni.showToast({ title: '已取消收藏', icon: 'none' });
          } else {
            throw new Error(response?.message || '取消收藏失败');
          }
        } catch (e) {
          this.addDebugLog('取消收藏失败:', e.message);
          console.error(e);
          uni.showToast({ title: '取消失败: ' + (e.message || '未知错误'), icon: 'none' });
        }
      } else {
        // 添加收藏逻辑
        try {
          this.addDebugLog('尝试添加收藏', {
            user_id: userId,
            related_id: this.relatedId,
            related_type: this.relatedType
          });
          
          const res = await favoritesApi.create({
            user_id: userId,
            related_id: this.relatedId,
            related_type: this.relatedType
          });
          
          this.addDebugLog('添加收藏API响应:', JSON.stringify(res));
          
          this.isFavorite = true;
          this.favoriteId = res.favorite_id || (res.data && res.data.favorite_id);
          this.addDebugLog(`状态更新: isFavorite=true, favoriteId=${this.favoriteId}`);
          uni.showToast({ title: '已收藏', icon: 'success' });
        } catch (e) {
          this.addDebugLog('添加收藏失败:', e.message);
          console.error(e);
          uni.showToast({ title: '收藏失败: ' + (e.message || '未知错误'), icon: 'none' });
        }
      }
      
      this.addDebugLog('--- 切换收藏状态完成 ---');
    }
  }
}
</script>

<style scoped>
.favorite-btn {
  display: flex;
  align-items: center;
  padding: 10rpx 30rpx;
  border-radius: 40rpx;
  background: #fff;
  border: 1rpx solid #eee;
  font-size: 28rpx;
  color: #666;
  margin: 10rpx 0;
}
.favorite-text {
  margin-left: 10rpx;
}
</style>