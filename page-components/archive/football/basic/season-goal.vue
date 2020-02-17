<template>
  <div class="season-goal-wrap">
    <div v-loading="loading" class="bar-map">
      <VEcharts ref="barMap" :options="opts" />
    </div>

    <div class="bottom-remind-wrap">
      <VIcon name="light" class="remind-icon" />
      本赛季共比赛为 <span>{{ goal.total }}</span> 场，其中场均进球为
      <span>{{ goal.totalAvg }}</span> 个，主场占其中
      <span>{{ goal.homeAvg }}</span> 个，客队为
      <span>{{ goal.guestAvg }}</span> 个，倾向于
      <span>{{ goal.totalAvg | raceType }}</span>
      型联赛
    </div>
  </div>
</template>

<script>
import { CancelToken } from 'axios'

import api from '@/api'

import VIcon from '@/components/icon'
import VEcharts from '@/components/echarts/'
import { optionsBarSeason } from './options'

export default {
  components: { VIcon, VEcharts },
  filters: {
    raceType(value) {
      if (value >= 3) {
        return '大球'
      } else if (value >= 2.75 && value < 3) {
        return '偏大球'
      } else if (value >= 2.25 && value < 2.75) {
        return '中庸'
      } else if (value >= 2 && value < 2.25) {
        return '偏小球'
      } else {
        return '小球'
      }
    },
  },
  props: {
    yearId: {
      type: [Number, String],
    },
    eventId: {
      type: [Number, String],
    },
  },
  data() {
    return {
      goal: {},
      opts: optionsBarSeason(),
      loading: false,
      sourceToken: null,
    }
  },
  watch: {
    yearId: {
      immediate: true,
      handler(value) {
        if (value) {
          this.fetchAvgGoal(this.eventId, value)
        }
      },
    },
  },
  methods: {
    // 网络请求
    fetchAvgGoal(eventId, seasonId) {
      if (!seasonId) {
        return
      }
      this.sourceToken && this.sourceToken.cancel()

      this.sourceToken = CancelToken.source()
      this.loading = true
      this.$axios
        .get(api.get.football.fetchAvgGoalOfSeason, {
          params: { season_id: seasonId, event_id: eventId },
          cancelToken: this.sourceToken.token,
        })
        .then(({ data, code }) => {
          if (code !== 0 || !data) {
            throw new Error('赛季场均进球暂无数据')
          }

          const { total, totalAvg, homeAvg, guestAvg } = data
          this.goal = { total, totalAvg, homeAvg, guestAvg }

          this.setMapData(this.opts.series[0].data, this.goal)
          this.setMapData(this.opts.series[1].data, this.goal)
          this.$refs.barMap.chart.setOption(this.opts, true)
        })
        .catch(() => {
          this.setMapData(this.opts.series[0].data, {
            total: 0,
            totalAvg: 0,
            homeAvg: 0,
            guestAvg: 0,
          })

          this.setMapData(this.opts.series[1].data, {
            total: 0,
            totalAvg: 0,
            homeAvg: 0,
            guestAvg: 0,
          })

          this.$refs.barMap.chart.setOption(this.opts, true)

          this.goal = {
            total: 0,
            totalAvg: 0,
            homeAvg: 0,
            guestAvg: 0,
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 设置图表数据
    setMapData(target = [], value) {
      const { totalAvg, homeAvg, guestAvg } = value

      const max = Math.ceil(Math.max(totalAvg, homeAvg, guestAvg))

      target.forEach(item => {
        if (item.name === '客队') {
          item.value = guestAvg
        } else if (item.name === '主队') {
          item.value = homeAvg
        } else if (item.name === '场均') {
          item.value = totalAvg
        } else {
          item.value = max
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.season-goal-wrap {
  .bar-map {
    width: 100%;
    /*padding-top: 54px;*/
  }

  .bottom-remind-wrap {
    margin-top: 20px;
    margin-left: 18px;
    font-size: $font-size-small;
    font-family: $font-family-no-number;
    color: $font-title-color;

    span {
      color: #e1243b;
    }

    .remind-icon {
      color: #ffbe52;
      font-size: 16px;
      margin-right: 5px;
    }
  }
}
</style>
