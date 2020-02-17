<template>
  <div class="video-match-wrap">
    <div class="title">
      <p class="ctx-left">
        <span class="event-name" v-text="matchInfo.eventInfo.name_js || ''" />
        <span class="event-time" v-text="matchStartTime" />
      </p>

      <p class="ctx-right">
        <span>
          {{ matchInfo.homeInfo.name || '' }} VS
          {{ matchInfo.guestInfo.name || '' }}
        </span>
      </p>
    </div>

    <div class="video-section">
      <template v-if="video">
        <iframe class="match-stat__animate" :src="video" />
      </template>

      <template v-else>
        <div class="match-stat__animate no-data">
          <span>暂无直播</span>
        </div>
      </template>
    </div>

    <div class="statistics-section">
      <div :class="['statistics-section-title', { 'bottom-line': statInfo }]">
        <div class="home-team team-box">
          <img v-lazy="matchInfo.homeInfo.icon" />
        </div>

        <div class="middle-message">
          <p class="middle-message-details top-part">{{ raceStatus }}</p>
          <p class="middle-message-details bottom-part">
            {{ temp.home_total }} : {{ temp.guest_total }}
          </p>
        </div>

        <div class="guest-team team-box">
          <img v-lazy="matchInfo.guestInfo.icon" />
        </div>
      </div>

      <div v-if="statInfo" class="progress-wrap">
        <div class="home-label">
          <p
            v-for="(item, index) of homeStatTotal"
            :key="index"
            :class="['progress-list', 'list-font']"
          >
            {{ item | formatValue }}
          </p>
        </div>

        <div class="home-progress">
          <div
            v-for="(item, index) of homeStatTotal"
            :key="index"
            :class="['progress-group']"
          >
            <Progress
              :class="['progress-bar']"
              :max="item.max || 100"
              :value="item.value"
            />
          </div>
        </div>

        <div class="label">
          <div
            v-for="item of label"
            :key="item"
            :class="['progress-list', 'list-font']"
          >
            {{ item }}
          </div>
        </div>

        <div class="guest-progress">
          <div
            v-for="(item, index) of guestStatTotal"
            :key="index"
            :class="['progress-group']"
          >
            <Progress
              :class="['progress-bar']"
              types="guest"
              :max="item.max || 100"
              :value="item.value"
            />
          </div>
        </div>

        <div class="guest-label">
          <p
            v-for="(item, index) of guestStatTotal"
            :key="index"
            :class="['progress-list', 'list-font']"
          >
            {{ item | formatValue }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import api from '@/api'
import emitter from '@/utils/emitter'
import {
  basketballMatchId2Status,
  basketballOngoing,
  basketballMatchEnd,
} from '@/utils/status'
import Progress from './video-progress'

const TAB_LIST = [
  '投篮',
  '三分',
  '罚球',
  '进攻',
  '防守',
  '总数',
  '助攻',
  '犯规',
  '抢断',
  '失误',
  '盖帽',
  '快攻',
  '扣篮',
]

export default {
  components: { Progress },
  filters: {
    formatValue(value) {
      if (value.max) {
        const result = Math.round((value.value / value.max) * 100)
        return value.value + '/' + value.max + ' (' + result + '%)'
      } else {
        return value.value
      }
    },
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
      temp: this.matchInfo,
      homeStatTotal: [],
      guestStatTotal: [],
      statInfo: null,
      video: null,
    }
  },
  computed: {
    label() {
      return this.matchInfo.eventInfo.name_js === 'CBA'
        ? TAB_LIST
        : TAB_LIST.slice(0, 11)
    },

    matchStartTime() {
      if (!this.temp) {
        return
      }
      return dayjs(Number(this.temp.time)).format('YYYY/MM/DD HH:mm')
    },

    raceStatus() {
      const { status, r_time: runTime } = this.temp
      const statusName = basketballMatchId2Status(status)
      if (basketballOngoing(status)) {
        return `${statusName} ${runTime}'`
      }

      return statusName
    },
  },
  mounted() {
    const isEnd = basketballMatchEnd(this.matchInfo.status)
    const isOngoing = basketballOngoing(this.matchInfo.status)

    this.fetchCalcSta(Number(this.matchId))
    if (isEnd || isOngoing) {
      this.fetchMatchVideoUrl(Number(this.matchId))
    }

    emitter.$on('socket-basketball-stat', this.changeSocketStat)
    emitter.$on('socket-basketball-gold', this.changeSocketGold)
  },
  beforeDestroy() {
    emitter.$off('socket-basketball-stat', this.changeSocketStat)
    emitter.$off('socket-basketball-gold', this.changeSocketGold)
  },
  methods: {
    // 比赛技术统计
    fetchCalcSta(matchId) {
      this.$axios
        .get(api.get.basketball.fetchBasketballTeamSquare, {
          match_id: matchId,
        })
        .then(({ code, data }) => {
          if (!data || code !== 0) {
            throw new Error('篮球技术统计信息获取失败')
          }

          this.statInfo = data.stat
          this.handleDataFormat()
        })
        .catch(() => {
          this.statInfo = null
        })
    },

    // 处理比赛数据格式
    handleDataFormat() {
      const {
        home_stat_total: homeStatTotal,
        guest_stat_total: guestStatTotal,
      } = this.statInfo

      // 初始化置空
      this.homeStatTotal = []
      this.guestStatTotal = []

      if (homeStatTotal) {
        homeStatTotal.forEach((item, index) => {
          const obj = {}

          if (index > 0) {
            if (item === '' || item === '0') {
              obj.value = 0
            } else if (index < 4) {
              // 前三项数据做特殊处理
              obj.value = Number(item.split('-')[0])
              obj.max = Number(item.split('-')[1])
            } else {
              obj.value = Number(item)
            }

            this.homeStatTotal.push(obj)
          }
        })
      }

      if (guestStatTotal) {
        guestStatTotal.forEach((item, index) => {
          const obj = {}

          if (index > 0) {
            if (item === '' || item === '0') {
              obj.value = 0
            } else if (index < 4) {
              obj.value = Number(item.split('-')[0])
              obj.max = Number(item.split('-')[1])
            } else {
              obj.value = Number(item)
            }

            this.guestStatTotal.push(obj)
          }
        })
      }

      // CBA赛才有快攻、扣篮数据，不显示半场比分，将其数据从数组中删除
      if (!(this.matchInfo.eventInfo.name_js === 'CBA')) {
        this.homeStatTotal = this.homeStatTotal.slice(0, 11)
        this.guestStatTotal = this.guestStatTotal.slice(0, 11)
      } else {
        this.homeStatTotal.splice(11, 1)
        this.guestStatTotal.splice(11, 1)
      }
    },

    // 动态过去技术统计
    changeSocketStat(value) {
      if (Number(value.mid) !== Number(this.matchId)) {
        return
      }
      this.statInfo = {
        ...this.statInfo,
        ...value.ext,
      }
      this.handleDataFormat()
    },

    // 比分改变
    changeSocketGold(value) {
      if (Number(value.mid) !== Number(this.matchId)) {
        return
      }
      this.temp = {
        ...this.temp,
        ...value.ext,
      }
    },

    // 获取比赛视频链接
    fetchMatchVideoUrl(matchId) {
      this.$axios
        .get(api.get.basketball.fetchBasketballVideoURL, {
          params: { match_id: matchId },
        })
        .then(({ code, data }) => {
          if (code !== 0 || !data) {
            throw new Error('获取视频链接失败')
          }
          this.video = data.animateUrl
        })
        .catch(() => {
          this.video = ''
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.video-match-wrap {
  background-color: $color-white;
  width: 687px;

  .title {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    display: flex;
    justify-content: space-between;
    font-size: $font-size-middle;
    color: #666;
    font-family: $font-family-no-number;
    height: 45px;
    line-height: 45px;
    font-weight: bold;
    box-shadow: 0 0 4px 0 rgba(51, 51, 51, 0.08);

    .ctx-left {
      padding-left: 14px;
    }

    .ctx-right {
      padding-right: 14px;
    }

    .event-name {
      margin-right: 20px;
    }
  }

  .video-section {
    padding: 12px 12px 9px 12px;

    .match-stat__animate {
      border: none;
      width: 663px;
      height: 370px;
      overflow: hidden;
      &.no-data {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #333333;
        color: $color-white;
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

  .statistics-section {
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    .progress-wrap {
      width: calc(100% - 24px);
      padding: 10px 0;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;

      .progress-list {
        height: 20px;
      }

      .home-label {
        width: 72px;
        text-align: right;
      }

      .guest-label {
        width: 72px;
      }

      .progress-group {
        height: 20px;
        position: relative;

        .progress-bar {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          left: 0;
        }
      }

      .list-font {
        color: #666;
        line-height: 20px;
        font-family: $font-family-no-number;
        font-size: $font-size-small;
      }

      .guest-progress,
      .home-progress {
        width: 220px;
      }
    }

    .statistics-section-title {
      width: calc(100% - 24px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;
      padding-bottom: 10px;

      &.bottom-line {
        border-bottom: 1px #efefef solid;
      }

      .home-team {
        margin-left: 8px;
      }

      .guest-team {
        margin-right: 8px;
      }

      .team-box {
        width: 26px;
        height: 26px;
        position: relative;

        img {
          max-width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
        }
      }

      .middle-message {
        text-align: center;
        color: #666;
        font-family: $font-family-no-number;

        .top-part {
          font-size: $font-size-middle;
        }

        .bottom-part {
          font-size: $font-size-large;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
