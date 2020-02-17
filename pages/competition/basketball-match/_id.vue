<template>
  <div class="basketball-match-wrap">
    <template v-if="matchInfo">
      <Head :match-id="matchId" :match-info="matchInfo" />
      <RouterView :match-id="matchId" :match-info="matchInfo" />
    </template>
  </div>
</template>

<script>
import api from '@/api'

import BasketballMatch from '@/utils/basketball-message'
import Head from '@/page-components/competition/basketball-match/head-score'

export default {
  components: {
    Head,
  },
  async asyncData({ $axios, params }) {
    const matchData = await Promise.resolve(
      $axios
        .post(api.post.basketball.fetchMatchInfoOfBasketball, {
          ids: params.id,
        })
        .then(({ data }) => {
          return data
        })
    )

    return { matchData }
  },
  data() {
    return {
      socket: null,
    }
  },
  computed: {
    matchId() {
      return this.$route.params.id
    },
    matchInfo() {
      return this.matchData ? this.formatData(this.matchData) : null
    },
  },
  mounted() {
    this.socket = new BasketballMatch()
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.destroy()
      this.socket = null
    }
  },
  methods: {
    // 处理返回数据格式
    formatData(data) {
      const match = data.matchs[0]
      const {
        event_id: eventId,
        home_team_id: homeId,
        guest_team_id: guestId,
      } = match
      const homeInfo = data.teams[homeId]
      const guestInfo = data.teams[guestId]
      const eventInfo = data.events[eventId]

      return {
        ...match,
        homeInfo,
        guestInfo,
        eventInfo,
      }
    },
  },
}
</script>

<style lang="scss">
.competition-basketball-match-id-video {
  &.main-content {
    width: 1315px;
  }
  .basketball-match-wrap {
    margin-left: 315px;
  }
}
</style>
