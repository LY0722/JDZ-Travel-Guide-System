"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      messages: [{
        role: "assistant",
        content: "您好！我是陶瓷文化智能助手，可以为您解答关于景德镇陶瓷历史、制作工艺、非遗传承等方面的问题。您有什么想了解的吗？"
      }],
      inputMessage: "",
      isLoading: false,
      scrollTop: 0,
      networkError: false,
      stopStream: null,
      // 用于停止流式请求的函数
      // 内置常见问题回答
      cachedAnswers: {
        "历史": "景德镇陶瓷历史：\n1. 始于汉代，距今已有1700多年历史\n2. 宋代成为全国制瓷中心\n3. 元代设立浮梁瓷局，创烧青花瓷\n4. 明清时期成为皇家御窑厂所在地\n5. 2006年，景德镇手工制瓷技艺被列入国家级非物质文化遗产名录",
        "工艺": "景德镇陶瓷主要工艺：\n1. 拉坯 - 将泥料拉制成型\n2. 利坯 - 修整坯体使其厚薄均匀\n3. 施釉 - 为坯体上釉\n4. 画坯 - 在坯体上绘画装饰\n5. 烧窑 - 高温烧制成瓷\n\n传统工艺还包括雕刻、堆塑、镂空等技法",
        "种类": "景德镇陶瓷主要种类：\n1. 青花瓷 - 最具代表性的品种\n2. 粉彩瓷 - 色彩丰富，工艺复杂\n3. 颜色釉瓷 - 单色釉瓷器\n4. 玲珑瓷 - 透光镂空瓷器\n5. 雕塑瓷 - 人物、动物等雕塑作品",
        "非遗": "景德镇陶瓷非遗项目：\n1. 手工制瓷技艺\n2. 青花瓷制作技艺\n3. 粉彩瓷制作技艺\n4. 颜色釉瓷制作技艺\n5. 传统窑炉营造技艺\n\n这些技艺大多采用师徒传承方式",
        "体验": "景德镇陶瓷体验推荐：\n1. 古窑民俗博览区 - 观看传统制瓷工艺\n2. 陶溪川文创街区 - 现代陶艺体验\n3. 三宝国际陶艺村 - 艺术家工作室体验\n4. 中国陶瓷博物馆 - 了解陶瓷发展史\n5. 瑶里古镇 - 传统制瓷作坊体验",
        "购买": "景德镇陶瓷购买指南：\n1. 国贸陶瓷市场 - 品种齐全\n2. 雕塑瓷厂 - 创意陶瓷集中地\n3. 陶溪川夜市 - 年轻设计师作品\n4. 樊家井仿古街 - 仿古瓷器\n5. 品牌专卖店 - 保证品质\n\n购买时注意辨别真伪，选择有信誉的商家"
      },
      questionKeywords: [
        { keys: ["历史", "年代", "何时"], answerKey: "历史" },
        { keys: ["工艺", "制作", "怎么做"], answerKey: "工艺" },
        { keys: ["种类", "类型", "品种"], answerKey: "种类" },
        { keys: ["非遗", "传承", "非物质"], answerKey: "非遗" },
        { keys: ["体验", "DIY", "动手"], answerKey: "体验" },
        { keys: ["购买", "哪里买", "多少钱"], answerKey: "购买" }
      ]
    };
  },
  methods: {
    async sendMessage() {
      if (!this.inputMessage.trim() || this.isLoading)
        return;
      const userMessage = this.inputMessage;
      this.inputMessage = "";
      this.messages.push({
        role: "user",
        content: userMessage
      });
      const aiMessage = {
        role: "assistant",
        content: "",
        loading: true
      };
      this.messages.push(aiMessage);
      this.isLoading = true;
      this.scrollToBottom();
      const cachedAnswer = this.getCachedAnswer(userMessage);
      if (cachedAnswer) {
        setTimeout(() => {
          this.showCachedAnswer(cachedAnswer);
        }, 80);
        return;
      }
      try {
        this.stopStream = await this.fetchDeepSeekStream(
          userMessage,
          (content) => {
            aiMessage.content = content;
            this.scrollToBottom();
          },
          (finalContent) => {
            aiMessage.loading = false;
            this.isLoading = false;
            this.scrollToBottom();
          },
          (error) => {
            common_vendor.index.__f__("error", "at pages/qa/qa.vue:117", "API调用失败:", error);
            this.handleAPIError(error, userMessage, aiMessage);
          }
        );
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/qa/qa.vue:122", "API调用失败:", error);
        this.handleAPIError(error, userMessage, aiMessage);
      }
    },
    // 处理API错误
    handleAPIError(error, userMessage, aiMessage) {
      this.messages.pop();
      let errorMsg = "抱歉，获取建议时出错";
      if (error.message.includes("timeout")) {
        errorMsg = "网络响应较慢，已为您提供基础建议";
        const fallbackAnswer = this.getFallbackAnswer(userMessage) || '我已收到您的问题，但由于网络原因无法立即获取详细建议。您可以尝试询问更具体的问题，如"北京有哪些必去景点？"';
        this.messages.push({
          role: "assistant",
          content: fallbackAnswer
        });
      } else {
        this.messages.push({
          role: "assistant",
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
        const regex = new RegExp(keywords.split("|").join("|"), "i");
        if (regex.test(question)) {
          return this.cachedAnswers[answerKey];
        }
      }
      return null;
    },
    // 获取备用回答
    getFallbackAnswer(question) {
      if (question.includes("推荐") || question.includes("哪里")) {
        return "景德镇推荐参观地点：\n1. 中国陶瓷博物馆\n2. 古窑民俗博览区\n3. 陶溪川文创街区\n4. 瑶里古镇\n5. 三宝国际陶艺村\n\n您想了解哪个地方的详细信息？";
      } else if (question.includes("制作") || question.includes("工艺")) {
        return "传统景德镇陶瓷制作主要工序：\n1. 采石→2. 粉碎→3. 淘洗→4. 制坯→5. 修坯→6. 施釉→7. 装饰→8. 烧成\n\n您想了解哪个具体工艺的细节？";
      } else if (question.includes("历史") || question.includes("起源")) {
        return "景德镇制瓷历史可追溯至汉代，宋代成为全国制瓷中心，元代创烧青花瓷，明清时期成为皇家御窑厂所在地。您想了解哪个时期的特点？";
      }
      return '我已收到您的问题，但由于网络原因无法立即获取详细回答。您可以尝试询问更具体的问题，如"青花瓷的制作工艺有哪些步骤？"';
    },
    // 显示内置回答
    showCachedAnswer(answer) {
      this.messages.pop();
      this.messages.push({
        role: "assistant",
        content: answer + "\n\n(温馨提示：此为本地快速回答，如需更详细建议可以尝试重新提问)"
      });
      this.isLoading = false;
      this.scrollToBottom();
    },
    // 流式获取DeepSeek数据
    async fetchDeepSeekStream(message, onProgress, onComplete, onError) {
      const API_URL = "https://api.deepseek.com/v1/chat/completions";
      const API_KEY = "sk-f553708d74b3424097258064724c48ab";
      let typedResult = "";
      const requestData = {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "你是一位景德镇陶瓷文化专家，请用专业但易懂的语言回答关于景德镇陶瓷历史、制作工艺、非遗传承等方面的问题。回答要准确、详细，可以分点列出。如果问题与陶瓷无关，请礼貌告知。"
          },
          ...this.messages.filter((msg) => msg.role === "user").slice(-9),
          // 只保留最近9条用户消息
          {
            role: "user",
            content: message
          }
        ],
        stream: true
      };
      const timestamp = Date.now();
      const urlWithTimestamp = `${API_URL}?t=${timestamp}`;
      const requestTask = common_vendor.index.request({
        url: urlWithTimestamp,
        enableChunked: true,
        // 开启transfer-encoding chunked
        responseType: "arraybuffer",
        // 设置响应的数据类型
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
      let accumulatedText = "";
      let fullMessage = "";
      requestTask.onChunkReceived(async (res) => {
        var _a, _b, _c;
        const uint8Array = new Uint8Array(res.data);
        function decodeUTF8(arr) {
          return decodeURIComponent(arr.map((byte) => `%${byte.toString(16).padStart(2, "0")}`).join(""));
        }
        const chunkText = decodeUTF8([...uint8Array]);
        accumulatedText += chunkText;
        const lines = accumulatedText.split("\n");
        accumulatedText = "";
        for (let line of lines) {
          if (line === "data: [DONE]") {
            onComplete && onComplete(fullMessage);
            return;
          }
          if (line.startsWith("data: ")) {
            line = line.replace("data: ", "");
          }
          try {
            const parsedData = JSON.parse(line);
            const content = ((_c = (_b = (_a = parsedData.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.delta) == null ? void 0 : _c.content) || "";
            fullMessage += content;
            typedResult = fullMessage;
            onProgress && onProgress(fullMessage);
          } catch (error) {
            accumulatedText += line + "\n";
          }
        }
      });
      return () => {
        requestTask.abort();
      };
    },
    scrollToBottom() {
      this.$nextTick(() => {
        this.scrollTop = 99999;
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.messages, (message, index, i0) => {
      return common_vendor.e({
        a: message.role === "assistant"
      }, message.role === "assistant" ? {
        b: common_assets._imports_0
      } : {}, {
        c: common_vendor.t(message.content),
        d: message.role === "assistant" && message.loading
      }, message.role === "assistant" && message.loading ? {} : {}, {
        e: index,
        f: common_vendor.n(message.role)
      });
    }),
    b: $data.scrollTop,
    c: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    d: $data.isLoading,
    e: $data.inputMessage,
    f: common_vendor.o(($event) => $data.inputMessage = $event.detail.value),
    g: common_vendor.t($data.isLoading ? "思考中..." : "发送"),
    h: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    i: !$data.inputMessage || $data.isLoading
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/qa/qa.js.map
