<template>
  <div class="head-score-wrap set-shadow">
    <div class="head-msg">
      <p class="top-title">{{ temp.eventInfo.name }} {{ titleTime }}</p>

      <div class="middle-section">
        <!--    主队部分    -->
        <div class="team-section home-section">
          <NuxtLink
            :to="{
              name: 'archive-team-detail',
              query: {
                eventId: temp.eventInfo.id,
                eventName: temp.eventInfo.name_js,
                sportType: 'basketball',
                teamId: temp.homeInfo.id,
              },
            }"
          >
            <span class="team-ctx">{{ temp.homeInfo.name }}</span>
            <span class="team-icon team-home">
              <img v-lazy="temp.homeInfo.icon" />
            </span>
          </NuxtLink>
        </div>

        <!--    比分部分    -->
        <div class="score-section">
          <p class="font-score">{{ isStart ? temp.home_total : '' }}</p>

          <div class="score-details">
            <p class="current-time">
              {{ raceStatus }}
            </p>
            <p v-show="isStart" class="half-score">
              ({{ temp.home_h }}-{{ temp.guest_h }})
            </p>
          </div>

          <p class="font-score">{{ isStart ? temp.guest_total : '' }}</p>
        </div>

        <!--    客队部分    -->
        <div class="team-section">
          <NuxtLink
            :to="{
              name: 'archive-team-detail',
              query: {
                eventId: temp.eventInfo.id,
                eventName: temp.eventInfo.name_js,
                sportType: 'basketball',
                teamId: temp.guestInfo.id,
              },
            }"
          >
            <span class="team-icon team-guest">
              <img v-lazy="temp.guestInfo.icon" />
            </span>
            <span class="team-ctx">{{ temp.guestInfo.name }}</span>
          </NuxtLink>
        </div>
      </div>

      <p class="bottom-underground">场地：{{ temp.city || '未知' }}</p>
    </div>

    <div class="basketball-match-nav">
      <NuxtLink
        v-for="item of navList"
        :key="item.value"
        :to="{
          name: item.route,
          params: {
            id: matchId,
          },
        }"
        class="nav-item"
        v-text="item.label"
      />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import emitter from '@/utils/emitter'
import {
  basketballOngoing,
  basketballMatchEnd,
  basketballMatchId2Status,
} from '@/utils/status'

const WEEK_LIST = {
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  0: '日',
}
const TAB_LIST = [
  { label: '实况', route: 'competition-basketball-match-id-video' },
  { label: '基本面', route: 'competition-basketball-match-id-basic' },
  { label: '赔率', route: 'competition-basketball-match-id-odds' },
]

export default {
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
    }
  },
  computed: {
    isStart() {
      const { status } = this.temp

      return basketballOngoing(status) || basketballMatchEnd(status)
    },
    raceStatus() {
      const { status, r_time: runTime } = this.temp
      const statusName = basketballMatchId2Status(status)
      if ([1, 3, 5, 7, 10].includes(Number(status))) {
        return `${statusName} ${runTime}'`
      }

      return statusName
    },
    navList: () => TAB_LIST,
    titleTime() {
      const timeObj = dayjs(Number(this.temp.time))
      return `${timeObj.format('YYYY-MM-DD HH:mm')} 星期${
        WEEK_LIST[timeObj.$W]
      }`
    },
  },
  beforeDestroy() {
    emitter.$off('socket-basketball-gold', this.matchStatusChange)
    emitter.$off('socket-basketball-status', this.matchStatusChange)
  },
  mounted() {
    emitter.$on('socket-basketball-gold', this.matchStatusChange)
    emitter.$on('socket-basketball-status', this.matchStatusChange)
  },
  methods: {
    // 比赛状态改变
    matchStatusChange(value) {
      if (Number(value.mid) !== Number(this.matchId)) {
        return
      }
      this.temp = {
        ...this.temp,
        ...value.ext,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.head-score-wrap {
  width: 1000px;
  border-radius: 8px;
  background-color: #fff;

  &.set-shadow {
    box-shadow: 0 0 4px 0 rgba(51, 51, 51, 0.08);
  }

  .head-msg {
    background-image: url('~assets/images/intelligence/basketball-bg.png');
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: bottom center;
    padding: 10px;

    .top-title {
      color: #666;
      font-size: $font-size-small;
      text-align: center;
    }

    .middle-section {
      padding-bottom: 10px;
      display: flex;

      .team-icon {
        display: inline-block;
        text-align: center;
        width: 60px;
        height: 60px;
        border-radius: 0 0 50% 50%;
        border: 2px #fff solid;
        background-color: #fff;
        vertical-align: middle;
        overflow: hidden;

        img {
          max-width: 100%;
          height: 100%;
        }
      }

      .font-score {
        color: $font-title-color;
        font-size: 40px;
      }

      .team-ctx {
        font-size: $font-size-large;
        font-weight: bold;
      }

      .team-home {
        margin-left: 6px;
      }

      .team-guest {
        margin-right: 6px;
      }

      .home-section {
        text-align: right;
      }

      .team-section {
        width: 32%;
      }

      .score-section {
        flex: 1;
        display: flex;
        justify-content: center;

        .score-details {
          width: 120px;
          text-align: center;

          .current-time {
            width: 100px;
            margin: 10px auto 5px auto;
            font-weight: bold;
            font-size: $font-size-middle;
          }

          .half-score {
            width: 100px;
            margin: 0 auto;
            font-size: $font-size-small;
          }
        }
      }
    }

    .bottom-underground {
      color: $color-white;
      font-size: $font-size-small;
      text-align: center;
    }
  }

  .basketball-match-nav {
    font-size: 14px;
    line-height: 44px;
    display: flex;
    padding: 0 24%;
    justify-content: space-between;
    .nav-item {
      border-bottom: 1px solid transparent;
      padding: 0 4px;
      &.nuxt-link-active {
        font-weight: bold;
        color: $color-active;
        border-bottom-color: $color-active;
      }
    }
  }
}
</style>
