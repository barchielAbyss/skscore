import Notice from '@/utils/notice'
import emitter from '@/utils/emitter'

export default class ChatMessage {
  constructor() {
    this.socket = new Notice(process.env.CHART)

    this.socketRegisterMessage()

    return this.socket
  }

  socketRegisterMessage() {
    // 新用户加入频道
    this.socket.register('L01', data => {
      emitter.$emit('chat-message-user', data.data)
    })

    // 接收频道公告和历史消息
    this.socket.register('N01', data => {
      emitter.$emit('chat-message-history', data.data)
    })

    // 接收频道内消息/发送频道内消息
    this.socket.register('M01', data => {
      emitter.$emit('chat-message-new', data.data)
    })

    // 接收系统广播消息
    this.socket.register('B01', data => {
      emitter.$emit('chat-message-system', data.data)
    })

    // 频道在线人数变化 L02
    this.socket.register('L02', data => {
      emitter.$emit('chat-message-people', data.data)
    })
  }
}
