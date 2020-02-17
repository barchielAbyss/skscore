<template>
  <div v-loading="loading" class="video-list-wrap">
    <p v-if="liveList.length" class="title">
      当前
      <span class="title-ctx">{{ liveList.length }}场</span>
      正在进行
    </p>

    <p v-if="!liveList.length" class="title">
      当前无赛事
    </p>

    <div class="video-list">
      <a
        v-for="item of liveList"
        :key="item.id"
        :class="[
          'list-item',
          {
            active: $route.params.id === item.id,
          },
        ]"
        :href="
          $router.resolve({
            name: 'competition-basketball-match-id-video',
            params: {
              id: item.id,
            },
          }).href
        "
      >
        <p class="race-name">{{ item.event.name | competitionNameLimit }}</p>
        <p class="home-team">{{ item.home.name | teamNameLimit }}</p>
        <div class="details">
          <p class="time">{{ item.t_start_time | showMinute }}</p>
          <p class="score">
            {{ item.home_goal_all }} - {{ item.guest_goal_all }}
          </p>
        </div>
        <p class="guest-team">{{ item.guest.name | teamNameLimit }}</p>
      </a>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import emitter from '@/utils/emitter'
import { basketballMatchId2Status } from '@/utils/status'
export default {
  filters: {
    competitionNameLimit(val) {
      if (val.length > 5) {
        return val.substring(0, 4) + '...'
      } else {
        return val
      }
    },

    teamNameLimit(val) {
      if (val.length > 6) {
        return val.substring(0, 5) + '...'
      } else {
        return val
      }
    },

    showMinute(val) {
      if (val.length > 10) {
        return new Date(Number(val)).getMinutes() + "'"
      } else {
        return val
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
      liveList: [],
      loading: true,
    }
  },
  mounted() {
    this.fetchLiveList()
    emitter.$on('socket-basketball-status', this.matchStatusChange)
    emitter.$on('socket-basketball-gold', this.matchStatusChange)
  },
  beforeDestroy() {
    emitter.$off('socket-basketball-status', this.matchStatusChange)
    emitter.$off('socket-basketball-gold', this.matchStatusChange)
  },
  methods: {
    // 获取篮球直播列表
    fetchLiveList() {
      this.loading = true
      this.$axios
        .get(api.get.common.fetchMatchLiveList, {
          params: {
            category: 2,
            type: 1,
          },
        })
        .then(({ code, data }) => {
          if (!data || code !== 0) {
            throw new Error('获取篮球直播列表失败')
          }
          this.liveList = this.formatList(data)
        })
        .catch(error => {
          console.warn(error)
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 处理赛事列表
    formatList({ events, matches, teams } = {}) {
      return matches.map(item => {
        const eventInfo = events[item.event_id]
        const homeTeam = teams[item.home_team_id]
        const guestTeam = teams[item.guest_team_id]

        return {
          ...item,
          event: eventInfo,
          home: homeTeam,
          guest: guestTeam,
        }
      })
    },
    // 比赛状态改变 （包括比分和比赛阶段的变化）
    matchStatusChange(value) {
      const match = this.liveList.find(
        item => Number(item.id) === Number(value.mid)
      )
      if (!match) {
        return
      }
      const [homeTotal, guestTotal, rTime, status] = value.ext

      if (homeTotal) {
        match.home_goal_all = homeTotal
      }

      if (guestTotal) {
        match.guest_goal_all = guestTotal
      }

      const statusName = basketballMatchId2Status(status)
      if ([1, 3, 5, 7, 10].includes(Number(status))) {
        match.t_start_time = rTime
      } else {
        match.t_start_time = statusName
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.video-list-wrap {
  border-radius: 8px;

  .title {
    padding: 10px 14px;
    font-family: $font-family-no-number;
    font-size: $font-size-middle;
    color: #222;
    font-weight: bold;

    span.title-ctx {
      color: #e1243b;
    }
  }

  .video-list {
    max-height: 720px;
    overflow: auto;

    .list-item {
      cursor: pointer;
      position: relative;
      border-top: 1px #efefef solid;
      height: 45px;
      font-family: $font-family-no-number;
      font-size: $font-size-small;
      color: #666;
      padding: 0 7px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      &.active {
        color: $color-active;
      }

      &:hover {
        background-color: #f5f5f5;
      }

      .details {
        height: 100%;
        position: relative;
        text-align: center;
        width: 36px;
        margin: 0 15px;
      }

      .time {
        font-size: 10px;
        color: #e1243b;
        position: absolute;
        left: 55%;
        transform: translate(-50%);
        top: 3px;
      }

      .score {
        line-height: 45px;
        height: 45px;
        color: #00a54f;
      }

      .race-name {
        width: 50px;
        margin-right: 10px;
      }

      .home-team,
      .guest-team {
        width: 75px;
      }

      .home-team {
        text-align: right;
      }
    }
  }
}
</style>
