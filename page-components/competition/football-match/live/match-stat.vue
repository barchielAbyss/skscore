<template>
  <div class="match-stat">
    <div class="match-stat__title">
      <div class="title-left">
        <span class="event-name" v-text="matchInfo.event.name_js || ''" />
        <span class="event-time" v-text="matchStartTime" />
      </div>
      <div class="title-right">
        {{ matchInfo.home.name || '' }} VS
        {{ matchInfo.guest.name || '' }}
      </div>
    </div>
    <template v-if="animateSrc">
      <iframe class="match-stat__animate" :src="animateSrc" />
    </template>
    <template v-else>
      <div class="match-stat__animate no-data">
        <span>暂无直播</span>
      </div>
    </template>

    <MatchProgress :events="statInfo.events" />
    <MatchStatTable :match-info="matchInfo" :stat="statInfo.stat" />
  </div>
</template>

<script>
import dayjs from 'dayjs'

import api from '@/api'
import emitter from '@/utils/emitter'
import { footballMatchEnd } from '@/utils/status'
import MatchStatTable from './match-stat-table'
import MatchProgress from './match-progress'

export default {
  components: {
    MatchProgress,
    MatchStatTable,
  },
  props: {
    matchId: {
      type: [String, Number],
      required: true,
    },
    matchInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      statInfo: {},
      animateSrc: '',
    }
  },
  computed: {
    matchStartTime() {
      if (!this.matchInfo) {
        return
      }
      return dayjs(Number(this.matchInfo.time)).format('YYYY-MM-DD HH:mm')
    },
  },
  mounted() {
    this.fetchMatchStat()
    if (this.matchInfo.isStart) {
      this.fetchAnimateSrc()
    }
    if (!footballMatchEnd(this.matchInfo.status)) {
      this.onMessage()
    }
  },
  beforeDestroy() {
    this.removeMessage()
  },
  methods: {
    fetchMatchStat() {
      this.$axios
        .get(api.get.football.fetchMatchStat, {
          params: {
            match_id: this.matchId,
          },
        })
        .then(({ code, data, msg }) => {
          if (code !== 0) {
            throw new Error(msg || '获取技术统计信息失败')
          }

          this.statInfo = data
        })
        .catch(error => {
          console.warn(error)
        })
    },
    fetchAnimateSrc() {
      this.$axios
        .get(api.get.football.fetchLiveUrl, {
          params: {
            match_id: this.matchId,
          },
        })
        .then(({ code, data, msg }) => {
          if (code !== 0 || !data.animateUrl) {
            throw new Error(msg || '获取赛事视频失败')
          }
          this.animateSrc = data.animateUrl
        })
        .catch(error => {
          console.warn(error)
        })
    },
    onMessage() {
      emitter.$on('socket-football-stat', this.changeSocketStat)
      emitter.$on('socket-football-event', this.changeSocketEvent)
    },
    removeMessage() {
      emitter.$off('socket-football-stat', this.changeSocketStat)
      emitter.$off('socket-football-event', this.changeSocketEvent)
    },
    changeSocketStat(value) {
      if (Number(value.mid) !== Number(this.matchId)) {
        return
      }
      this.statInfo.stat = {
        ...this.statInfo.stat,
        ...value.ext,
      }
    },
    changeSocketEvent(value) {
      if (Number(value.mid) !== Number(this.matchId)) {
        return
      }
      this.statInfo.events.unshift(value.ext)
    },
  },
}
</script>

<style lang="scss" scoped>
.match-stat {
  width: 663px;
  padding: 0 12px 12px;
  background-color: $color-white;

  &__title {
    display: flex;
    font-size: 14px;
    justify-content: space-between;
    line-height: 45px;
    margin: 0 -12px;
    padding: 0 12px;
    box-shadow: 0 0 4px 0 rgba(51, 51, 51, 0.08);
    color: #666;
    font-weight: bold;
    .event-name {
      padding-right: 8px;
    }
  }

  &__animate {
    margin-top: 12px;
    border: none;
    width: 663px;
    height: 370px;
    &.no-data {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #333333;
      color: $color-white;
      width: 663px;
      height: 370px;
      margin-bottom: 10px;
      transform: scale(1);
      > span {
        border-radius: 8px;
        background-color: #5b5b5b;
        font-weight: bold;
        font-size: 14px;
        width: 110px;
        height: 36px;
        line-height: 36px;
        text-align: center;
      }
    }
  }
}
</style>
