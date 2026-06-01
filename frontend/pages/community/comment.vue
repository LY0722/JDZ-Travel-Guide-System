<template>
  <view class="comment-container">
    <!-- 评论输入框 -->
    <view class="comment-input-bar">
      <input v-model="commentContent" placeholder="写下你的评论..." class="comment-input" @confirm="submitComment"/>
      <button class="send-btn" @click="submitComment">发送</button>
    </view>
    <!-- 评论列表 -->
    <view class="comment-list">
      <view class="comment-item" v-for="comment in comments" :key="comment.comment_id">
        <image :src="comment.user.avatar_url || '/static/default-avatar.png'" class="avatar"></image>
        <view class="comment-main">
          <view class="comment-header">
            <text class="username">{{comment.user.username || '瓷都游客'}}</text>
            <text class="time">{{formatTime(comment.created_at)}}</text>
          </view>
          <text class="comment-text">{{comment.content}}</text>
          <view class="reply-btn" @click="setReply(comment)">回复</view>
          <!-- 子评论 -->
          <view class="sub-comments" v-if="comment.children && comment.children.length">
            <view class="sub-comment-item" v-for="sub in comment.children" :key="sub.comment_id">
              <image :src="sub.user.avatar_url || '/static/default-avatar.png'" class="avatar"></image>
              <view class="sub-comment-main">
                <view class="comment-header">
                  <text class="username">{{sub.user.username || '瓷都游客'}}</text>
                  <text class="time">{{formatTime(sub.created_at)}}</text>
                </view>
                <text class="comment-text">{{sub.content}}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 回复输入框 -->
    <view class="reply-input-bar" v-if="replyTo">
      <input v-model="replyContent" :placeholder="`回复 @${replyTo.user.username || '瓷都游客'}：`" class="comment-input" @confirm="submitReply"/>
      <button class="send-btn" @click="submitReply">发送</button>
      <button class="cancel-btn" @click="cancelReply">取消</button>
    </view>
  </view>
</template>

<script>
import { commentsApi, userApi } from '@/api.js'
export default {
  props: {
    postId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      comments: [],
      commentContent: '',
      replyContent: '',
      replyTo: null,
      userId: null
    }
  },
  mounted() {
    this.userId = uni.getStorageSync('user_id')
    this.loadComments()
  },
  methods: {
    async loadComments() {
      try {
        // 1. 获取评论列表
        const res = await commentsApi.getByPost(this.postId)
        let comments = res.data || res
        // 2. 获取用户信息并组装子评论
        const userMap = {}
        for (let c of comments) {
          if (!userMap[c.user_id]) {
            userMap[c.user_id] = await userApi.getById(c.user_id)
          }
          c.user = userMap[c.user_id]
        }
        // 3. 构建父子评论结构
        const map = {}, roots = []
        comments.forEach(c => {
          c.children = []
          map[c.comment_id] = c
        })
        comments.forEach(c => {
          if (c.parent_id) {
            map[c.parent_id]?.children.push(c)
          } else {
            roots.push(c)
          }
        })
        this.comments = roots
      } catch (e) {
        console.error('加载评论失败:', e)
        uni.showToast({ title: '加载评论失败', icon: 'none' })
      }
    },
    async submitComment() {
      if (!this.commentContent.trim()) {
        uni.showToast({ title: '评论内容不能为空', icon: 'none' })
        return
      }
      if (!this.userId) {
        uni.showToast({ title: '请先登录', icon: 'none' })
        return
      }
      try {
        await commentsApi.create({
          post_id: this.postId,
          user_id: this.userId,
          content: this.commentContent
        })
        this.commentContent = ''
        await this.loadComments()
        uni.showToast({ title: '评论成功', icon: 'success' })
      } catch (e) {
        console.error('评论失败:', e)
        uni.showToast({ title: '评论失败', icon: 'none' })
      }
    },
    setReply(comment) {
      this.replyTo = comment
      this.replyContent = ''
    },
    cancelReply() {
      this.replyTo = null
      this.replyContent = ''
    },
    async submitReply() {
      if (!this.replyContent.trim()) {
        uni.showToast({ title: '回复内容不能为空', icon: 'none' })
        return
      }
      if (!this.userId) {
        uni.showToast({ title: '请先登录', icon: 'none' })
        return
      }
      try {
        await commentsApi.create({
          post_id: this.postId,
          user_id: this.userId,
          parent_id: this.replyTo.comment_id,
          content: this.replyContent
        })
        this.replyContent = ''
        this.replyTo = null
        await this.loadComments()
        uni.showToast({ title: '回复成功', icon: 'success' })
      } catch (e) {
        console.error('回复失败:', e)
        uni.showToast({ title: '回复失败', icon: 'none' })
      }
    },
    formatTime(timeStr) {
      const time = new Date(timeStr)
      const now = new Date()
      const diff = (now - time) / 1000
      if (diff < 60) return '刚刚'
      if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
      if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
      if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`
      return time.toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.comment-container {
  background: #fff;
  padding: 20rpx;
  padding-bottom: 100rpx; /* 留出输入框高度 */
}
.comment-input-bar, .reply-input-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}
.reply-input-bar {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #fff;
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 10rpx 20rpx;
  border-top: 1rpx solid #eee;
}
.comment-input {
  flex: 1;
  border: 1rpx solid #eee;
  border-radius: 30rpx;
  padding: 0 20rpx;
  height: 60rpx;
  font-size: 28rpx;
  margin-right: 10rpx;
}
.send-btn {
  background: #00B4D8;
  color: #fff;
  border-radius: 30rpx;
  padding: 0 30rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 28rpx;
}
.cancel-btn {
  margin-left: 10rpx;
  background: #eee;
  color: #333;
  border-radius: 30rpx;
  padding: 0 20rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 28rpx;
}
.comment-list {
  margin-top: 10rpx;
}
.comment-item, .sub-comment-item {
  display: flex;
  margin-bottom: 20rpx;
}
.avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  margin-right: 15rpx;
}
.comment-main, .sub-comment-main {
  flex: 1;
}
.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 5rpx;
}
.username {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
  margin-right: 10rpx;
}
.time {
  font-size: 22rpx;
  color: #999;
}
.comment-text {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 5rpx;
  word-break: break-all;
}
.reply-btn {
  color: #00B4D8;
  font-size: 24rpx;
  margin-top: 5rpx;
  cursor: pointer;
}
.sub-comments {
  margin-left: 60rpx;
  border-left: 2rpx solid #eee;
  padding-left: 15rpx;
}
</style>