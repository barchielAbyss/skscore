<template>
  <div class="chat-room">
    <div class="chat-room__title">聊天室（{{ userTotal }}人）</div>
    <div ref="chatBody" class="chat-room__main">
      <p v-for="(item, index) of chatHistory" :key="index" class="message-item">
        <span
          :class="['nickname', { system: item.system === 1 }]"
          v-text="item.nick"
        />
        <span class="message" v-html="textEnter2Br(item.msg)" />
      </p>
    </div>
    <div class="chat-room__submit">
      <ElInput
        v-model="sendMessage"
        :rows="3"
        type="textarea"
        placeholder="请输入文字内容"
        maxlength="500"
        show-word-limit
        class="submit-textarea"
      />

      <p class="submit-btn">
        <span @click="handleSubMessage">发送</span>
      </p>
    </div>
  </div>
</template>

<script>
import xss from 'xss'
import { mapState } from 'vuex'

import emitter from '@/utils/emitter'
import ChatMessage from '@/utils/chat-message'

export default {
  props: {
    types: {
      type: [String, Number],
      default: 1,
    },

    matchId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      chatSocket: null,
      chatHistory: {},
      realUserTotal: 0,
      sendMessage: '',
    }
  },
  computed: {
    ...mapState('user', ['userInfo', 'isLogin']),

    // 计算聊天室总人数
    userTotal() {
      return parseInt(Math.random() * 90) + 10 + this.realUserTotal
    },

    // 返回当前用户的状态：登录/未登录
    chatUserInfo() {
      if (!this.isLogin) {
        return {
          tkey: 'MUAw',
          nick: '游客',
          level: 1,
          chId: `${this.types}_${this.matchId}`,
        }
      } else {
        const tkey = localStorage.getItem('tkey')

        return {
          tkey: tkey || this.userInfo.tkey,
          nick: this.userInfo.nickname,
          level: 1,
          chId: `${this.types}_${this.matchId}`,
        }
      }
    },
  },
  watch: {
    // 监听计算属性，当用户 登录/退出 的操作
    isLogin() {
      this.userLogin()
    },
  },
  destroyed() {
    if (this.chatSocket) {
      this.chatSocket.destroy()
      this.chatSocket = null
    }

    emitter.$off('chat-message-history', this.fetchSocketHistory)
    emitter.$off('chat-message-user', this.fetchSocketUser)
    emitter.$off('chat-message-new', this.fetchSocketNews)
    emitter.$off('chat-message-system', this.fetchSocketSystem)
  },
  mounted() {
    this.chatSocket = new ChatMessage()

    emitter.$on('chat-message-people', this.fetchSocketPeople)
    emitter.$on('chat-message-history', this.fetchSocketHistory)
    emitter.$on('chat-message-user', this.fetchSocketUser)
    emitter.$on('chat-message-new', this.fetchSocketNews)
    emitter.$on('chat-message-system', this.fetchSocketSystem)
    this.userLogin()
  },
  methods: {
    fetchSocketHistory(value) {
      if (!value.msg) {
        value.msg = []
      }
      this.chatHistory = [
        {
          nick: '频道公告',
          msg: value.notice,
          system: 1,
        },
        ...value.msg,
      ]

      this.onBackBottom()
    },
    fetchSocketUser(value) {
      this.realUserTotal = value.num
      this.onBackBottom()
    },
    fetchSocketNews(value) {
      this.chatHistory.push(value)
      this.onBackBottom()
    },
    fetchSocketSystem(value) {
      this.chatHistory.push({
        nick: '频道公告',
        msg: value.msg,
        system: 1,
      })
      this.onBackBottom()
    },
    fetchSocketPeople(value) {
      this.realUserTotal = value.num
    },

    // 处理发送的消息
    textEnter2Br(htmlText) {
      return xss(htmlText.replace(/[\r\n]/g, '<br>'))
    },

    onBackBottom() {
      this.$nextTick(() => {
        const $el = this.$refs.chatBody
        if (!$el) {
          return
        }
        $el.scrollTop = $el.scrollHeight
      })
    },

    // 用户登录/退出 时调用
    userLogin() {
      this.chatSocket.setMessage({
        cmd: 'L01',
        data: {
          ...this.chatUserInfo,
          isFirst: 1,
        },
      })
    },

    // 发送消息
    handleSubMessage() {
      // 判断是否建立了连接
      if (!this.chatSocket) {
        return
      }
      this.chatSocket.setMessage({
        cmd: 'M01',
        data: {
          ...this.chatUserInfo,
          msg: xss(this.sendMessage),
          msgType: 0,
        },
      })

      // 发送完毕，消息置空
      this.sendMessage = ''
    },
  },
}
</script>

<style lang="scss">
.chat-room {
  width: 304px;
  max-height: 652px;
  background-color: $color-white;
  &__title {
    color: #666666;
    line-height: 46px;
    font-size: 14px;
    font-weight: bold;
    padding: 0 20px;
  }
  &__main {
    height: calc(100% - 186px);
    padding: 10px 10px 10px 20px;
    overflow: auto;
    background-color: #f5f5f5;
    font-size: 12px;
    .message-item {
      padding: 5px 0;
      display: flex;
    }
    .nickname {
      position: relative;
      color: #6daade;
      font-weight: bold;
      margin-right: 4px;
      padding-right: 4px;
      max-width: 6em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &::after {
        position: absolute;
        display: block;
        right: 0;
        top: 0;
        color: #333;
        content: ':';
      }
    }
    .system {
      background-color: #ccc;
      color: $color-white;
      padding-left: 4px;
      border-radius: 4px;
      height: 1.5em;
      &::after {
        display: none;
      }
    }
    .message {
      flex: 1;
      align-self: flex-end;
      word-break: break-all;
      text-align: justify;
    }
  }
  &__submit {
    font-size: 12px;
    color: #999999;
    padding: 12px 12px 12px 0;
    .submit-textarea {
      font-size: 12px;
      textarea {
        border: none;
      }
      .el-input__count {
        bottom: 0;
        right: 0;
      }
    }
    .submit-btn {
      padding-top: 2px;
      text-align: right;
      line-height: 20px;
      span {
        cursor: pointer;
        display: inline-block;
        width: 44px;
        text-align: center;
        background-color: $color-active;
        color: $color-white;
        border-radius: 4px;
      }
    }
  }
}
</style>
