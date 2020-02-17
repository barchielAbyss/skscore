<template>
  <div class="result-chart">
    <VSelect
      v-model="curTypeId"
      :options="typeList"
      :width="156"
      class="select-wrap"
      size="small"
      @change="handleChangeCurTypeId"
    />
    <div v-show="!isEmpty" class="result-chart-box">
      <VEcharts :options="pieChartOptions" class="chart-main" />

      <div class="chart-box-into">
        <h2>
          {{ curType.name }}共进行了<span>{{ dataInfo.total || '0' }}</span
          >场比赛
        </h2>
        <p>
          主胜场为<span>{{ dataInfo.win }}</span
          >场, 占比：<span>{{ fetchPercent('win') }}</span>
        </p>
        <p>
          客胜场为<span>{{ dataInfo.lose }}</span
          >场, 占比：<span>{{ fetchPercent('lose') }}</span>
        </p>
      </div>
    </div>
    <p v-if="isEmpty" class="is-empty chart-main">暂无数据</p>
  </div>
</template>

<script>
import VSelect from '@/components/popover-select'
import VEcharts from '@/components/echarts'
import { PIE_CHART_OPTIONS } from './chart-options'

const SELECT_TYPE_LIST = [
  { label: '当前赛季', value: 'curr', name: '当前赛季' },
  { label: '最近三个赛季平均数据', value: 'lastThree', name: '近三个赛季' },
]

export default {
  components: {
    VSelect,
    VEcharts,
  },
  props: {
    eventId: Number,
    yearId: Number,
  },
  data() {
    return {
      isEmpty: false,
      curTypeId: 'curr',
      pieChartOptions: {},
      dataInfo: {},
    }
  },
  computed: {
    typeList: () => SELECT_TYPE_LIST,
    curType() {
      return SELECT_TYPE_LIST.find(item => item.value === this.curTypeId)
    },
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
    fetchPercent(key) {
      const value = this.dataInfo[key] || 0
      const total = this.dataInfo.total
      if (!value || !total) {
        return '0%'
      }
      return `${Math.ceil((value / total) * 100)}%`
    },
    handleChangeCurTypeId() {
      this.$nextTick(() => {
        this.fetchChartData()
      })
    },
    fetchChartData(options) {
      this.$parent.fetchPieChartData(options).then(data => {
        this.dataInfo = this.fetchItemPieData(data[this.curTypeId])
        const pieChartOptions = PIE_CHART_OPTIONS()

        pieChartOptions.series.forEach(item => {
          item.data.forEach(itemData => {
            switch (itemData.name) {
              case '负':
                itemData.value = this.dataInfo.lose || 0
                break
              case '胜':
                itemData.value = this.dataInfo.win || 0
                break
              default:
                break
            }
          })
        })

        this.pieChartOptions = pieChartOptions
      })
    },
    fetchTotal(list = []) {
      return list.reduce((prev, item) => {
        return prev + Number(item)
      }, 0)
    },
    fetchItemPieData(data) {
      this.isEmpty = false

      if (!data || !data.length) {
        this.isEmpty = true
        return {}
      }
      return {
        lose: this.fetchTotal(data.map(item => item.lose)),
        win: this.fetchTotal(data.map(item => item.win)),
        total: this.fetchTotal(data.map(item => item.total)),
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.is-empty {
  line-height: 300px;
  text-align: center;
}
.result-chart {
  padding-bottom: 36px;
  .select-wrap {
    /deep/ .title {
      width: 156px;
    }
  }
  .result-chart-box {
    display: flex;
    .chart-main {
      width: 520px;
    }
    .chart-box-into {
      padding-top: 102px;
      h2,
      p {
        > span {
          color: #cf3a42;
        }
      }
      > h2 {
        font-size: 16px;
        margin-bottom: 13px;
      }
      > p {
        font-size: 12px;
        margin-bottom: 14px;
      }
    }
  }
}
</style>
