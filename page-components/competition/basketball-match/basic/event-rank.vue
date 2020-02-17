<template>
  <div class="match-basic-event-rank">
    <div class="event-rank__header">
      <div class="header-title">积分排名</div>
    </div>

    <div v-loading="loading" class="event-rank__teams">
      <EventRankTeam class="home-team" :team-info="homeTeam" />
      <EventRankTeam class="grest-team" :team-info="guestTeam" />
    </div>
  </div>
</template>

<script>
import api from '@/api'
import EventRankTeam from './event-rank-team'

export default {
  components: {
    EventRankTeam,
  },
  props: {
    matchInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      rankInfo: {},
      loading: false,
    }
  },
  computed: {
    homeTeam() {
      const { home_rank: rank, eventInfo } = this.matchInfo
      let { standings } = this.rankInfo

      standings = standings || {}
      return {
        ...this.matchInfo.homeInfo,
        rank,
        event_name: eventInfo.name_js || eventInfo.name,
        ...(standings.Home || {}),
        isEmpty: !standings.Home,
      }
    },
    guestTeam() {
      const { guest_rank: rank, eventInfo } = this.matchInfo
      let { standings } = this.rankInfo

      standings = standings || {}
      return {
        ...this.matchInfo.guestInfo,
        rank,
        event_name: eventInfo.name_js || eventInfo.name,
        ...(standings.Away || {}),
        isEmpty: !standings.Away,
      }
    },
  },
  mounted() {
    this.fetchEventRank()
  },
  methods: {
    fetchEventRank() {
      this.loading = true
      this.$axios
        .get(api.get.basketball.fetchMatchScoreboard, {
          params: {
            match_id: this.matchInfo.id,
          },
        })
        .then(({ code, data, msg }) => {
          if (code !== 0 || !data) {
            throw new Error(msg)
          }

          this.rankInfo = data
        })
        .catch(() => {
          this.rankInfo = {}
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="scss">
.match-basic-event-rank {
  .event-rank__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
    .header-title {
      font-size: 14px;
      font-weight: bold;
    }
    .header-tools {
      display: flex;
      line-height: 34px;
      text-align: center;
      font-size: 14px;
      .tools-item {
        cursor: pointer;
        width: 88px;
        margin-left: 10px;
        background-color: #f3f4fb;
        border-radius: 2px;
        &.active {
          background-color: #e5f1ff;
          color: $color-active;
          font-weight: bold;
        }
      }
    }
  }
  .event-rank__teams {
    display: flex;
    .home-team {
      flex: 1;
      padding-right: 12px;
      .team-tilte {
        background-color: #e5f1ff;
        color: $color-active;
      }
    }
    .grest-team {
      flex: 1;
      .team-tilte {
        background-color: #fef3ee;
        color: #f95d22;
      }
    }
  }
}
</style>
