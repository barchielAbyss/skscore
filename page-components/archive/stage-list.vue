<template>
  <div
    v-body-infinite-scroll="{
      load: handleChangeScroll,
      disabled: disabledFetchOdds,
      distance: 2000,
    }"
    class="stage-list"
  >
    <div
      v-for="(day, dayId) of matchesList"
      :key="dayId"
      class="competition-day-box"
    >
      <h2 class="day-title">{{ day.name }}</h2>

      <CompetitionTable
        :list="day.list"
        :teams="teams"
        :odds="odds"
        :company-opt="companyOpt"
        :sport-type="sportType"
      />
    </div>
    <!-- <template v-if="!isEmpty">

    </template>

    <template v-else>
      <div class="is-empty">
        暂无数据
      </div>
    </template> -->
  </div>
</template>

<script>
import api from '@/api'

import groupByTime from '@/utils/groupByTime'
import CompetitionTable from './competition-table'

const LIMIT_MATCH_LEN = 30

const COMPANY_LIST = {
  football: ['皇冠', 'Bet365', '澳门'],
  basketball: [
    '金宝博',
    '澳门',
    '威廉希尔',
    '易胜博',
    '12BET',
    '皇冠',
    '立博',
    '10BET',
  ],
}

export default {
  components: {
    CompetitionTable,
  },
  props: {
    stagesId: [Number, String],
    stageData: Object,
    teams: Object,
    sportType: String,
  },
  data() {
    return {
      odds: {},
      loading: false,
      curPage: 1,
      matchesList: {},
    }
  },
  computed: {
    isEmpty() {
      return !Object.keys(this.matchesList).length
    },
    companyOpt() {
      return COMPANY_LIST[this.sportType].map(item => ({
        value: item,
      }))
    },
    filterList() {
      const { matchs = [] } = this.stageData || {}
      return matchs.filter((_, index) => index < this.limitLen)
    },
    matchIds() {
      const { matchs = [] } = this.stageData || {}
      return matchs.map(item => item.id)
    },
    disabledFetchOdds() {
      const { matchs = [] } = this.stageData || {}
      return matchs.length <= this.limitLen
    },
    limitLen() {
      return this.curPage * LIMIT_MATCH_LEN
    },
  },
  watch: {
    stagesId: {
      immediate: true,
      handler() {
        this.curPage = 1
        this.odds = {}
        this.handleChangeScroll(true)
      },
    },
  },
  methods: {
    handleChangeScroll(init) {
      const oldLimit = init ? 0 : this.curPage * LIMIT_MATCH_LEN
      this.curPage = init ? 1 : (this.curPage += 1)
      const newLimit = init ? LIMIT_MATCH_LEN : this.curPage * LIMIT_MATCH_LEN
      const ids = this.matchIds.filter((_, index) => {
        return index < newLimit && index >= oldLimit
      })

      this.matchesList = groupByTime({
        list: this.filterList,
        key: 'time',
        serverTime: this.$store.state.user.serverTime,
      })
      this.fetchOddsList(ids)
    },
    fetchOddsList(ids) {
      const oddIds = Object.keys(this.odds)
      if (ids.every(id => oddIds.includes(id))) {
        return
      }

      this.loading = true
      this.$axios
        .post(api.post.common.fetchMatchesOdds, {
          category: this.sportType === 'football' ? 1 : 2,
          ids: ids.join(),
          markets: ['ah', 'hda'].join(),
          companies: COMPANY_LIST[this.sportType].join(),
        })
        .then(({ code, data, msg }) => {
          if (code !== 0 || !data) {
            throw new Error(msg || '未获取到赔率')
          }
          this.odds = {
            ...this.odds,
            ...data,
          }
        })
        .catch(() => {
          this.odds = {}
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.stage-list {
  min-height: 80px;
  .day-title {
    font-size: 14px;
    font-weight: bold;
    line-height: 36px;
  }
  .is-empty {
    line-height: 8em;
    text-align: center;
  }
}
</style>
