<template>
  <div v-loading="loading" class="basketball-detail-basic">
    <ul class="tabs">
      <li
        v-for="item of tabs"
        :key="item.id"
        :class="[
          'tab-item',
          {
            actvie: curTabId === item.id,
          },
        ]"
        @click="handleChangeTabId(item.id)"
        v-text="item.name"
      />
    </ul>

    <component :is="curTabId" :year-id="yearId" :event-id="eventId" />
  </div>
</template>

<script>
import { CancelToken } from 'axios'
import api from '@/api'

import ScoreChart from '@/page-components/archive/basketball/basic/score-chart'
import GapChart from '@/page-components/archive/basketball/basic/gap-chart'
import ResultChart from '@/page-components/archive/basketball/basic/result-chart'

const TABS = [
  { name: '比分分布', id: 'ScoreChart' },
  { name: '分差', id: 'GapChart' },
  { name: '胜负分布', id: 'ResultChart' },
]

export default {
  components: {
    ScoreChart,
    GapChart,
    ResultChart,
  },
  props: {
    eventId: Number,
    yearId: Number,
  },
  data() {
    return {
      curTabId: 'ScoreChart',
      loading: false,
      lineChartData: null,
      pieChartData: null,
      sourceToken: null,
    }
  },
  computed: {
    tabs: () => TABS,
  },
  beforeRouteUpdate(to, from, next) {
    this.lineChartData = null
    this.pieChartData = null

    next()
  },
  methods: {
    fetchPieChartData(opt = {}) {
      this.loading = true
      if (this.pieChartData) {
        this.loading = false
        return Promise.resolve(this.pieChartData)
      }

      this.sourceToken && this.sourceToken.cancel()
      this.sourceToken = CancelToken.source()

      return this.$axios
        .get(api.get.basketball.fetchSeasonWinLose, {
          params: {
            event_id: this.eventId,
            season_id: this.yearId,
          },
          cancelToken: this.sourceToken.token,
        })
        .then(({ code, data, msg }) => {
          if (code !== 0 || !data) {
            throw new Error(msg)
          }

          const res = {
            curr: data.curr ? [data.curr] : [],
            lastThree: data.lastThree || [],
          }

          this.pieChartData = res
          return res
        })
        .catch(() => {
          this.pieChartData = null
          return {
            curr: [],
            lastThree: [],
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    fetchLinChartData(opt = {}) {
      if (this.lineChartData) {
        return Promise.resolve(this.lineChartData)
      }

      this.sourceToken && this.sourceToken.cancel()
      this.sourceToken = CancelToken.source()

      this.loading = true

      return this.$axios
        .get(api.get.basketball.fetchSeasonScoreTime, {
          params: {
            event_id: this.eventId,
            season_id: this.yearId,
          },
          cancelToken: this.sourceToken.token,
        })
        .then(({ code, data, msg }) => {
          if (code !== 0 || !data) {
            throw new Error(msg)
          }

          this.lineChartData = data
          return data
        })
        .catch(() => {
          this.lineChartData = null
          return {
            scores: [],
            diff: [],
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleChangeTabId(id = 'ScoreChart') {
      this.curTabId = id
    },
  },
}
</script>

<style lang="scss" scoped>
.basketball-detail-basic {
  .tabs {
    display: flex;
    margin-bottom: 30px;
    .tab-item {
      cursor: pointer;
      padding: 7px 16px;
      font-size: 14px;
      background-color: #f3f4fb;
      border-radius: 2px;
      margin-right: 10px;
      @include transition-all;
      &.actvie {
        background-color: #e7f1fe;
        color: $color-active;
        font-weight: bold;
      }
    }
  }
}
</style>
