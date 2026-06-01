<template>
  <view class="booking-container">
    <!-- 店铺信息 -->
    <view class="shop-info">
      <image :src="shop.image" mode="aspectFill" class="shop-image"></image>
      <view class="shop-detail">
        <text class="shop-name">{{shop.name}}</text>
        <text class="shop-type">{{shop.type}}</text>
        <view class="shop-rating">
          <text class="iconfont icon-star"></text>
          <text>{{shop.rating}}</text>
        </view>
      </view>
    </view>

    <!-- 预约表单 -->
    <view class="booking-form">
      <view class="form-item">
        <text class="form-label">体验项目</text>
        <picker @change="bindProjectChange" :value="projectIndex" :range="projects" range-key="name">
          <view class="picker">
            {{projects[projectIndex].name}} ({{projects[projectIndex].price}})
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="form-label">预约日期</text>
        <picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
          <view class="picker">{{date}}</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="form-label">预约时间</text>
        <picker mode="time" :value="time" start="09:00" end="18:00" @change="bindTimeChange">
          <view class="picker">{{time}}</view>
        </picker>
      </view>

      <view class="form-item">
        <text class="form-label">预约人数</text>
        <view class="stepper">
          <text class="stepper-btn" @click="decreaseNumber">-</text>
          <text class="stepper-number">{{number}}</text>
          <text class="stepper-btn" @click="increaseNumber">+</text>
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">联系人</text>
        <input class="form-input" v-model="contact" placeholder="请输入联系人姓名" />
      </view>

      <view class="form-item">
        <text class="form-label">联系电话</text>
        <input class="form-input" v-model="phone" placeholder="请输入联系电话" type="number" />
      </view>

      <view class="form-item">
        <text class="form-label">备注信息</text>
        <textarea class="form-textarea" v-model="remark" placeholder="如有特殊需求请备注"></textarea>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <view class="price-info">
        <text class="price-label">合计：</text>
        <text class="price-amount">¥{{totalPrice}}</text>
      </view>
      <view class="submit-btn" @click="submitBooking">
        <text>提交预约</text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      const currentDate = this.getDate();
      return {
        shop: {
          id: 1,
          name: '传统拉坯体验馆',
          image: '/static/shop1.jpg',
          type: '拉坯体验',
          rating: 4.9
        },
        projects: [
          {name: '基础拉坯体验', price: '¥80', value: 80},
          {name: '进阶拉坯体验', price: '¥120', value: 120},
          {name: '拉坯+上釉全流程', price: '¥150', value: 150}
        ],
        projectIndex: 0,
        date: currentDate,
        time: '10:00',
        number: 1,
        contact: '',
        phone: '',
        remark: ''
      }
    },
    computed: {
      startDate() {
        return this.getDate('start');
      },
      endDate() {
        return this.getDate('end');
      },
      totalPrice() {
        return this.projects[this.projectIndex].value * this.number;
      }
    },
    onLoad(options) {
      // 根据传入的id获取店铺信息
      const id = options.id;
      // console.log('预约店铺ID:', id);
      // 实际项目中这里应该是API请求
    },
    methods: {
      getDate(type) {
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (type === 'start') {
          year = year;
          month = month;
          day = day;
        } else if (type === 'end') {
          year = year + 1;
        }
        month = month > 9 ? month : '0' + month;
        day = day > 9 ? day : '0' + day;
        return `${year}-${month}-${day}`;
      },
      bindProjectChange(e) {
        this.projectIndex = e.detail.value;
      },
      bindDateChange(e) {
        this.date = e.detail.value;
      },
      bindTimeChange(e) {
        this.time = e.detail.value;
      },
      increaseNumber() {
        this.number++;
      },
      decreaseNumber() {
        if (this.number > 1) {
          this.number--;
        }
      },
      submitBooking() {
        if (!this.contact) {
          uni.showToast({
            title: '请输入联系人姓名',
            icon: 'none'
          });
          return;
        }
        
        if (!this.phone) {
          uni.showToast({
            title: '请输入联系电话',
            icon: 'none'
          });
          return;
        }
        
        // 验证手机号格式
        if (!/^1[3-9]\d{9}$/.test(this.phone)) {
          uni.showToast({
            title: '请输入正确的手机号码',
            icon: 'none'
          });
          return;
        }
        
        // 模拟提交预约
        uni.showLoading({
          title: '提交中...'
        });
        
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: '预约成功',
            icon: 'success'
          });
          
          // 返回上一页
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        }, 2000);
      }
    }
  }
</script>

<style>
  .booking-container {
    padding-bottom: 120rpx;
    background-color: #f5f5f5;
  }

  .shop-info {
    display: flex;
    background-color: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
  }

  .shop-image {
    width: 180rpx;
    height: 180rpx;
    border-radius: 12rpx;
    margin-right: 30rpx;
  }

  .shop-detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .shop-name {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }

  .shop-type {
    font-size: 26rpx;
    color: #00B4D8;
    background-color: rgba(0, 180, 216, 0.1);
    padding: 4rpx 12rpx;
    border-radius: 20rpx;
    align-self: flex-start;
  }

  .shop-rating {
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #ffb400;
  }

  .shop-rating .iconfont {
    margin-right: 5rpx;
  }

  .booking-form {
    background-color: #fff;
    padding: 0 30rpx;
  }

  .form-item {
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    display: flex;
    align-items: center;
  }

  .form-item:last-child {
    border-bottom: none;
  }

  .form-label {
    font-size: 28rpx;
    color: #666;
    width: 150rpx;
  }

  .picker {
    flex: 1;
    font-size: 28rpx;
    color: #333;
  }

  .stepper {
    display: flex;
    align-items: center;
  }

  .stepper-btn {
    width: 50rpx;
    height: 50rpx;
    line-height: 50rpx;
    text-align: center;
    font-size: 36rpx;
    color: #666;
    border: 1rpx solid #ddd;
    border-radius: 50%;
  }

  .stepper-number {
    margin: 0 30rpx;
    font-size: 32rpx;
    color: #333;
  }

  .form-input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
  }

  .form-textarea {
    flex: 1;
    height: 150rpx;
    font-size: 28rpx;
    color: #333;
    padding: 20rpx;
    background-color: #f9f9f9;
    border-radius: 8rpx;
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
    box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.1);
    z-index: 100;
  }

  .price-info {
    flex: 1;
    padding-left: 30rpx;
  }

  .price-label {
    font-size: 28rpx;
    color: #666;
  }

  .price-amount {
    font-size: 36rpx;
    color: #ff6b6b;
    font-weight: bold;
  }

  .submit-btn {
    width: 250rpx;
    height: 100%;
    background-color: #FF6B6B;
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>