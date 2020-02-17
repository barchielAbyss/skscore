<template>
  <div class="competition-score-list">
    <ScoreHeader :menu-list="menuList" />
    <div class="competition-score-main">
      <slot />
    </div>
  </div>
</template>

<script>
import ScoreHeader from './header-menu'

const FOOTBALL_MENU = [
  {
    route: {
      name: 'competition-football',
      query: { timeType: 'now' },
    },
    name: '即时赛事',
  },
  {
    route: {
      name: 'competition-football',
      query: { timeType: 'past' },
    },
    name: '完场赛事',
  },
  {
    route: {
      name: 'competition-football',
      query: { timeType: 'future' },
    },
    name: '未来赛事',
  },
]

const BASKETBALL_MENU = [
  {
    route: {
      name: 'competition-basketball',
      query: { timeType: 'now' },
    },
    name: '即时赛事',
  },
  {
    route: {
      name: 'competition-basketball',
      query: { timeType: 'past' },
    },
    name: '完场赛事',
  },
  {
    route: {
      name: 'competition-basketball',
      query: { timeType: 'future' },
    },
    name: '未来赛事',
  },
]

export default {
  components: {
    ScoreHeader,
  },
  props: {
    sportType: {
      type: String,
      default: 'football',
    },
  },
  computed: {
    menuList() {
      return this.sportType === 'football' ? FOOTBALL_MENU : BASKETBALL_MENU
    },
  },
  beforeRouteEnter(to, from, next) {
    if (!to.query.timeType) {
      to.query.timeType = 'now'
    }
    next()
  },
  beforeRouteUpdate(to, from, next) {
    if (!to.query.timeType) {
      to.query.timeType = 'now'
    }
    next()
  },
}
</script>

<style lang="scss" scoped>
.competition-score-list {
  padding-top: 47px;
}
</style>
