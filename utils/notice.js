import msgpack5 from 'msgpack5'
import { Message } from 'element-ui'

// 最小/最大/限制 重连时间
const RECONNECT_TIME_MIN = 30
const RECONNECT_TIME_MAX = 55
const RECONNECT_TIMES_LIMIT = 10

// 开区间取值 （min, max）
const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 定时秒数范围：（3, 5.5）
const calcRetryInterval = () => {
  return random(RECONNECT_TIME_MIN, RECONNECT_TIME_MAX) * 1000
}

export default class MessageSocket {
  socket = null
  eventMap = {}
  retryTimes = 0

  constructor(src) {
    if (!window.WebSocket) {
      Message({
        message:
          '您的浏览器不支持websocket协议,建议使用新版谷歌、火狐等浏览器！',
        type: 'error',
      })

      return
    }

    this.setupSocket(src)
  }

  // 建立 websocket 连接
  setupSocket(src) {
    if (this.socket || !src) {
      return
    }

    // 创建一个 websocket 对象, src: 指定连接的 URL
    this.socket = new WebSocket(src)

    // 客户端接收服务端数据时触发 message 事件
    this.socket.onmessage = e => {
      // 创建一个 FileReader 对象
      const reader = new FileReader()

      // 文件读取成功完成时触发 load 事件
      reader.onload = data => {
        // 文件读取成功时，result 为一个文件对象 msgpack.decode() 返回一个 bl
        this.handleMessage(msgpack5().decode(data.target.result))
      }

      // readAsArrayBuffer() 方法用于启动读取指定的 Blob 或 File 内容
      reader.readAsArrayBuffer(e.data)
    }

    // websocket 关闭时触发 close 事件
    this.socket.onclose = () => {
      this.socket = null

      // 重新建立 websocket 连接
      this.setupReconnect()
    }

    this.setHeartbeat()
  }

  // 设置心跳节奏
  setHeartbeat() {
    this.heartbeat = setInterval(() => {
      // 如果当前没有建立连接，跳出函数
      if (!this.socket) {
        return
      }
      this.socket.send(
        msgpack5().encode({
          cmd: 'ping',
        })
      )
    }, calcRetryInterval())
  }

  // 重新建立连接
  setupReconnect() {
    if (this.retryTimes >= RECONNECT_TIMES_LIMIT) {
      return
    }

    this.timerReconnect = setTimeout(() => {
      // 0 + 0 ?
      this.retryTimes += this.retryTimes
      this.setupSocket()
    }, calcRetryInterval())
  }

  // 在 eventMap 内找到与 cmd 对应的数组（每个数组元素都是一个方法）
  handleMessage(data) {
    const { cmd } = data
    const handlers = this.eventMap[cmd]

    // 调用这些方法（向 Vue 实例 emitter 中注册自定义事件，并保存需要传递的数据），派发数据
    if (handlers) {
      handlers.callback.forEach(func => {
        func(data)
      })
    }
  }

  // 设置信息，准备向服务端发送
  setMessage(value) {
    if (!value || !this.socket) {
      return
    }

    // readyState：0 连接未建立；1 连接已建立； 2 连接正在关闭； 3 连接已关闭
    if (this.socket.readyState !== 1) {
      this.socket.onopen = () => {
        this.socket.send(msgpack5().encode(value))
      }
    } else {
      this.socket.send(msgpack5().encode(value))
    }
  }

  // 注册回调函数
  register(type, callback) {
    if (!this.eventMap[type]) {
      this.eventMap[type] = {
        callback: [],
      }
    }

    if (this.eventMap[type] && typeof callback === 'function') {
      this.eventMap[type].callback.push(callback)
    }
  }

  // 关闭连接
  destroy() {
    clearTimeout(this.timerReconnect)
    clearInterval(this.heartbeat)
    this.timerReconnect = null

    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }
}
