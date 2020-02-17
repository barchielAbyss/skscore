<template>
  <div class="intelligence-match">
    <div class="intelligence-match_title card">
      <template v-if="matchInfo">
        <MatchScoreInfo :match-info="matchInfo" />
      </template>

      <div class="intelligence-match__tabs">
        <NuxtLink
          v-for="tab of tabs"
          :key="tab.value"
          :to="{
            name: tab.route,
            params: {
              id: matchId,
            },
          }"
          class="tab-item"
          v-text="tab.label"
        />
      </div>
    </div>

    <RouterView
      v-if="matchInfo"
      class="intelligence-match__main"
      :match-info="matchInfo"
      :match-id="matchId"
    />
  </div>
</template>

<script>
import api from '@/api'
import emitter from '@/utils/emitter'
import { footballOngoing, footballMatchEnd } from '@/utils/status'

import Message from '@/utils/football-message'

import MatchScoreInfo from '@/page-components/competition/football-match/match-score-info.vue'

const TABS = [
  { label: '实况直播', route: 'competition-football-match-id-live' },
  { label: '分析数据', route: 'competition-football-match-id-basic' },
  { label: '情报前瞻', route: 'competition-football-match-id-news' },
  { label: '专家方案', route: 'competition-football-match-id-plan' },
  { label: '欧洲指数', route: 'competition-football-match-id-hda' },
  { label: '亚洲指数', route: 'competition-football-match-id-ah' },
  { label: '进球指数', route: 'competition-football-match-id-ou' },
]

export default {
  components: {
    MatchScoreInfo,
  },
  async asyncData({ $axios, params }) {
    const matchData = await Promise.resolve(
      $axios
        .get(api.get.football.fetchMatchInfo, {
          params: {
            match_id: params.id,
          },
        })
        .then(({ data }) => {
          return data
        })
    )

    return { matchData }
  },
  data() {
    return {
      curTab: 'video',
      socket: null,
    }
  },
  computed: {
    tabs: () => TABS,
    matchId() {
      return this.$route.params.id
    },
    matchInfo() {
      return this.matchData ? this.formatData(this.matchData) : null
    },
  },

  mounted() {
    this.startMatchSocket()
    emitter.$on('socket-football-status', this.changeSocketStatus)
    emitter.$on('socket-football-gold', this.changeSocketGold)
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.destroy()
    }
    emitter.$off('socket-football-status', this.changeSocketStatus)
    emitter.$off('socket-football-gold', this.changeSocketGold)
  },
  methods: {
    // 获取比赛信息
    startMatchSocket() {
      this.socket = new Message()
    },
    // 处理返回值的格式
    formatData(data) {
      const eventInfo = data.events[data.match.event_id]
      const homeTeam = data.teams[data.match.home_team_id]
      const guestTeam = data.teams[data.match.guest_team_id]
      const isStart =
        footballOngoing(data.match.status) ||
        footballMatchEnd(data.match.status)

      return {
        ...data.match,
        isStart,
        home: homeTeam,
        guest: guestTeam,
        event: eventInfo,
      }
    },

    // socket 状态改变
    changeSocketStatus(value) {
      if (Number(value.mid) !== Number(this.matchId)) {
        return
      }

      this.$set(this.matchData, 'match', {
        ...this.matchData.match,
        ...value.ext,
      })
    },

    changeSocketGold(value) {
      if (Number(value.mid) !== Number(this.matchId)) {
        return
      }
      const [homeSocre, grestScore] = value.ext.score.split('-')

      this.$set(this.matchData, 'match', {
        ...this.matchData.match,
        home_goal_all: homeSocre,
        guest_goal_all: grestScore,
      })
    },
  },
}
</script>

<style lang="scss">
.intelligence-match {
  font-size: 12px;

  .card {
    box-shadow: 0 0 4px 0 rgba(51, 51, 51, 0.08);
    border-radius: 8px;
  }
  .intelligence-match_title {
    overflow: hidden;
  }
  .intelligence-match__header {
    padding: 10px;
    background-color: $color-white;
    background-image: url('~assets/images/intelligence/football-bg.png');
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: bottom center;
    .header-time {
      color: #666;
      text-align: center;
    }
    .header-score {
      display: flex;
      .score {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        .other-info {
          width: 100px;
          text-align: center;
        }
        .home-score,
        .guest-score {
          font-size: 40px;
          color: #333;
          &.gray {
            color: #999;
          }
        }
      }
      .home-team {
        text-align: right;
        .team-icon {
          margin-left: 6px;
        }
      }
      .guest-team {
        .team-icon {
          margin-right: 6px;
        }
      }
      .home-team,
      .guest-team {
        width: 32%;
        font-size: 16px;
        font-weight: bold;
        line-height: 62px;
        .team-icon {
          display: inline-block;
          text-align: center;
          width: 60px;
          height: 60px;
          border-radius: 0 0 50% 50%;
          border: 2px $color-white solid;
          background-color: $color-white;
          vertical-align: middle;
          overflow: hidden;
          > img {
            max-height: 100%;
            vertical-align: middle;
          }
        }
      }
    }
    .header-address {
      padding-top: 8px;
      text-align: center;
      color: $color-white;
    }
  }
  .intelligence-match__tabs {
    background: $color-white;
    font-size: 14px;
    line-height: 44px;
    display: flex;
    padding: 0 24%;
    justify-content: space-between;
    .tab-item {
      border-bottom: 1px solid transparent;
      padding: 0 4px;
      &.nuxt-link-active {
        font-weight: bold;
        color: $color-active;
        border-bottom-color: $color-active;
      }
    }
  }
  .intelligence-match__main {
    margin-top: 12px;
  }
}

.competition-football-match-id-video {
  &.main-content {
    width: 1300px;
  }
  .intelligence-match {
    padding-left: 300px;
  }
  .home-flex-box {
    margin-left: 650px;
  }
}
</style>
