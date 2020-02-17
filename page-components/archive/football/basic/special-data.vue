<template>
  <div class="special-data-wrap">
    <div v-loading="loading" class="bar-map">
      <VEcharts ref="barMap" :options="opts" />
    </div>

    <div class="bottom-remind-wrap">
      <VIcon name="light" class="remind-icon" />
      本赛季共比赛为 <span>{{ msgRemind.total }}</span> 场，其中爆冷
      <span>{{ msgRemind.upset }}</span> 次，逆转
      <span>{{ msgRemind.reverse }}</span> 次，绝杀
      <span>{{ msgRemind.last_gasp_goal }}</span>
      次
    </div>
  </div>
</template>

<script>
import { CancelToken } from 'axios'

import api from '@/api'

import VIcon from '@/components/icon'
import VEcharts from '@/components/echarts/'
import { optionsBarSpecial } from './options'

export default {
  components: { VIcon, VEcharts },
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
      loading: false,
      msgRemind: {},
      opts: optionsBarSpecial(),
      sourceToken: null,
    }
  },
  watch: {
    yearId: {
      immediate: true,
      handler(value) {
        if (value) {
          this.fetchSpecialData(this.eventId, value)
        }
      },
    },
  },
  methods: {
    setMapData(target = [], value) {
      const { upset, reverse, last_gasp_goal: lastGaspGoal } = value

      const max = Math.ceil(Math.max(lastGaspGoal, reverse, upset))

      target.forEach(item => {
        if (item.name === '爆冷') {
          item.value = upset
        } else if (item.name === '逆转') {
          item.value = reverse
        } else if (item.name === '绝杀') {
          item.value = lastGaspGoal
        } else {
          item.value = max
        }
      })
    },
    fetchSpecialData(eventId, seasonId) {
      if (!seasonId) {
        return
      }
      this.sourceToken && this.sourceToken.cancel()

      this.sourceToken = CancelToken.source()
      this.loading = true

      this.$axios
        .get(api.get.football.fetchSpecialDataOfSeason, {
          params: {
            season_id: seasonId,
            event_id: eventId,
          },
          cancelToken: this.sourceToken.token,
        })
        .then(({ data, code }) => {
          if (code !== 0 || !data) {
            throw new Error('特殊数据当前为空')
          }

          const { total, upset, reverse, last_gasp_goal: lastGaspGoal } = data
          this.msgRemind = { total, upset, reverse, lastGaspGoal }

          this.setMapData(this.opts.series[0].data, this.msgRemind)
          this.setMapData(this.opts.series[1].data, this.msgRemind)
          this.$refs.barMap.chart.setOption(this.opts, true)
        })
        .catch(() => {
          this.setMapData(this.opts.series[0].data, {
            total: 0,
            upset: 0,
            reverse: 0,
            last_gasp_goal: 0,
          })

          this.setMapData(this.opts.series[1].data, {
            total: 0,
            upset: 0,
            reverse: 0,
            last_gasp_goal: 0,
          })

          this.$refs.barMap.chart.setOption(this.opts, true)

          this.msgRemind = {
            total: 0,
            upset: 0,
            reverse: 0,
            last_gasp_goal: 0,
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.special-data-wrap {
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
