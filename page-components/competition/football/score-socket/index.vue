<template>
  <div>
    <div class="gold-score-dialog">
      <transition name="el-fade-in">
        <div v-show="goldMsgArr.length > 0">
          <ComponentNotify
            v-for="item of goldMsgArr"
            :key="item.mid"
            :class="['bottom-line']"
            :message-info="item"
            :lang="setting.lang"
            @scoreDialogClose="scoreDialogClose(item)"
          />
        </div>
      </transition>
    </div>

    <!-- 测试用 -->
    <div class="mock-btn">
      <ElButton size="small" type="primary" @click="mockGold"
        >模拟进球</ElButton
      >
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import emitter from '@/utils/emitter'
import {
  footballOngoing,
  footballMatchEnd,
  fetchFootballMatchTime,
} from '@/utils/status'
import ComponentNotify from './notification'

const SOCKET_CARD_EVENT_IDS = [3, 5]
const GOLD_TIME = 30000
const COMPANYS = {
  ah: {
    Bet365: 4,
    澳门: 6,
    皇冠: 12,
  },
  hda: {
    Bet365: 17,
    澳门: 250,
    皇冠: 308,
  },
}
export default {
  components: { ComponentNotify },
  props: {
    filter: Object,
    onChangeSound: Function,
  },
  data() {
    return {
      showMessage: false,
      messageInfo: null,
      eventType: '',
      goldMsgArr: [], // 进球消息数组
      mockMid: ['10086', '10087', '10088', '10089'], // 测试进球比分弹框使用
      mockCount: 0, // 测试进球比分弹框使用
    }
  },
  computed: {
    ...mapState('user', ['serverTime']),
    ...mapState('competition-football', ['scoreList', 'pinnedList', 'setting']),
    oddCompanyId() {
      return {
        ah: Number(COMPANYS.ah[this.filter.company]),
        hda: Number(COMPANYS.hda[this.filter.company]),
      }
    },
    homeCard() {
      const { card } = this.messageInfo
      return {
        yellow: card.yellow ? Number(card.yellow.home) : '',
        red: card.red ? Number(card.red.home) : '',
      }
    },
    guestCard() {
      const { card } = this.messageInfo
      return {
        yellow: card.yellow ? Number(card.yellow.guest) : '',
        red: card.red ? Number(card.red.guest) : '',
      }
    },
  },
  watch: {
    $route() {
      this.showMessage = false
    },
  },
  created() {
    this.onSocketMessage()
  },
  beforeDestroy() {
    this.removeListenMessage()
  },
  methods: {
    ...mapActions('competition-football', [
      'OnChangeScoreList',
      'MergeScoreList',
      'MoveItem2End',
      'MoveItem2OtherStatus',
    ]),
    onCloseSocketMessage() {
      this.messageInfo = null
    },
    removeListenMessage() {
      this.goldMsgArr = []
      emitter.$off('socket-football-status', this.changeSocketStatus)
      emitter.$off('socket-football-event', this.changeSocketEvent)
      emitter.$off('socket-football-hda', this.changeSocketHda)
      emitter.$off('socket-football-ah', this.changeSocketAh)
      emitter.$off('socket-football-ou', this.changeSocketOu)
      emitter.$off('socket-football-gold', this.changeSocketGold)
    },
    onSocketMessage() {
      emitter.$on('socket-football-status', this.changeSocketStatus)
      emitter.$on('socket-football-event', this.changeSocketEvent)
      emitter.$on('socket-football-hda', this.changeSocketHda)
      emitter.$on('socket-football-ah', this.changeSocketAh)
      emitter.$on('socket-football-ou', this.changeSocketOu)
      emitter.$on('socket-football-gold', this.changeSocketGold)
    },

    // 比赛状态变更
    changeSocketStatus(value) {
      if (Number(value.event) !== 100) {
        return
      }
      console.log('比赛状态变更', value)
      const isOngoing = footballOngoing(value.ext.status)
      const isEnd = footballMatchEnd(value.ext.status)
      const isStart = isOngoing || isEnd

      if (isEnd) {
        setTimeout(() => {
          this.MoveItem2End(value.mid)
        }, 40 * 1000)
      }

      if ([5, 13, 15].includes(value.ext.status)) {
        this.MoveItem2OtherStatus(value.mid)
      }

      const statusValue = Number(value.ext.t_start_time)
        ? {
            value: value.ext.status,
            time: Number(value.ext.t_start_time),
          }
        : {
            value: value.ext.status,
          }

      this.OnChangeScoreList({
        ids: [value.mid],
        newValue: {
          isStart,
          status: statusValue,
        },
      })
    },

    // 红黄牌变更
    changeSocketEvent(value) {
      if (!SOCKET_CARD_EVENT_IDS.includes(Number(value.event))) {
        return
      }
      console.log('红黄牌变更', value)

      const { yellow, red } = value.ext
      this.OnChangeScoreList({
        ids: [value.mid],
        newValue: {
          card: {
            yellow: {
              home: Number(yellow.home),
              guest: Number(yellow.guest),
            },
            red: {
              home: Number(red.home),
              guest: Number(red.guest),
            },
          },
        },
      })

      const goldMatch = this.scoreList.find(item => {
        return Number(item.id) === Number(value.mid)
      })

      if (!goldMatch) {
        return
      }

      if (
        this.setting.dialog.includes('red') &&
        [4].includes(Number(value.event))
      ) {
        this.showMessage = true
        this.eventType = '红牌'
        this.messageInfo = {
          ...value,
          ...goldMatch,
        }
      }
    },

    // 指数数据变更
    changeSocketHda(value) {
      const hdaList = (value || []).filter(item => {
        return item.company_id === this.oddCompanyId.hda
      })
      if (!hdaList || !hdaList.length) {
        return
      }

      this.MergeScoreList(
        hdaList.map(item => {
          return {
            mid: item.mid,
            key: 'exponential',
            value: {
              hda: item.odd,
            },
          }
        })
      )
    },

    changeSocketAh(value) {
      const ahList = (value || []).filter(item => {
        return item.company_id === this.oddCompanyId.ah
      })

      if (!ahList || !ahList.length) {
        return
      }

      this.MergeScoreList(
        ahList.map(item => {
          return {
            mid: item.mid,
            key: 'exponential',
            value: {
              ah: item.odd,
            },
          }
        })
      )
    },

    changeSocketOu(value) {
      const ouList = (value || []).filter(item => {
        return item.company_id === this.oddCompanyId.ah
      })

      if (!ouList || !ouList.length) {
        return
      }

      this.MergeScoreList(
        ouList.map(item => {
          return {
            mid: item.mid,
            key: 'exponential',
            value: {
              ou: item.odd,
            },
          }
        })
      )
    },
    // --------------------

    // 进球数据变更
    changeSocketGold(value) {
      console.log('进球数据变更', value.ext)
      const { minute, status, score } = value.ext
      if ([3].includes(Number(status))) {
        value.ext.minute = parseInt(minute) + 45
      }
      if (parseInt(value.ext.minute) > 90) {
        value.ext.minute = '90+'
      }

      const [homeScore = 0, guestScore = 0] = score.split('-')
      this.OnChangeScoreList({
        ids: [value.mid],
        newValue: {
          score: {
            home: Number(homeScore),
            guest: Number(guestScore),
          },
        },
      })

      if (!Number(minute)) {
        return
      }

      const goldMatch = this.scoreList.find(item => {
        return Number(item.id) === Number(value.mid)
      })

      if (!goldMatch || !footballOngoing(goldMatch.status.value)) {
        return
      }

      if (Number(this.setting.pinned)) {
        if (!this.pinnedList.includes(String(goldMatch.id))) {
          return
        }
      }

      console.log(
        'format',
        `${value.ext.minute}`,
        `赛事流时间 ${fetchFootballMatchTime(
          status,
          goldMatch.status.time,
          this.serverTime
        )}`,
        `${goldMatch.home.name} ${homeScore} - ${guestScore} ${goldMatch.home.name}`
      )

      this.onChangeSound(
        value.trigger === 1 ? this.setting.video.home : this.setting.video.guest
      )

      if (this.setting.dialog.includes('score')) {
        this.showMessage = true
        this.eventType = '进球'
        this.messageInfo = {
          ...value,
          ...goldMatch,
        }

        const mid = this.messageInfo.mid
        this.messageInfo.t = setTimeout(() => {
          this.deleteMsg(mid)
        }, GOLD_TIME)
        this.goldMsgArr.push(this.messageInfo)
      }
    },

    deleteMsg(mid) {
      const index = this.goldMsgArr.findIndex(item => mid === item.mid)
      if (this.goldMsgArr[index].t) {
        clearTimeout(this.goldMsgArr[index].t)
      }
      this.goldMsgArr.splice(index, 1)
    },

    scoreDialogClose(item) {
      this.deleteMsg(item.mid)
    },

    // 模拟进球
    mockGold() {
      const mockData = {
        mid: this.mockMid[this.mockCount],
        trigger: 1,
        ext: { minute: 18 },
        event: { name: 'LOL 世界赛' },
        home: { name: 'FPX' },
        guest: { name: 'SKT1' },
        score: { guest: 5, home: 8 },
        t: null,
      }

      const mid = mockData.mid
      mockData.t = setTimeout(() => {
        this.deleteMsg(mid)
      }, 5000)
      this.goldMsgArr.push(mockData)
      if (this.mockCount < 4) {
        this.mockCount++
      }
    },
  },
}
</script>

<style scoped lang="scss">
.gold-score-dialog {
  box-shadow: 0 0 6px 2px rgba(0, 55, 175, 0.27);
  position: fixed;
  top: 193px;
  left: calc(50% - 20px);
  z-index: 99;
  border-radius: 4px;
  background-color: $color-white;
  transform: translateX(-50%);

  .bottom-line {
    border-bottom: 1px rgba(0, 55, 175, 0.1) dashed;
  }

  .bottom-line:last-of-type {
    border-bottom: none;
  }
}

.dialog-wrap {
  border-radius: 4px;

  .bottom-line {
    border-bottom: 1px rgba(0, 55, 175, 0.1) dashed;
  }

  .bottom-line:last-of-type {
    border-bottom: none;
  }
}

.mock-btn {
  position: fixed;
  left: 0;
  bottom: 50px;
  z-index: 99;
}
</style>
