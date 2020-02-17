<template>
  <div class="match-info-box">
    <div class="match-info">
      <p class="match-time">
        {{ eventAndTime }}
      </p>

      <div class="match-score">
        <div class="match-team home-team">
          <span class="team-name">
            {{ fetchTeamName('home') }}
          </span>
          <div class="team-icon">
            <div class="icon-img-box">
              <span class="icon-img">
                <img v-lazy="{ src: matchInfo.home.icon }" />
              </span>
            </div>
          </div>
        </div>
        <div class="match-vs">
          <span
            class="vs-score home-score"
            v-text="matchInfo.isStart ? matchInfo.home_goal_all : ''"
          />
          <div class="vs-status">
            <!-- 进行 || 结束 -->
            <template v-if="matchInfo.isStart">
              <p class="vs-status-type" v-html="`${matchTime}'`" />
              <p
                v-show="![0, 1, 13, 15, 17].includes(Number(matchInfo.status))"
                class="vs-status-time"
                v-text="`(${matchInfo.home_goal_b}-${matchInfo.guest_goal_b})`"
              />
            </template>
            <!-- 其他 -->
            <template v-else>
              <span class="other">vs</span>
            </template>
          </div>
          <span
            class="vs-score guest-score"
            v-text="matchInfo.isStart ? matchInfo.guest_goal_all : ''"
          />
        </div>
        <div class="match-team guest-team">
          <div class="team-icon">
            <div class="icon-img-box">
              <span class="icon-img">
                <img v-lazy="{ src: matchInfo.guest.icon }" />
              </span>
            </div>
          </div>

          <span class="team-name">
            {{ fetchTeamName('guest') }}
          </span>
        </div>
      </div>

      <div class="match-address">场地：{{ matchInfo.court || '未知' }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import dayjs from 'dayjs'

import number2chn from '@/utils/number2chn'
import { fetchFootballMatchTime } from '@/utils/status'

export default {
  components: {},
  props: {
    matchInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState('user', ['serverTime']),
    matchTime() {
      const { status, t_start_time: time } = this.matchInfo
      return fetchFootballMatchTime(+status, +time, this.serverTime)
    },
    eventAndTime() {
      const { event, time } = this.matchInfo
      const eventName = event ? event.name_js || event.name : ''
      const nowTime = dayjs(+time)
      const nowTimeFormat = `${nowTime.format(
        'YYYY-MM-DD HH:mm 星期'
      )}${number2chn(nowTime.day())}`

      return `${eventName} ${nowTimeFormat}`
    },
  },
  methods: {
    fetchTeamName(type) {
      const team = type === 'home' ? this.matchInfo.home : this.matchInfo.guest

      return team ? team.name : ''
    },
  },
}
</script>

<style lang="scss" scoped>
.match-info-box {
  height: 190px;
  margin: 0 -15px;
  border-radius: 14px;
  background: url('/images/match-header-bg.png') no-repeat center center;
  background-size: 100%;
  color: $color-white;
  padding-top: 33px;
  .match-info {
    flex: 1;
  }
  .match-time {
    font-size: 12px;
    padding-bottom: 20px;
    text-align: center;
  }
  .vs-live-icon {
    background: #ffffff;
    box-shadow: 0 6px 8px 3px rgba(255, 219, 0, 0.25);
    border-radius: 4px;
    font-size: 14px;
    color: #ffdb00;
    line-height: 28px;
    width: 50px;
    text-align: center;
    margin: 0 auto -8px;
    opacity: 0;
    &.has-live {
      opacity: 1;
    }
  }
  .match-score {
    display: flex;
    height: 110px;
    justify-content: center;
    align-items: center;
  }
  .match-team {
    flex: 1;
    display: flex;
    align-items: center;
    .team-name {
      font-size: 16px;
      padding: 0 35px;
    }
    &.home-team {
      justify-content: flex-end;
      .team-icon {
        &::after {
          background-color: #003dff;
        }
        &::before {
          background-color: rgba(255, 255, 255, 0.3);
        }
      }
    }
    &.guest-team {
      .team-icon {
        &::after {
          background-color: rgba(255, 255, 255, 0.3);
        }
        &::before {
          background-color: #e1243b;
        }
      }
    }
    .team-icon {
      position: relative;
      width: 86px;
      height: 86px;
      &::after,
      &::before {
        content: '';
        position: absolute;
        z-index: 0;
        display: block;
        width: 54px;
        height: 108px;
        top: -11px;
      }
      &::after {
        left: -11px;
        border-radius: 108px 0 0 108px;
      }
      &::before {
        right: -11px;
        border-radius: 0 108px 108px 0;
      }
      .icon-img-box {
        width: 86px;
        height: 86px;
        border-radius: 50%;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 1;
      }
      .icon-img {
        width: 52px;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        > img {
          min-width: 40px;
          min-height: 40px;
        }
      }
    }
  }
  .match-vs {
    color: $color-white;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 284px;
    height: 100%;
    .vs-status {
      width: 92px;
      font-size: 14px;
      text-align: center;
      .other {
        font-size: 40px;
      }
      .vs-status-time {
        font-size: 12px;
      }
    }
    .vs-score {
      font-family: 'DINAlternate-Bold';
      flex: 1;
      font-size: 40px;
      &.home-score {
        text-align: right;
      }
    }
  }
  .match-address {
    margin-top: -2em;
    text-align: center;
  }
}
</style>
