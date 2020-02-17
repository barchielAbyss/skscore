import Notice from '@/utils/notice'
import emitter from '@/utils/emitter'

export default class FootballMessage {
  constructor() {
    this.socket = new Notice(process.env.SOCKET)

    this.socketRegisterMessage()

    return this.socket
  }

  socketRegisterMessage() {
    // 比赛状态推送
    this.socket.register('P01', data => {
      if (Number(data.data.sports) !== 1) {
        return
      }

      emitter.$emit('socket-football-status', data.data)
    })

    // 进球、红黄牌、换人事件推送格式
    this.socket.register('P02', data => {
      if (Number(data.data.sports) !== 1) {
        return
      }

      emitter.$emit('socket-football-event', data.data)
    })

    // 比赛技术统计变化
    this.socket.register('P03', data => {
      if (Number(data.data.sports) !== 1) {
        return
      }

      emitter.$emit('socket-football-stat', data.data)
    })

    // 比分变化
    this.socket.register('P04', data => {
      if (data.data.sports !== 1 && !data.data.ext.minute) {
        return
      }

      emitter.$emit('socket-football-gold', data.data)
    })

    // 欧盘变化
    this.socket.register('P08', data => {
      emitter.$emit('socket-football-hda', data.data.list)
    })

    // 亚盘变化
    this.socket.register('P09', data => {
      emitter.$emit('socket-football-ah', data.data.list)
    })

    // 大小球变化
    this.socket.register('P10', data => {
      emitter.$emit('socket-football-ou', data.data.list)
    })
  }
}
