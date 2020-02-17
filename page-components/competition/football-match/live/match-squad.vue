<template>
  <div v-loading="loading" class="match-squad">
    <div class="title">球队阵容</div>

    <template v-if="matchInfo && lineup">
      <div class="squad-starter-list table-list">
        <div class="home-team">
          <div class="team-title">{{ matchInfo.home.name }} (首发球员)</div>
          <div
            v-for="(user, index) of starter.home"
            :key="index"
            class="team-user"
          >
            <template v-if="user">
              <span class="user-number">{{ user.number }}号</span>
              <span class="user-position">{{ user.position }}</span>
              <span class="user-name">{{ user.name }}</span>
            </template>
          </div>
        </div>

        <div class="guest-team">
          <div class="team-title">{{ matchInfo.guest.name }} (首发球员)</div>
          <div
            v-for="(user, index) of starter.guest"
            :key="index"
            class="team-user"
          >
            <template v-if="user">
              <span class="user-number">{{ user.number }}号</span>
              <span class="user-position">{{ user.position }}</span>
              <span class="user-name">{{ user.name }}</span>
            </template>
          </div>
        </div>
      </div>
      <div class="squad-bench-list table-list">
        <div class="home-team">
          <div class="team-title">{{ matchInfo.home.name }} (后备球员)</div>
          <div
            v-for="(user, index) of bench.home"
            :key="index"
            class="team-user"
          >
            <template v-if="user">
              <span class="user-number">{{ user.number }}号</span>
              <span class="user-position">{{ user.position }}</span>
              <span class="user-name">{{ user.name }}</span>
            </template>
          </div>
        </div>

        <div class="guest-team">
          <div class="team-title">{{ matchInfo.guest.name }} (后备球员)</div>
          <div
            v-for="(user, index) of bench.guest"
            :key="index"
            class="team-user"
          >
            <template v-if="user">
              <span class="user-number">{{ user.number }}号</span>
              <span class="user-position">{{ user.position }}</span>
              <span class="user-name">{{ user.name }}</span>
            </template>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <p class="no-data">暂无</p>
    </template>
  </div>
</template>

<script>
import api from '@/api'

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
      lineup: null,
      loading: false,
    }
  },
  computed: {
    starter() {
      return this.getPlayersByStatus(3)
    },
    bench() {
      return this.getPlayersByStatus(0)
    },
  },
  mounted() {
    this.fetchMatchLineup()
  },
  methods: {
    getPlayersByStatus(status) {
      if (!this.lineup) {
        return []
      }
      const sortFilter = list => {
        return list
          .filter(item => Number(item.status) === status)
          .sort((a, b) => Number(a.pos) - Number(b.pos))
      }

      const {
        home_players: homePlayers = [],
        guest_players: guestPlayers = [],
      } = this.lineup
      const homeUsers = sortFilter(homePlayers)
      const guestUsers = sortFilter(guestPlayers)
      const diffLen = homeUsers.length - guestUsers.length
      if (diffLen > 0) {
        guestUsers.push(...new Array(Math.abs(diffLen)))
      }

      if (diffLen < 0) {
        homeUsers.push(...new Array(Math.abs(diffLen)))
      }

      return {
        home: homeUsers,
        guest: guestUsers,
      }
    },
    fetchMatchLineup() {
      this.loading = true

      this.$axios
        .get(api.get.football.fetchMatchLineup, {
          params: {
            match_id: this.matchId,
          },
        })
        .then(({ code, data, msg }) => {
          if (code !== 0) {
            throw new Error(msg)
          }
          this.lineup = data
        })
        .catch(error => {
          console.warn(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.match-squad {
  padding: 11px 20px 1px;
  margin-bottom: 12px;
  background-color: $color-white;
  color: #666666;

  .title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 12px;
  }
  .table-list {
    display: flex;
    justify-content: space-between;
    border-left: 1px solid #efefef;
    border-right: 1px solid #efefef;
    border-bottom: 1px solid #efefef;
    margin-bottom: 12px;

    .home-team,
    .guest-team {
      flex: 1;
    }
    .team-title {
      background-color: #f5f5f5;
      line-height: 24px;
      font-weight: bold;
      padding: 0 16px;
      color: #666666;
    }
    .team-user {
      display: flex;
      align-items: center;
      padding: 4px 16px;
      height: 30px;
      line-height: 30px;
      border-bottom: 1px solid #efefef;
      &:last-of-type {
        border-bottom: none;
      }
    }
    .user-number {
      width: 4em;
    }
    .user-position {
      width: 4em;
    }
    .user-name {
      flex: 1;
    }
  }
  .no-data {
    text-align: center;
    background-color: #f5f5f5;
    line-height: 32px;
    margin-bottom: 12px;
  }
}
</style>
