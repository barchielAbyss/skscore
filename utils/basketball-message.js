import Notice from '@/utils/notice'
import emitter from '@/utils/emitter'

export default class BasketballMessage {
  constructor() {
    this.socket = new Notice(process.env.SOCKET)

    this.socketRegisterMessage()

    return this.socket
  }

  socketRegisterMessage() {
    // 比赛状态变化
    this.socket.register('P05', data => {
      if (Number(data.data.sports) !== 2) {
        return
      }

      emitter.$emit('socket-basketball-status', data.data)
    })

    // 比分变化
    this.socket.register('P06', data => {
      if (data.data.sports !== 2) {
        return
      }

      emitter.$emit('socket-basketball-gold', data.data)
    })

    // 比赛技术统计
    this.socket.register('P07', data => {
      if (data.data.sports !== 2) {
        return
      }

      emitter.$emit('socket-basketball-stat', data.data)
    })

    // 欧盘变化
    this.socket.register('P11', data => {
      emitter.$emit('socket-basketball-hda', data.data.list)
    })

    // 亚盘变化
    this.socket.register('P12', data => {
      emitter.$emit('socket-basketball-ah', data.data.list)
    })

    // 大小球变化
    this.socket.register('P13', data => {
      emitter.$emit('socket-basketball-ou', data.data.list)
    })
  }
}
