<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
  /* 主题色 */
  :root {
    --primary-color: #00B4D8;
    --primary-dark: #0077B6;
    --primary-light: #90E0EF;
    --white: #fff;
    --gray: #f5f5f5;
    --text-color: #333;
    --text-light: #666;
  }
  
  /* 通用样式 */
  page {
    background-color: var(--gray);
    color: var(--text-color);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  
  .container {
    padding: 15px;
  }
  
  /* 按钮样式 */
  .btn-primary {
    background-color: var(--primary-color);
    color: var(--white);
    border-radius: 4px;
  }
  
  .btn-primary:active {
    background-color: var(--primary-dark);
  }
  
  /* 卡片样式 */
  .card {
    background-color: var(--white);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 15px;
    overflow: hidden;
  }
  
  /* 头部标题 */
  .section-title {
    font-size: 18px;
    font-weight: bold;
    color: var(--primary-dark);
    margin: 15px 0;
    padding-left: 10px;
    border-left: 4px solid var(--primary-color);
  }
  
  /* 快速问答入口 */
  .quick-qa {
    background-color: var(--primary-light);
    padding: 15px;
    border-radius: 8px;
    margin: 15px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .quick-qa .text {
    font-size: 16px;
    color: var(--primary-dark);
    font-weight: bold;
  }
  
  .quick-qa .btn {
    background-color: var(--primary-color);
    color: white;
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 14px;
  }
  /* 图标字体 */
  @font-face {
    font-family: 'iconfont';
    src: url('https://at.alicdn.com/t/font_1234567_abcdefghijk.woff2') format('woff2'),
         url('https://at.alicdn.com/t/font_1234567_abcdefghijk.woff') format('woff'),
         url('https://at.alicdn.com/t/font_1234567_abcdefghijk.ttf') format('truetype');
  }
  
  .iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  .icon-add:before {
    content: "\e6a0";
  }
  
  .icon-view:before {
    content: "\e6a1";
  }
  
  .icon-like:before {
    content: "\e6a2";
  }
  
  .icon-like-fill:before {
    content: "\e6a3";
  }
  
  .icon-comment:before {
    content: "\e6a4";
  }
  
  .icon-down:before {
    content: "\e6a5";
  }
  
  .icon-back:before {
    content: "\e6a6";
  }
  
  .icon-close:before {
    content: "\e6a7";
  }
  
  .icon-location:before {
    content: "\e6a8";
  }
</style>
