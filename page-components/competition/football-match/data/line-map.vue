<template>
  <div id="data-line-map" class="data-line-map">
    <VEcharts
      v-if="flag"
      ref="lineMap"
      class="line"
      :options="lineOptions"
      :height="493"
      @mouseover="handleOver"
      @mouseout="handleOut"
    >
      <template #default>
        <div class="btn-group">
          <button
            :class="['btn', { 'active-style-home': flag_home }]"
            @click="handleSelect('home')"
          >
            主队
          </button>
          <button
            :class="['btn', { 'active-style-guest': flag_guest }]"
            @click="handleSelect('guest')"
          >
            客队
          </button>
        </div>
      </template>
    </VEcharts>
  </div>
</template>

<script>
import api from '@/api'
import VEcharts from '@/components/echarts/'
import { LineChartOptions } from './echart-options'

export default {
  components: { VEcharts },
  props: {
    matchInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      flag_home: true,
      flag_guest: true,
      lineOptions: LineChartOptions(),
      flag: false,
      mock1: [
        { rank: 3 },
        { rank: 4 },
        { rank: 7 },
        { rank: 4 },
        { rank: 5 },
        { rank: 8 },
        { rank: 2 },
        { rank: 3 },
        { rank: 4 },
        { rank: 9 },
        { rank: 7 },
        { rank: 2 },
        { rank: 4 },
      ],
      mock2: [
        { rank: 8 },
        { rank: 2 },
        { rank: 3 },
        { rank: 4 },
        { rank: 9 },
        { rank: 7 },
        { rank: 2 },
        { rank: 4 },
      ],
    }
  },
  mounted() {
    this.setLineData()

    Promise.all([
      this.fetchTeamTendData(this.matchInfo.home.id, this.matchInfo.event_id),
      this.fetchTeamTendData(this.matchInfo.guest.id, this.matchInfo.event_id),
    ])
      .then(([res1, res2]) => {
        this.mock1 = res1.data
        this.mock2 = res2.data

        this.lineOptions.series[0].data = this.handleData(
          this.mock1,
          'home',
          this.mock2
        )
        this.lineOptions.series[1].data = this.handleData(
          this.mock2,
          'guest',
          this.mock1
        )

        this.flag = true
      })
      .catch(() => {
        this.flag = false
        console.warn('排行走势图数据获取失败', 'error')
      })
  },
  methods: {
    // 处理返回数据
    handleData(arr, type, compare) {
      const temp = []
      arr.forEach((item, index) => {
        const module = {
          value: item.rank,
          emphasis: { itemStyle: { color: '' } },
        }

        // 当主客队排名相同时，采用复合样式
        if (compare[index] && compare[index].rank === item.rank) {
          module.emphasis.itemStyle.color = '#F95D22'
          module.emphasis.itemStyle.borderColor = '#007AFF'
          module.emphasis.itemStyle.borderWidth = 1.5
        } else if (type === 'home') {
          module.emphasis.itemStyle.color = '#007AFF'
        } else if (type === 'guest') {
          module.emphasis.itemStyle.color = '#F95D22'
        }

        // 折线图坐标点集合
        temp[index] = module
      })

      return temp
    },

    // 设置浮层提示框样式
    setStyleOfTooltip() {
      this.lineOptions.series[0].tooltip.backgroundColor = '#F95D22'
      this.lineOptions.series[1].tooltip.backgroundColor = '#F95D22'

      this.lineOptions.series[0].tooltip.borderColor = '#007AFF'
      this.lineOptions.series[1].tooltip.borderColor = '#007AFF'

      this.lineOptions.series[0].tooltip.borderWidth = 1
      this.lineOptions.series[1].tooltip.borderWidth = 1
    },

    // 触发坐标点的 hover 效果
    handleOver(params) {
      // 鼠标移到客队坐标点上
      if (params.seriesName === '客队') {
        // 该点为主客队的交点
        if (
          this.mock1[params.dataIndex] &&
          params.value === this.mock1[params.dataIndex].rank
        ) {
          // 设置浮层提示框样式
          this.setStyleOfTooltip()

          // 设置坐标点的大小
          this.lineOptions.series[0].data[params.dataIndex].symbolSize = 12
          this.lineOptions.series[1].data[params.dataIndex].symbolSize = 12
        } else {
          // 该点不为主客队交点
          this.lineOptions.series[1].tooltip.backgroundColor = '#F95D22'
          this.lineOptions.series[1].tooltip.borderWidth = 0
          this.lineOptions.series[1].data[params.dataIndex].symbolSize = 12
        }
      } else if (params.seriesName === '主队') {
        if (
          this.mock2[params.dataIndex] &&
          params.value === this.mock2[params.dataIndex].rank
        ) {
          this.setStyleOfTooltip()
          this.lineOptions.series[0].data[params.dataIndex].symbolSize = 12
          this.lineOptions.series[1].data[params.dataIndex].symbolSize = 12
        } else {
          this.lineOptions.series[0].tooltip.backgroundColor = '#007AFF'
          this.lineOptions.series[0].tooltip.borderWidth = 0
          this.lineOptions.series[0].data[params.dataIndex].symbolSize = 12
        }
      }

      this.$refs.lineMap.chart.setOption(this.lineOptions)
    },

    // 鼠标移出坐标点，取消 hover 效果
    handleOut(params) {
      // 移出客队坐标点
      if (params.seriesName === '客队') {
        // 移出的点是两折线的交点
        if (
          this.mock1[params.dataIndex] &&
          params.value === this.mock1[params.dataIndex].rank
        ) {
          this.lineOptions.series[0].data[params.dataIndex].symbolSize = 8
          this.lineOptions.series[1].data[params.dataIndex].symbolSize = 8
        } else {
          this.lineOptions.series[1].data[params.dataIndex].symbolSize = 8
        }
        // 移出的主队坐标点
      } else if (params.seriesName === '主队') {
        // 移出的点是两折线的交点
        if (
          this.mock2[params.dataIndex] &&
          params.value === this.mock2[params.dataIndex].rank
        ) {
          this.lineOptions.series[0].data[params.dataIndex].symbolSize = 8
          this.lineOptions.series[1].data[params.dataIndex].symbolSize = 8
        } else {
          this.lineOptions.series[0].data[params.dataIndex].symbolSize = 8
        }
      }

      this.$refs.lineMap.chart.setOption(this.lineOptions)
    },

    // 获取球队排行数据
    fetchTeamTendData(teamId, eventId) {
      return this.$axios.get(api.get.football.fetchTeamLineTend, {
        params: {
          team_id: teamId,
          event_id: eventId,
        },
      })
    },

    // 设置折线图的直角坐标系
    setLineData() {
      this.lineOptions.xAxis.data = new Array(39).fill('').map((_, i) => i)
      this.lineOptions.xAxis.data.shift()
      this.lineOptions.yAxis.data = new Array(21).fill('').map((_, i) => i)
    },

    // 自定义按钮，触发 action 切换 echarts 的图例状态
    handleSelect(tar) {
      const myChart = this.$refs.lineMap.chart

      if (tar === 'home') {
        this.flag_home = !this.flag_home
        myChart.dispatchAction({
          type: 'legendToggleSelect',
          name: '主队',
        })
      } else {
        this.flag_guest = !this.flag_guest
        myChart.dispatchAction({
          type: 'legendToggleSelect',
          name: '客队',
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.data-line-map {
  width: 1000px;
  background-color: #fff;
  margin-bottom: 12px;
  position: relative;
  border-radius: 8px;

  div.btn-group {
    position: absolute;
    top: 13px;
    right: 28px;
    z-index: 5;
    .btn {
      outline: none;
      border: none;
      margin-left: 10px;
      cursor: pointer;
      width: 88px;
      height: 34px;
      color: #333;
      border-radius: 2px;
      background-color: #f3f4fb;
    }

    button.active-style-home {
      color: #007aff;
      background: rgba(225, 239, 255, 1);
    }

    button.active-style-guest {
      background: rgba(254, 235, 229, 1);
      color: #f95d22;
    }
  }
}
</style>
