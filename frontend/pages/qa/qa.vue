<template>
  <view class="container">
    <!-- 标题 -->
    <view class="header">
      <text class="title">陶瓷文化助手</text>
      <text class="subtitle">景德镇陶瓷知识智能问答</text>
    </view>

    <!-- 聊天区域 -->
    <scroll-view class="chat-container" scroll-y="true" :scroll-with-animation="true" :scroll-top="scrollTop">
      <view v-for="(message, index) in messages" :key="index" class="message" :class="message.role">
        <image v-if="message.role === 'assistant'" class="avatar" src="/static/ai-avatar.png" />
        <image v-else class="avatar" src="" />
        <view class="bubble">
          <text class="text">{{ message.content }}</text>
          <view v-if="message.role === 'assistant' && message.loading" class="loading">
            <text class="dot">.</text>
            <text class="dot">.</text>
            <text class="dot">.</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <input class="input" v-model="inputMessage" placeholder="请输入关于陶瓷文化的问题..." @confirm="sendMessage"
        :disabled="isLoading" />
      <button class="send-btn" @click="sendMessage" :disabled="!inputMessage || isLoading">
        {{ isLoading ? '思考中...' : '发送' }}
      </button>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        messages: [{
          role: 'assistant',
          content: '您好！我是陶瓷文化智能助手，可以为您解答关于景德镇陶瓷历史、制作工艺、非遗传承等方面的问题。您有什么想了解的吗？'
        }],
        inputMessage: '',
        isLoading: false,
        scrollTop: 0,
        networkError: false,
        stopStream: null, // 用于停止流式请求的函数
        // 内置常见问题回答
        cachedAnswers: {
                '历史': '景德镇陶瓷历史：\n1. 始于汉代，距今已有1700多年历史\n2. 宋代成为全国制瓷中心\n3. 元代设立浮梁瓷局，创烧青花瓷\n4. 明清时期成为皇家御窑厂所在地\n5. 2006年，景德镇手工制瓷技艺被列入国家级非物质文化遗产名录',
                '工艺': '景德镇陶瓷主要工艺：\n1. 拉坯 - 将泥料拉制成型\n2. 利坯 - 修整坯体使其厚薄均匀\n3. 施釉 - 为坯体上釉\n4. 画坯 - 在坯体上绘画装饰\n5. 烧窑 - 高温烧制成瓷\n\n传统工艺还包括雕刻、堆塑、镂空等技法',
                '种类': '景德镇陶瓷主要种类：\n1. 青花瓷 - 最具代表性的品种\n2. 粉彩瓷 - 色彩丰富，工艺复杂\n3. 颜色釉瓷 - 单色釉瓷器\n4. 玲珑瓷 - 透光镂空瓷器\n5. 雕塑瓷 - 人物、动物等雕塑作品',
                '非遗': '景德镇陶瓷非遗项目：\n1. 手工制瓷技艺\n2. 青花瓷制作技艺\n3. 粉彩瓷制作技艺\n4. 颜色釉瓷制作技艺\n5. 传统窑炉营造技艺\n\n这些技艺大多采用师徒传承方式',
                '体验': '景德镇陶瓷体验推荐：\n1. 古窑民俗博览区 - 观看传统制瓷工艺\n2. 陶溪川文创街区 - 现代陶艺体验\n3. 三宝国际陶艺村 - 艺术家工作室体验\n4. 中国陶瓷博物馆 - 了解陶瓷发展史\n5. 瑶里古镇 - 传统制瓷作坊体验',
                '购买': '景德镇陶瓷购买指南：\n1. 国贸陶瓷市场 - 品种齐全\n2. 雕塑瓷厂 - 创意陶瓷集中地\n3. 陶溪川夜市 - 年轻设计师作品\n4. 樊家井仿古街 - 仿古瓷器\n5. 品牌专卖店 - 保证品质\n\n购买时注意辨别真伪，选择有信誉的商家'
              },
              questionKeywords: [
                { keys: ['历史', '年代', '何时'], answerKey: '历史' },
                { keys: ['工艺', '制作', '怎么做'], answerKey: '工艺' },
                { keys: ['种类', '类型', '品种'], answerKey: '种类' },
                { keys: ['非遗', '传承', '非物质'], answerKey: '非遗' },
                { keys: ['体验', 'DIY', '动手'], answerKey: '体验' },
                { keys: ['购买', '哪里买', '多少钱'], answerKey: '购买' }
              ]
      }
    },
    methods: {
      async sendMessage() {
        if (!this.inputMessage.trim() || this.isLoading) return;
      
        const userMessage = this.inputMessage;
        this.inputMessage = '';
      
        this.messages.push({
          role: 'user',
          content: userMessage
        });
      
        // 创建AI消息对象并保存引用
        const aiMessage = {
          role: 'assistant',
          content: '',
          loading: true
        };
        this.messages.push(aiMessage);
      
        this.isLoading = true;
        this.scrollToBottom();
      
        // 首先尝试使用内置回答
        const cachedAnswer = this.getCachedAnswer(userMessage);
        if (cachedAnswer) {
          setTimeout(() => {
            this.showCachedAnswer(cachedAnswer);
          }, 80); // 模拟思考时间
          return;
        }
      
        // 没有内置回答则调用API
        try {
          // 调用流式API
          this.stopStream = await this.fetchDeepSeekStream(
            userMessage,
            (content) => {
              // 更新AI消息内容
              aiMessage.content = content;
              this.scrollToBottom();
            },
            (finalContent) => {
              // 流式传输完成
              aiMessage.loading = false;
              this.isLoading = false;
              this.scrollToBottom();
            },
            (error) => {
              console.error('API调用失败:', error);
              this.handleAPIError(error, userMessage, aiMessage);
            }
          );
        } catch (error) {
          console.error('API调用失败:', error);
          this.handleAPIError(error, userMessage, aiMessage);
        }
      },

      // 处理API错误
      handleAPIError(error, userMessage, aiMessage) {
        this.messages.pop();
        
        let errorMsg = '抱歉，获取建议时出错';
        if (error.message.includes('timeout')) {
          errorMsg = '网络响应较慢，已为您提供基础建议';
          // 超时后再次尝试使用内置回答
          const fallbackAnswer = this.getFallbackAnswer(userMessage) || 
            '我已收到您的问题，但由于网络原因无法立即获取详细建议。您可以尝试询问更具体的问题，如"北京有哪些必去景点？"';
          
          this.messages.push({
            role: 'assistant',
            content: fallbackAnswer
          });
        } else {
          this.messages.push({
            role: 'assistant',
            content: errorMsg
          });
        }
        
        this.isLoading = false;
        this.scrollToBottom();
      },

      // 获取内置回答
      getCachedAnswer(question) {
        question = question.toLowerCase();
        for (const [keywords, answerKey] of Object.entries(this.questionKeywords)) {
          const regex = new RegExp(keywords.split('|').join('|'), 'i');
          if (regex.test(question)) {
            return this.cachedAnswers[answerKey];
          }
        }
        return null;
      },

      // 获取备用回答
      getFallbackAnswer(question) {
            if (question.includes('推荐') || question.includes('哪里')) {
              return '景德镇推荐参观地点：\n1. 中国陶瓷博物馆\n2. 古窑民俗博览区\n3. 陶溪川文创街区\n4. 瑶里古镇\n5. 三宝国际陶艺村\n\n您想了解哪个地方的详细信息？';
            } else if (question.includes('制作') || question.includes('工艺')) {
              return '传统景德镇陶瓷制作主要工序：\n1. 采石→2. 粉碎→3. 淘洗→4. 制坯→5. 修坯→6. 施釉→7. 装饰→8. 烧成\n\n您想了解哪个具体工艺的细节？';
            } else if (question.includes('历史') || question.includes('起源')) {
              return '景德镇制瓷历史可追溯至汉代，宋代成为全国制瓷中心，元代创烧青花瓷，明清时期成为皇家御窑厂所在地。您想了解哪个时期的特点？';
            }
            return '我已收到您的问题，但由于网络原因无法立即获取详细回答。您可以尝试询问更具体的问题，如"青花瓷的制作工艺有哪些步骤？"';
          },

      // 显示内置回答
      showCachedAnswer(answer) {
        this.messages.pop();
        this.messages.push({
          role: 'assistant',
          content: answer + '\n\n(温馨提示：此为本地快速回答，如需更详细建议可以尝试重新提问)'
        });
        this.isLoading = false;
        this.scrollToBottom();
      },

      // 流式获取DeepSeek数据
      async fetchDeepSeekStream(message, onProgress, onComplete, onError) {
        const API_URL = 'https://api.deepseek.com/v1/chat/completions'; // 替换为你的API URL
        const API_KEY = 'sk-f553708d74b3424097258064724c48ab'; // 替换为你的API Key
      
        let isStopped = false;
        let typedResult = '';
      
        const requestData = {
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "你是一位景德镇陶瓷文化专家，请用专业但易懂的语言回答关于景德镇陶瓷历史、制作工艺、非遗传承等方面的问题。回答要准确、详细，可以分点列出。如果问题与陶瓷无关，请礼貌告知。"
            },
            ...this.messages.filter(msg => msg.role === 'user').slice(-9), // 只保留最近9条用户消息
            {
              role: "user",
              content: message
            }
          ],
          stream: true,
        };
      
        // 添加时间戳以避免缓存问题
        const timestamp = Date.now();
        const urlWithTimestamp = `${API_URL}?t=${timestamp}`;
      
        // #ifdef H5
        const controller = new AbortController();
      
        try {
          const response = await fetch(urlWithTimestamp, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify(requestData),
            signal: controller.signal
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let partialData = "";
      
          async function readStream() {
            try {
              const { done, value } = await reader.read();
              if (done || isStopped) {
                onComplete && onComplete(typedResult);
                return;
              }
      
              const text = decoder.decode(value, { stream: true });
              partialData += text;
      
              const lines = partialData.split("\n");
              partialData = lines.pop(); // 可能存在未完整的JSON片段
      
              for (const line of lines) {
                if (line.trim().startsWith("data: ")) {
                  const jsonStr = line.replace("data: ", "").trim();
                  if (jsonStr === "[DONE]") {
                    onComplete && onComplete(typedResult);
                    return;
                  }
      
                  try {
                    const jsonData = JSON.parse(jsonStr);
                    const content = jsonData.choices?.[0]?.delta?.content || "";
                    typedResult += content;
                    onProgress && onProgress(typedResult);
                  } catch (e) {
                    console.error("JSON解析失败", e);
                  }
                }
              }
      
              readStream();
            } catch (error) {
              console.error("读取流数据失败", error);
              onError && onError(error);
            }
          }
      
          readStream();
        } catch (error) {
          console.error("请求失败", error);
          onError && onError(error);
        }
      
        // 返回停止函数
        return () => {
          isStopped = true;
          controller.abort();
        };
        // #endif
      
        // #ifdef MP-WEIXIN
        const requestTask = uni.request({
          url: urlWithTimestamp,
          enableChunked: true, // 开启transfer-encoding chunked
          responseType: "arraybuffer", // 设置响应的数据类型
          method: "POST",
          header: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
          },
          data: requestData,
          fail: (err) => {
            onError && onError(err);
          }
        });
      
        let accumulatedText = ""; // 存储未处理的流数据
        let fullMessage = ""; // 存储最终的消息
      
        requestTask.onChunkReceived(async (res) => {
          const uint8Array = new Uint8Array(res.data);
      
          // 兼容TextDecoder的UTF-8解码，微信小程序不支持const decoder = new TextDecoder("utf-8");
          function decodeUTF8(arr) {
            return decodeURIComponent(arr.map(byte => `%${byte.toString(16).padStart(2, "0")}`).join(""));
          }
      
          // 进行解码
          const chunkText = decodeUTF8([...uint8Array]);
          // 累积数据
          accumulatedText += chunkText;
      
          // 处理多行JSON片段
          const lines = accumulatedText.split("\n");
          accumulatedText = ""; // 暂时清空，后续可能补回
      
          for (let line of lines) {
            if (line === "data: [DONE]") {
              onComplete && onComplete(fullMessage);
              return;
            }
      
            // 去掉data:前缀
            if (line.startsWith("data: ")) {
              line = line.replace("data: ", "");
            }
      
            try {
              const parsedData = JSON.parse(line);
              const content = parsedData.choices?.[0]?.delta?.content || "";
              fullMessage += content;
              typedResult = fullMessage;
              onProgress && onProgress(fullMessage);
            } catch (error) {
              // JSON解析失败，可能是数据未完全接收。等待下一个chunk
              accumulatedText += line + "\n";
            }
          }
        });
      
        // 返回停止函数
        return () => {
          isStopped = true;
          requestTask.abort();
        };
        // #endif
      },

      scrollToBottom() {
        this.$nextTick(() => {
          this.scrollTop = 99999; // 足够大的值确保滚动到底部
        });
      }
    }
  }
</script>

<style>
  .container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background-color: #f5fbfd; /* 浅青色背景 */
    }
  
    /* 顶部标题样式 */
    .header {
      text-align: center;
      padding: 30rpx 20rpx;
      background: linear-gradient(135deg, #00B4D8 0%, #48CAE4 100%);
      color: white;
      box-shadow: 0 2rpx 10rpx rgba(0, 180, 216, 0.2);
    }
  
    .title {
      font-size: 36rpx;
      font-weight: bold;
      display: block;
      margin-bottom: 8rpx;
    }

  .subtitle {
      font-size: 24rpx;
      opacity: 0.9;
      display: block;
    }
  
    /* 聊天区域样式 */
    .chat-container {
      flex: 1;
      padding: 20rpx;
      background-color: #f5fbfd;
    }
  
    .message {
      display: flex;
      margin-bottom: 30rpx;
    }
  
    .message.user {
      justify-content: flex-end;
    }
  
    .avatar {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      margin-right:  20rpx;
      border: 2rpx solid #CAF0F8; /* 浅青色边框 */
    }
  
    .message.user .avatar {
      margin-right: 0;
      margin-left: 20rpx;
      border: 2rpx solid #E0F7FA; /* 用户头像边框 */
    }
  
    .bubble {
      max-width: 70%;
      padding: 20rpx;
      border-radius: 16rpx;
      position: relative;
      word-break: break-word;
      font-size: 28rpx;
      line-height: 1.6;
    }
  
    .bubble.assistant {
      background-color: white;
      border: 1rpx solid #CAF0F8;
      border-top-left-radius: 4rpx;
      box-shadow: 0 2rpx 8rpx rgba(0, 180, 216, 0.1);
    }
  
    .bubble.user {
      background: linear-gradient(135deg, #00B4D8 0%, #48CAE4 100%);
      color: white;
      border-top-right-radius: 4rpx;
    }

  .message.assistant .bubble {
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    border-top-left-radius: 4rpx;
  }

  .message.user .bubble {
    background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
    border-top-right-radius: 4rpx;
  }

  .text {
    font-size: 28rpx;
    line-height: 1.5;
    color: #333;
  }

  .loading {
      display: flex;
      justify-content: center;
      padding: 10rpx 0;
    }
  
    .dot {
      font-size: 40rpx;
      color: #00B4D8;
      animation: blink 1.4s infinite both;
      margin: 0 5rpx;
    }
  
    .dot:nth-child(2) {
      animation-delay: 0.2s;
    }
  
    .dot:nth-child(3) {
      animation-delay: 0.4s;
    }

  @keyframes blink {
    0% {
      opacity: 0.2;
    }

    20% {
      opacity: 1;
    }

    100% {
      opacity: 0.2;
    }
  }

  .input-area {
      display: flex;
      padding: 20rpx;
      background-color: white;
      border-top: 1rpx solid #E0F7FA;
      box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
      margin-bottom:40rpx;
  }
  
  .input {
    flex: 1;
    padding: 20rpx;
    border: 1rpx solid #CAF0F8;
    border-radius: 40rpx;
    margin-right: 20rpx;
    font-size: 28rpx;
    background-color: #f5fbfd;
    transition: border-color 0.3s;
  }
  
    .input:focus {
      border-color: #00B4D8;
      outline: none;
    }
  
    .send-btn {
      width: 120rpx;
      height: 80rpx;
      background: linear-gradient(135deg, #00B4D8 0%, #48CAE4 100%);
      color: white;
      border-radius: 40rpx;
      font-size: 28rpx;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }
  
    .send-btn:active {
      opacity: 0.9;
    }
  
    .send-btn[disabled] {
      background: #cccccc;
      opacity: 0.7;
    }
  
    .loading-icon {
      width: 36rpx;
      height: 36rpx;
    }
</style>