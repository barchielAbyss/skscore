<template>
  <div class="echarts-box">
    <div v-if="echartOptions.noData" class="no-data">
      <span>{{ $t('common.noData') }}</span>
    </div>

    <div ref="echarts" class="echarts" :style="{ height: `${height}px` }" />

    <slot />
  </div>
</template>

<script>
import echarts from 'echarts'
import macaronsTheme from '@/assets/macarons.json'

echarts.registerTheme('macarons', macaronsTheme)

const INIT_OPTIONS = { renderer: 'svg' }

export default {
  props: {
    noData: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      required: true,
    },
    height: {
      type: Number,
      default: 300,
    },
  },
  data() {
    return {
      chart: null,
    }
  },
  computed: {
    echartOptions() {
      return this.options || INIT_OPTIONS
    },
  },
  watch: {
    options() {
      if (this.chart) {
        this.chart.setOption(this.echartOptions, true)
      }
    },
  },
  mounted() {
    this.chart = echarts.init(this.$refs.echarts)
    this.$nextTick(() => {
      this.chart.setOption(this.echartOptions)
      Object.keys(this.$listeners).forEach(key => {
        this.chart.on(key, this.$listeners[key])
      })
    })
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
  },
}
</script>

<style lang="scss" scoped>
.echarts {
  width: 100%;
}
</style>
