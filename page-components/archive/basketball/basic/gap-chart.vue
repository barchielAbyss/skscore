<template>
  <div class="gap-chart">
    <VEcharts
      v-show="!isEmpty"
      ref="linChart"
      :options="lineChartOptions"
      :height="400"
    />
    <div v-if="isEmpty" class="is-empty">暂无数据</div>
  </div>
</template>

<script>
import VEcharts from '@/components/echarts'
import { LEN_CHART_OPTIONS } from './chart-options'

export default {
  components: {
    VEcharts,
  },
  props: {
    eventId: Number,
    yearId: Number,
  },
  data() {
    return {
      isEmpty: false,
      lineChartOptions: {},
    }
  },
  watch: {
    yearId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.fetchChartData()
        }
      },
    },
  },
  methods: {
    fetchChartData(options = {}) {
      this.isEmpty = false
      this.$parent.fetchLinChartData(options).then(({ diff }) => {
        if (!diff.length) {
          this.isEmpty = true
          return
        }
        const lineChartOptions = LEN_CHART_OPTIONS()
        lineChartOptions.xAxis.data = diff.map(item => item.diff)
        lineChartOptions.series[0].data = diff.map(item => item.count)

        this.lineChartOptions = lineChartOptions
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.is-empty {
  line-height: 200px;
  text-align: center;
}
</style>
