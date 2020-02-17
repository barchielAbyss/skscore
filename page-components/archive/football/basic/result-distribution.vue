<template>
  <div class="result-distribution-wrap">
    <Select
      v-model="value"
      class="select-wrap"
      :options="DateOptions"
      size="small"
      :width="146"
      @change="handleChange"
    />

    <div v-show="pieMsg.show" v-loading="loading" class="map-section">
      <div class="pie-map">
        <VEcharts ref="pieMap" :options="optionsPie" />
      </div>

      <div class="pie-msg">
        <p v-show="value === 1" class="title">
          当前赛季共进行了
          <span class="sp-red">{{ pieMsg.total }}</span> 场比赛
        </p>
        <p v-show="value === 2" class="title">
          近三个赛季共进行了
          <span class="sp-red">{{ pieMsg.total }}</span> 场比赛
        </p>

        <div class="ctx">
          主胜场为
          <span class="sp-red" v-text="pieMsg.winHome.count" />
          场，占比：<span class="sp-red" v-text="pieMsg.winHome.per" />
        </div>
        <div class="ctx">
          平局场为
          <span class="sp-red" v-text="pieMsg.tie.count" /> 场，占比：<span
            class="sp-red"
            v-text="pieMsg.tie.per"
          />
        </div>
        <div class="ctx">
          客胜场为
          <span class="sp-red" v-text="pieMsg.winGuest.count" />
          场，占比：<span class="sp-red" v-text="pieMsg.winGuest.per" />
        </div>
      </div>
    </div>
    <div v-show="!pieMsg.show" class="no-data">暂无数据</div>
  </div>
</template>

<script>
import { CancelToken } from 'axios'

import api from '@/api'

import VEcharts from '@/components/echarts'
import Select from '@/components/popover-select'
import { optionsPie } from './options'

export default {
  components: { Select, VEcharts },
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
      mark_value: 1,
      value: 1,
      optionsPie: optionsPie(),
      sourceToken: null,
      loading: false,

      DateOptions: [
        { value: 1, label: '当前赛季' },
        { value: 2, label: '最近3个赛季平均数据' },
      ],

      pieMsg: {
        show: true,
        sum: 0,
        total: 0,
        winHome: { count: 0, per: '0%' },
        winGuest: { count: 0, per: '0%' },
        tie: { count: 0, per: '0%' },
      },

      currentMsg: {
        show: true,
        total: 0,
        sum: 0,
        winHome: { count: 0, per: '' },
        winGuest: { count: 0, per: '' },
        tie: { count: 0, per: '' },
      },

      lastThreeMsg: {
        show: true,
        total: 0,
        sum: 0,
        winHome: { count: 0, per: '' },
        winGuest: { count: 0, per: '' },
        tie: { count: 0, per: '' },
      },
    }
  },
  watch: {
    yearId: {
      immediate: true,
      handler(value) {
        if (value) {
          this.fetchResult(this.eventId, value)
        }
      },
    },
  },
  methods: {
    // 设置 markValue 记录上次所选值，若 value = markValue，不进行操作
    handleChange(value) {
      if (this.markValue !== value) {
        this.markValue = value
        this.justifySeason(value)
      }
    },

    // 格式化百分数
    formatPercent(value, total) {
      const temp = (value / total) * 100
      return temp.toFixed(2) + '%'
    },

    // 合并近三个赛季的数据
    seasonDataAdd(tar = []) {
      let total = 0
      let win = 0
      let draw = 0
      let lose = 0
      let sum = 0
      tar.map(item => {
        total += item.total
        win += item.win
        draw += item.draw
        lose += item.lose
      })

      win = Math.round(win / 3)
      draw = Math.round(draw / 3)
      lose = Math.round(lose / 3)
      sum = win + draw + lose
      return { total, win, draw, lose, sum }
    },

    // 图表数据设置方法
    setMapValue(target = [], obj) {
      target.map(item => {
        if (item.name === '胜') {
          item.value = obj.winHome.count
        } else if (item.name === '平') {
          item.value = obj.tie.count
        } else if (item.name === '负') {
          item.value = obj.winGuest.count
        }
      })
    },

    // 数据置零
    initZero(value) {
      if (value === 1) {
        this.currentMsg = {
          total: 0,
          show: false,
          winHome: { count: 0, per: '0%' },
          winGuest: { count: 0, per: '0%' },
          tie: { count: 0, per: '0%' },
        }
      } else if (value === 2) {
        this.lastThreeMsg = {
          total: 0,
          show: false,
          winHome: { count: 0, per: '0%' },
          winGuest: { count: 0, per: '0%' },
          tie: { count: 0, per: '0%' },
        }
      } else {
        this.lastThreeMsg = {
          total: 0,
          show: false,
          winHome: { count: 0, per: '0%' },
          winGuest: { count: 0, per: '0%' },
          tie: { count: 0, per: '0%' },
        }
        this.currentMsg = {
          total: 0,
          show: false,
          winHome: { count: 0, per: '0%' },
          winGuest: { count: 0, per: '0%' },
          tie: { count: 0, per: '0%' },
        }
      }
    },

    // 网络请求
    fetchResult(eventId, yearId) {
      if (!yearId) {
        return
      }
      this.sourceToken && this.sourceToken.cancel()

      this.sourceToken = CancelToken.source()

      this.loading = true
      this.$axios
        .get(api.get.football.fetchResultOfRaceOfFootball, {
          params: {
            event_id: eventId,
            season_id: yearId,
          },
          cancelToken: this.sourceToken.token,
        })
        .then(({ code, data }) => {
          if (code !== 0 || !data) {
            throw new Error('胜平负分布数据为空')
          }
          const { curr, lastThree } = data

          // 若返回数据中，没有当前赛季信息
          if (!curr) {
            this.initZero(1)
          } else {
            this.currentMsg.total = curr.total
            this.currentMsg.show = true
            this.currentMsg.winHome.count = curr.win
            this.currentMsg.winGuest.count = curr.lose
            this.currentMsg.tie.count = curr.draw

            this.currentMsg.winHome.per = this.formatPercent(
              curr.win,
              curr.total
            )
            this.currentMsg.winGuest.per = this.formatPercent(
              curr.lose,
              curr.total
            )
            this.currentMsg.tie.per = this.formatPercent(curr.draw, curr.total)
          }

          // 若返回数据中，没有近3个赛季信息
          if (!lastThree) {
            this.initZero(2)
          } else {
            const temp = this.seasonDataAdd(lastThree)

            this.lastThreeMsg.total = temp.total
            this.lastThreeMsg.winHome.count = temp.win
            this.lastThreeMsg.winGuest.count = temp.lose
            this.lastThreeMsg.tie.count = temp.draw
            this.lastThreeMsg.show = true
            this.lastThreeMsg.winHome.per = this.formatPercent(
              temp.win,
              temp.sum
            )
            this.lastThreeMsg.winGuest.per = this.formatPercent(
              temp.lose,
              temp.sum
            )
            this.lastThreeMsg.tie.per = this.formatPercent(temp.draw, temp.sum)
          }
        })
        .catch(() => {
          this.initZero()
        })
        .finally(() => {
          this.justifySeason(this.value)
          this.loading = false
        })
    },

    // 判断赛季类型并更新数据、图表
    justifySeason(value) {
      if (value === 1) {
        this.pieMsg = this.currentMsg // 设置右部文案数据

        // 设置图表数据
        this.setMapValue(this.optionsPie.series[0].data, this.currentMsg)
        this.setMapValue(this.optionsPie.series[1].data, this.currentMsg)

        // 重绘图表
        this.$refs.pieMap.chart.setOption(this.optionsPie, true)
      } else if (value === 2) {
        this.pieMsg = this.lastThreeMsg // 设置右部文案数据

        // 设置图表数据
        this.setMapValue(this.optionsPie.series[0].data, this.lastThreeMsg)
        this.setMapValue(this.optionsPie.series[1].data, this.lastThreeMsg)

        // 重绘图表
        this.$refs.pieMap.chart.setOption(this.optionsPie, true)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.result-distribution-wrap {
  .no-data {
    text-align: center;
    line-height: 300px;
  }

  .select-wrap /deep/ .title {
    width: 146px;
  }

  .map-section {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .pie-map {
      width: 500px;
    }

    .pie-msg {
      flex: 1;

      .title {
        font-family: $font-family-no-number;
        font-weight: bold;
        font-size: $font-size-large;
        color: #333;
      }

      .ctx {
        margin-top: 14px;
        font-family: $font-family-no-number;
        font-size: $font-size-small;
        color: #333;
      }

      .sp-red {
        color: #e1243b;
      }
    }
  }
}
</style>
