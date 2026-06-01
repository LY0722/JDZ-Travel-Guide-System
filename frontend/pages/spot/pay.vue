<template>
  <view class="ticket-container">
    <!-- 头部信息 -->
    <view class="header">
      <view class="spot-info">
        <text class="spot-name">{{spot.spot_name}}</text>
        <view class="spot-location">
          <uni-icons type="location-filled" size="16" color="#00B4D8"></uni-icons>
          <text class="location-text">{{spot.spot_address}}</text>
        </view>
      </view>
      <image :src="spot.mainImage || '/static/spot-default.jpg'" mode="aspectFill" class="spot-image"></image>
    </view>

    <!-- 门票选择 -->
<!--    <view class="section">
      <view class="section-title">选择门票</view>
      <view class="ticket-list">
        <view class="ticket-item" v-for="(ticket, index) in tickets" :key="index" @click="selectTicket(index)"
          :class="{selected: selectedIndex === index}">
          <view class="ticket-left">
            <text class="ticket-name">{{ticket.name}}</text>
            <text class="ticket-desc">{{ticket.desc}}</text>
          </view>
          <view class="ticket-right">
            <text class="ticket-price">¥{{ticket.price}}</text>
            <text class="ticket-original-price" v-if="ticket.originalPrice">¥{{ticket.originalPrice}}</text>
            <text class="ticket-tag" v-if="ticket.tag">{{ticket.tag}}</text>
          </view>
        </view>
      </view>
    </view> -->

    <!-- 游玩日期 -->
    <view class="section">
      <view class="section-title">选择游玩日期</view>
      <scroll-view class="date-scroll" scroll-x>
        <view class="date-list">
          <view class="date-item" v-for="(date, index) in dates" :key="index" @click="selectDate(index)"
            :class="{selected: selectedDateIndex === index}">
            <text class="date-week">{{date.week}}</text>
            <text class="date-day">{{date.day}}</text>
            <text class="date-price" v-if="date.price">{{spot.ticket_price ? `¥${spot.ticket_price}` : '免费'}}</text>
            <text class="date-price" v-else>{{spot.ticket_price ? `¥${spot.ticket_price}` : '免费'}}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 购票数量 -->
    <view class="section">
      <view class="section-title">购票数量</view>
      <view class="quantity-selector">
        <text class="quantity-label">门票</text>
        <view class="quantity-control">
          <text class="quantity-btn" @click="decreaseQuantity" :class="{disabled: quantity <= 1}">-</text>
          <text class="quantity-value">{{quantity}}</text>
          <text class="quantity-btn" @click="increaseQuantity">+</text>
        </view>
      </view>
    </view>

    <!-- 购票须知 -->
    <view class="section notice-section">
      <view class="section-title">购票须知</view>
      <view class="notice-content">
        <view class="notice-item">
          <text class="notice-title">有效期:</text>
          <text class="notice-desc">指定游玩日当天有效</text>
        </view>
        <view class="notice-item">
          <text class="notice-title">退改规则:</text>
          <text class="notice-desc">未使用可随时申请退款，部分产品可能收取手续费</text>
        </view>
        <view class="notice-item">
          <text class="notice-title">入园方式:</text>
          <text class="notice-desc">凭商家发送的电子码至景区售票处兑换入园</text>
        </view>
        <view class="notice-item">
          <text class="notice-title">营业时间:</text>
          <text class="notice-desc">{{spot.opening_hours || '08:00-17:30(最晚入园17:00)'}}</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view class="price-info">
        <text class="total-label">合计:</text>
        <text class="total-price">{{spot.ticket_price ? `¥${spot.ticket_price}` : '免费'}}</text>
      </view>
      <view class="buy-btn" @click="handleConfirmOrder">
        <text class="btn-text">立即预订</text>
      </view>
    </view>
  </view>
</template>

<script>
import { scenicSpotApi, imageApi } from '@/api';
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';

export default {
  components: {
    uniIcons
  },
  data() {
    return {
      spot: {
        spot_id: null,
        spot_name: '',
        spot_address: '',
        opening_hours: '',
        ticket_price: null,
        mainImage: ''
      },
      tickets: [
        {
          id: 1,
          name: '成人票',
          desc: '18周岁(含)以上',
          price: 95,
          originalPrice: 120,
          tag: '立减25元'
        },
        {
          id: 2,
          name: '学生票',
          desc: '全日制大中小学生(不含研究生)凭有效学生证',
          price: 50,
          originalPrice: 60,
          tag: '特惠'
        },
        {
          id: 3,
          name: '儿童/老人票',
          desc: '1.2米(含)-1.5米(含)儿童/60周岁(含)以上老人凭身份证',
          price: 45,
          tag: '优惠'
        }
      ],
      dates: [],
      selectedIndex: 0,
      selectedDateIndex: 0,
      quantity: 1
    }
  },
  computed: {
    selectedTicket() {
      return this.tickets[this.selectedIndex];
    },
    selectedDate() {
      return this.dates[this.selectedDateIndex];
    },
    totalPrice() {
      const ticketPrice = this.selectedDate.price || this.selectedTicket.price;
      return ticketPrice * this.quantity;
    }
  },
  async onLoad(options) {
    if (options.id) {
      await this.loadSpotDetail(options.id);
    }
    
    // 初始化日期数据
    this.initDates();
  },
  methods: {
    async loadSpotDetail(id) {
      try {
        uni.showLoading({ title: '加载中...' });
        
        // 获取景点详情
        const spotRes = await scenicSpotApi.getById(id);
        this.spot = {
          ...this.spot,
          ...spotRes,
          ticket_price: parseFloat(spotRes.ticket_price) || 0
        };
        
        // 获取景点图片
        const imagesRes = await imageApi.getByRelatedId(id, 'spot');
        if (imagesRes.data && imagesRes.data.length > 0) {
          const mainImage = imagesRes.data.find(img => img.is_main) || imagesRes.data[0];
          this.spot.mainImage = mainImage.image_url;
        }
        
        // 如果景点有门票价格，更新默认门票价格
        if (this.spot.ticket_price > 0) {
          this.tickets[0].price = this.spot.ticket_price;
          this.tickets[0].originalPrice = Math.round(this.spot.ticket_price * 1.2);
        }
        
      } catch (error) {
        console.error('加载景点详情失败:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
      }
    },
    initDates() {
      const weekMap = ['日', '一', '二', '三', '四', '五', '六'];
      const today = new Date();
      const dates = [];
      
      for (let i = 0; i < 15; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        const week = '周' + weekMap[date.getDay()];
        const day = `${date.getMonth() + 1}月${date.getDate()}日`;
        
        // 周末价格略高
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        const price = isWeekend ? Math.round(this.tickets[0].price * 1.1) : null;
        
        dates.push({
          date: date,
          week: week,
          day: day,
          price: price
        });
      }
      
      this.dates = dates;
    },
    selectTicket(index) {
      this.selectedIndex = index;
    },
    selectDate(index) {
      this.selectedDateIndex = index;
    },
    increaseQuantity() {
      this.quantity++;
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    // 新增的预订处理方法
    handleConfirmOrder() {
      // 信息校验
      const validateResult = this.validateOrderInfo();
      if (!validateResult.isValid) {
        uni.showToast({
          title: validateResult.message,
          icon: 'none',
          duration: 2000
        });
        return;
      }

      // 显示预订成功弹框
      uni.showModal({
        title: '提示',
        content: '恭喜您预订成功！',
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            // 跳转到订单确认页（原逻辑）
            const orderInfo = {
              spotId: this.spot.spot_id,
              spotName: this.spot.spot_name,
              ticketId: this.selectedTicket.id,
              ticketName: this.selectedTicket.name,
              date: this.selectedDate.day,
              price: this.selectedDate.price || this.selectedTicket.price,
              quantity: this.quantity,
              totalPrice: this.totalPrice
            };
            
            uni.navigateTo({
              // url: `/pages/spot/confirm?data=${encodeURIComponent(JSON.stringify(orderInfo))}`
            });
          }
        }
      });
    },

    // 信息校验方法
    validateOrderInfo() {
      const errors = [];
      
      // 校验景点信息
      if (!this.spot.spot_id || !this.spot.spot_name) {
        errors.push('景点信息不完整');
      }
      
      // 校验门票选择
      if (this.selectedIndex === undefined) {
        errors.push('请选择门票类型');
      }
      
      // 校验游玩日期
      if (this.selectedDateIndex === undefined) {
        errors.push('请选择游玩日期');
      }
      
      // 校验购票数量
      if (this.quantity <= 0) {
        errors.push('请选择购票数量');
      }

      if (errors.length > 0) {
        return { isValid: false, message: errors.join('，') };
      }

      return { isValid: true, message: '' };
    }
  }
}
</script>

<style>
.ticket-container {
  padding-bottom: 120rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  display: flex;
  padding: 30rpx;
  background-color: #fff;
  margin-bottom: 20rpx;
}

.spot-info {
  flex: 1;
  padding-right: 20rpx;
}

.spot-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 15rpx;
  display: block;
}

.spot-location {
  display: flex;
  align-items: center;
}

.location-text {
  font-size: 26rpx;
  color: #999;
  margin-left: 8rpx;
}

.spot-image {
  width: 180rpx;
  height: 120rpx;
  border-radius: 8rpx;
}

.section {
  background-color: #fff;
  margin-bottom: 20rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 25rpx;
}

.ticket-list {
  border-radius: 12rpx;
  overflow: hidden;
}

.ticket-item {
  display: flex;
  justify-content: space-between;
  padding: 25rpx;
  border: 1rpx solid #eee;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
}

.ticket-item.selected {
  border-color: #00B4D8;
  background-color: #f0f9ff;
}

.ticket-left {
  flex: 1;
  padding-right: 20rpx;
}

.ticket-name {
  font-size: 30rpx;
  color: #333;
  display: block;
  margin-bottom: 10rpx;
}

.ticket-desc {
  font-size: 24rpx;
  color: #999;
  display: block;
}

.ticket-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.ticket-price {
  font-size: 36rpx;
  color: #ff6b6b;
  font-weight: bold;
}

.ticket-original-price {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
  margin-top: 5rpx;
}

.ticket-tag {
  font-size: 20rpx;
  color: #fff;
  background-color: #ff6b6b;
  padding: 2rpx 10rpx;
  border-radius: 20rpx;
  margin-top: 10rpx;
}

.date-scroll {
  white-space: nowrap;
  width: 100%;
}

.date-list {
  display: inline-flex;
}

.date-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 30rpx;
  margin-right: 15rpx;
  border: 1rpx solid #eee;
  border-radius: 12rpx;
}

.date-item.selected {
  border-color: #00B4D8;
  background-color: #f0f9ff;
}

.date-week {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.date-day {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.date-price {
  font-size: 26rpx;
  color: #ff6b6b;
  font-weight: bold;
}

.quantity-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
}

.quantity-label {
  font-size: 28rpx;
  color: #333;
}

.quantity-control {
  display: flex;
  align-items: center;
}

.quantity-btn {
  width: 60rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  font-size: 36rpx;
  color: #666;
  background-color: #f5f5f5;
  border-radius: 50%;
}

.quantity-btn.disabled {
  color: #ccc;
  background-color: #f9f9f9;
}

.quantity-value {
  width: 80rpx;
  text-align: center;
  font-size: 32rpx;
  color: #333;
}

.notice-section {
  margin-bottom: 120rpx;
}

.notice-item {
  margin-bottom: 20rpx;
}

.notice-title {
  font-size: 26rpx;
  color: #666;
  font-weight: bold;
  display: block;
  margin-bottom: 5rpx;
}

.notice-desc {
  font-size: 26rpx;
  color: #999;
  line-height: 1.5;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #fff;
  display: flex;
  align-items: center;
  border-top: 1rpx solid #eee;
  padding: 0 20rpx;
}

.price-info {
  flex: 1;
  display: flex;
  align-items: center;
}

.total-label {
  font-size: 28rpx;
  color: #666;
  margin-right: 10rpx;
}

.total-price {
  font-size: 36rpx;
  color: #ff6b6b;
  font-weight: bold;
}

.buy-btn {
  width: 250rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background-color: #ff6b6b;
  border-radius: 40rpx;
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
}
</style>