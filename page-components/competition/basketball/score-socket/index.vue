<template>
  <SocketDialog
    v-model="showMessage"
    :placement="setting.dialog_position"
    :title="`${eventType}提示`"
    :on-close="onCloseSocketMessage"
    :duration="30000"
  >
    <template v-if="messageInfo">
      <div class="basketball-socket-dialog__message">
        <span
          class="event-block"
          :title="
            setting.lang === 'zh'
              ? messageInfo.event.name_js || messageInfo.event.name
              : messageInfo.event.name_e ||
                messageInfo.event.name_js ||
                messageInfo.event.name
          "
          :style="{
            borderColor: `#${messageInfo.event.color}`,
          }"
        >
          {{
            setting.lang === 'zh'
              ? messageInfo.event.name_js || messageInfo.event.name
              : messageInfo.event.name_e ||
                messageInfo.event.name_js ||
                messageInfo.event.name
          }}
        </span>

        <span class="time">
          {{ fetchStatus(messageInfo.ext.status) }}
          {{ messageInfo.ext.r_time ? `${messageInfo.ext.r_time}'` : '' }}
        </span>

        <span class="team">
          <b
            class="team-name"
            :title="
              setting.lang === 'zh'
                ? messageInfo.host.name
                : messageInfo.host.name_e || messageInfo.host.name
            "
            :class="{ active: [0, 1].includes(Number(messageInfo.trigger)) }"
          >
            {{
              setting.lang === 'zh'
                ? messageInfo.host.name
                : messageInfo.host.name_e || messageInfo.host.name
            }}
          </b>
          <b>
            <span
              :class="{
                active: [0, 1].includes(Number(messageInfo.trigger)),
              }"
              v-text="messageInfo.ext.home_total"
            />
            -
            <span
              :class="{
                active: [0, 2].includes(Number(messageInfo.trigger)),
              }"
              v-text="messageInfo.ext.guest_total"
            />
          </b>
          <b
            class="team-name"
            :title="
              setting.lang === 'zh'
                ? messageInfo.guest.name
                : messageInfo.guest.name_e || messageInfo.guest.name
            "
            :class="{ active: [0, 2].includes(Number(messageInfo.trigger)) }"
          >
            {{
              setting.lang === 'zh'
                ? messageInfo.guest.name
                : messageInfo.guest.name_e || messageInfo.guest.name
            }}
          </b>
        </span>
      </div>
    </template>
  </SocketDialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import emitter from '@/utils/emitter'
import {
  basketballOngoing,
  basketballMatchEnd,
  basketballMatchId2Status,
} from '@/utils/status'

import SocketDialog from '@/components/socket-dialog'

const COMPANYS = {
  澳门: 1,
  威廉希尔: 2,
  易胜博: 3,
  '12BET': 4,
  皇冠: 5,
  立博: 6,
  金宝博: 7,
  '10BET': 8,
}

export default {
  components: {
    SocketDialog,
  },
  props: {
    filter: Object,
    onChangeSound: Function,
  },
  data() {
    return {
      showMessage: false,
      messageInfo: null,
      eventType: '',
    }
  },
  computed: {
    ...mapState('competition-basketball', [
      'scoreList',
      'pinnedList',
      'setting',
    ]),
    oddCompanyId() {
      return Number(COMPANYS[this.filter.company])
    },
  },
  watch: {
    $route() {
      this.showMessage = false
    },
  },
  mounted() {
    this.onSocketMessage()
  },
  beforeDestroy() {
    this.removeListenMessage()
  },
  methods: {
    ...mapActions('competition-basketball', [
      'OnChangeScoreList',
      'MergeScoreList',
      'MoveItem2End',
      'MoveItem2OtherStatus',
    ]),
    onCloseSocketMessage() {
      this.messageInfo = null
    },
    fetchStatus(key) {
      return basketballMatchId2Status(key)
    },
    removeListenMessage() {
      emitter.$off('socket-basketball-status', this.changeSocketStatus)
      emitter.$off('socket-basketball-gold', this.changeSocketGold)
      emitter.$off('socket-basketball-hda', this.changeSocketHda)
      emitter.$off('socket-basketball-ah', this.changeSocketAh)
      emitter.$off('socket-basketball-ou', this.changeSocketOu)
    },
    onSocketMessage() {
      emitter.$on('socket-basketball-status', this.changeSocketStatus)
      emitter.$on('socket-basketball-gold', this.changeSocketGold)
      emitter.$on('socket-basketball-hda', this.changeSocketHda)
      emitter.$on('socket-basketball-ah', this.changeSocketAh)
      emitter.$on('socket-basketball-ou', this.changeSocketOu)
    },
    changeSocketStatus(value) {
      if (Number(value.event) !== 100) {
        return
      }
      console.log('篮球状态变更', value)

      const isEnd = basketballMatchEnd(value.ext.status)
      if (isEnd) {
        setTimeout(() => {
          this.MoveItem2End(value.mid)
        }, 3 * 60 * 1000)
      }

      if ([12, 13, 14, 16].includes(value.ext.status)) {
        this.MoveItem2OtherStatus(value.mid)
      }

      this.OnChangeScoreList({
        ids: [value.mid],
        newValue: {
          ongoing: basketballOngoing(value.ext.status),
          isEnd,
          time: {
            status: value.ext.status,
            runTime: Number(value.ext.r_time),
          },
        },
      })
    },
    changeSocketHda(value) {
      const hdaList = (value || []).filter(item => {
        return item.company_id === this.oddCompanyId
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
        return item.company_id === this.oddCompanyId
      })
      if (!ahList || !ahList.length) {
        return
      }

      this.MergeScoreList(
        value.map(item => {
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
        return item.company_id === this.oddCompanyId
      })
      if (!ouList || !ouList.length) {
        return
      }

      this.MergeScoreList(
        value.map(item => {
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
    changeSocketGold(value) {
      if (!Number(value.ext.home_total) && !Number(value.ext.guest_total)) {
        return
      }
      console.log('篮球比分变更(orange)', value)
      const item = value.ext
      const fromatValue = {
        home: {
          total: item.home_total,
          half: item.home_h,
          first: item.home_first,
          second: item.home_second,
          third: item.home_third,
          fourth: item.home_fourth,
        },
        guest: {
          total: item.guest_total,
          half: item.guest_h,
          first: item.guest_first,
          second: item.guest_second,
          third: item.guest_third,
          fourth: item.guest_fourth,
        },
      }
      this.OnChangeScoreList({
        ids: [value.mid],
        newValue: {
          score: fromatValue,
          ongoing: basketballOngoing(item.status),
          isEnd: basketballMatchEnd(item.status),
          time: {
            status: item.status,
            runTime: item.r_time,
          },
        },
      })

      if (!basketballOngoing(item.status)) {
        return
      }

      const goldMatch = this.scoreList.find(item => {
        return Number(item.id) === Number(value.mid)
      })

      if (!goldMatch) {
        return
      }

      if (Number(this.setting.pinned)) {
        if (!this.pinnedList.includes(String(goldMatch.id))) {
          return
        }
      }

      console.log('篮球比分变更(format)', fromatValue)

      this.onChangeSound(
        value.trigger === 1 ? this.setting.video.home : this.setting.video.guest
      )

      this.showMessage = true
      this.eventType = '进球'
      this.messageInfo = {
        ...value,
        ...goldMatch,
      }
    },
  },
}
</script>

<style lang="scss">
.basketball-socket-dialog__message {
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  .event-block {
    border-left: 3px solid transparent;
    padding-left: 12px;
    max-width: 6em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .time {
    width: 10em;
    text-align: center;
  }
  .team {
    padding-right: 10px;
    flex: 1;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .active {
      color: #e1243b;
    }
    .team-name {
      padding: 0 8px;
      max-width: 7em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .card-yellow,
  .card-red {
    display: inline-block;
    vertical-align: top;
    padding: 0 2px;
    text-align: center;
    border-radius: 2px;
    color: white;
    margin: 0 2px;
  }
  .card-yellow {
    background-color: #f7b500;
  }
  .card-red {
    background-color: #e1243b;
  }
}
</style>
