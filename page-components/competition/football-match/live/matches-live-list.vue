<template>
  <div v-loading="loading" class="matches-video-list">
    <h3 v-if="liveList.length" class="title">
      当前 <b style="color: #e1243b" v-text="`${liveList.length}场`" /> 正在进行
    </h3>

    <h3 v-if="!liveList.length" class="title">
      当前无赛事
    </h3>

    <ul class="video-list">
      <Item
        v-for="item of liveList"
        :key="item.id"
        :data-info="item"
        class="video-list-item"
      />
    </ul>
  </div>
</template>

<script>
import api from '@/api'
import emitter from '@/utils/emitter'
import Item from './matches-live-item'

export default {
  components: {
    Item,
  },
  data() {
    return {
      liveList: [],
      loading: false,
    }
  },
  mounted() {
    this.fetchMatchLiveList()
    this.onMessage()
  },
  beforeDestroy() {
    this.offMessage()
  },
  methods: {
    onMessage() {
      emitter.$on('socket-football-status', this.changeSocketStatus)
      emitter.$on('socket-football-gold', this.changeSocketGold)
    },
    offMessage() {
      emitter.$off('socket-football-status', this.changeSocketStatus)
      emitter.$off('socket-football-gold', this.changeSocketGold)
    },
    changeSocketStatus(value) {
      const match = this.liveList.find(
        item => Number(item.id) === Number(value.mid)
      )
      if (!match) {
        return
      }
      const { t_start_time: tStartTime, status } = value.ext

      match.t_start_time = tStartTime
      match.status = status
    },
    changeSocketGold(value) {
      const match = this.liveList.find(
        item => Number(item.id) === Number(value.mid)
      )
      if (!match) {
        return
      }
      const [homeSocre, grestScore] = value.ext.score.split('-')
      match.home_goal_all = homeSocre
      match.guest_goal_all = grestScore
    },
    fetchMatchLiveList() {
      this.loading = true

      this.$axios
        .get(api.get.common.fetchMatchLiveList, {
          params: {
            category: 1,
            type: 1, // 动画直播
          },
        })
        .then(({ code, data, msg }) => {
          if (code !== 0) {
            throw new Error(msg)
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
  },
}
</script>

<style lang="scss" scoped>
.matches-video-list {
  border-radius: 8px;
  .title {
    line-height: 42px;
    font-size: 14px;
    font-weight: bold;
    padding: 0 14px;
  }
}
</style>
