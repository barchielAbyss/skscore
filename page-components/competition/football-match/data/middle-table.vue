<template>
  <div class="data-table-wrap">
    <p class="title">进球分布</p>

    <TableItem :team-msg="home" />

    <p class="attention">
      <VIcon name="light" class="remind-icon" />提点：据统计近
      <span class="sp-host">{{ flagHome ? data.host.raceNum : '-' }}</span>
      场比赛，场均进球数为
      <span class="sp-host">{{ flagHome ? data.host.score : '-' }}</span>
    </p>

    <TableItem :team-msg="away" />

    <p class="attention">
      <VIcon name="light" class="remind-icon" />提点：据统计近
      <span class="sp-customer">{{
        flagGuest ? data.customer.raceNum : '-'
      }}</span>
      场比赛，场均进球数为
      <span class="sp-customer">{{
        flagGuest ? data.customer.score : '-'
      }}</span>
    </p>
  </div>
</template>

<script>
import api from '@/api'

import VIcon from '@/components/icon/'
import TableItem from './table-item'
const emptyArr = [
  { total: '总', item: '时间', home: '主', guest: '客' },
  { total: '-', item: '0´-10´', home: '-', guest: '-' },
  { total: '-', item: '11´-20´', home: '-', guest: '-' },
  { total: '-', item: '21´-30´', home: '-', guest: '-' },
  { total: '-', item: '31´-40´', home: '-', guest: '-' },
  { total: '-', item: '41´-45', home: '-', guest: '-' },
  { total: '-', item: '46´-55´', home: '-', guest: '-' },
  { total: '-', item: '56´-65´', home: '-', guest: '-' },
  { total: '-', item: '66´-75´', home: '-', guest: '-' },
  { total: '-', item: '76´-85´', home: '-', guest: '-' },
  { total: '-', item: '86´-90´', home: '-', guest: '-' },
]
export default {
  components: { VIcon, TableItem },
  props: {
    homeTeam: {
      type: Object,
      default: () => ({}),
    },
    guestTeam: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      data: {
        host: { raceNum: '12', score: '2.5' },
        customer: { raceNum: '10', score: '2.0' },
      },
      flagHome: false,
      flagGuest: false,
      teamHost: {
        type: 1, // type: 1 主队，0 客队
        logo: '', // 队徽地址
        name: '', // 球队名称
        data: [
          [], // 总进球数
          [], // 主场进球数
          [], // 客场进球数
          [], // 进球时间段
        ],
      }, // 当有数据时，保存到此变量
      teamAway: {
        type: 0, // type: 1 主队，0 客队
        logo: '', // 队徽地址
        name: '', // 球队名称
        data: [
          [], // 总进球数
          [], // 主场进球数
          [], // 客场进球数
          [], // 进球时间段
        ],
      }, // 当有数据时，保存到此变量
      clearDataHome: {
        type: 1, // type: 1 主队，0 客队
        logo: '', // 队徽地址
        name: '', // 球队名称
        data: [
          [], // 总进球数
          [], // 主场进球数
          [], // 客场进球数
          [], // 进球时间段
        ],
      }, // 无数据时的默认空数值
      clearDataAway: {
        type: 0, // type: 1 主队，0 客队
        logo: '', // 队徽地址
        name: '', // 球队名称
        data: [
          [], // 总进球数
          [], // 主场进球数
          [], // 客场进球数
          [], // 进球时间段
        ],
      }, // 无数据时的默认空数值
      away: {},
      home: {},
    }
  },
  created() {
    this.clearData(1)
    this.clearData(0)

    this.home = this.clearDataHome
    this.away = this.clearDataAway
  },
  mounted() {
    // 设置队徽、队名
    this.teamHost.name = this.homeTeam.name
    this.teamHost.logo = this.homeTeam.icon
    this.teamAway.name = this.guestTeam.name
    this.teamAway.logo = this.guestTeam.icon

    Promise.all([
      this.fetchTabData(this.homeTeam.id),
      this.fetchTabData(this.guestTeam.id),
    ])
      .then(([homeTeamInfo, guestTeamInfo]) => {
        // 未获取到主队数据
        if (!homeTeamInfo.data) {
          this.home = this.clearDataHome
        } else if (Number(homeTeamInfo.data.is_divide) === 0) {
          this.home = this.clearDataHome
        } else {
          // 主队数据设置
          this.teamHost.data[0] = this.fetchItemFromArr(
            homeTeamInfo.data.list,
            'total'
          ) // 设置进球总数

          this.teamHost.data[3] = this.fetchItemFromArr(
            homeTeamInfo.data.list,
            'item'
          ) // 设置进球时间段

          this.teamHost.data[1] = this.fetchItemFromArr(
            homeTeamInfo.data.list,
            'home'
          ) // 设置主队主场作战进球数

          this.teamHost.data[2] = this.fetchItemFromArr(
            homeTeamInfo.data.list,
            'guest'
          ) // 设置主队客场场作战进球数

          this.data.host.raceNum = homeTeamInfo.data.list.length // 设置主队最近比赛场次
          this.data.host.score = (
            this.calcTotal(this.teamHost.data[0]) / 10
          ).toFixed(1) // 设置主队场均进球数

          this.home = this.teamHost
          this.flagHome = true
        }

        if (!guestTeamInfo.data) {
          this.away = this.clearDataAway
        } else if (Number(guestTeamInfo.data.is_divide) === 0) {
          this.away = this.clearDataAway
        } else {
          // 客队数据设置
          this.teamAway.data[0] = this.fetchItemFromArr(
            guestTeamInfo.data.list,
            'total'
          ) // 设置进球总数

          this.teamAway.data[3] = this.fetchItemFromArr(
            guestTeamInfo.data.list,
            'item'
          ) // 设置进球时间段

          this.teamAway.data[1] = this.fetchItemFromArr(
            guestTeamInfo.data.list,
            'home'
          ) // 设置客队主场作战进球数

          this.teamAway.data[2] = this.fetchItemFromArr(
            guestTeamInfo.data.list,
            'guest'
          ) // 设置客队客场作战进球数

          this.data.customer.raceNum = homeTeamInfo.data.list.length // 设置客队最近比赛场次
          this.data.customer.score = (
            this.calcTotal(this.teamAway.data[0]) / 10
          ).toFixed(1) // 设置客队场均进球数

          this.away = this.teamAway
          this.flagGuest = true
        }
      })
      .catch(([err1, err2]) => {
        if (err1) {
          this.flagHome = false
          this.home = this.clearDataHome
        }

        if (err2) {
          this.flagGuest = false
          this.away = this.clearDataAway
        }

        console.warn('进球分布表数据获取失败')
      })
  },
  methods: {
    // 数据置空
    clearData(type) {
      if (type) {
        // 主队数据设置
        this.clearDataHome.data[0] = this.fetchItemFromArr(emptyArr, 'total') // 设置进球总数
        this.clearDataHome.data[3] = this.fetchItemFromArr(emptyArr, 'item') // 设置进球时间段
        this.clearDataHome.data[1] = this.fetchItemFromArr(emptyArr, 'home') // 设置主队主场作战进球数
        this.clearDataHome.data[2] = this.fetchItemFromArr(emptyArr, 'guest') // 设置主队客场场作战进球数
        this.flagHome = false
      } else {
        this.clearDataAway.data[0] = this.fetchItemFromArr(emptyArr, 'total')
        this.clearDataAway.data[3] = this.fetchItemFromArr(emptyArr, 'item')
        this.clearDataAway.data[1] = this.fetchItemFromArr(emptyArr, 'home')
        this.clearDataAway.data[2] = this.fetchItemFromArr(emptyArr, 'guest')
        this.flagGuest = false
      }
    },

    // 计算进球总数
    calcTotal(arr) {
      return arr.reduce((prev = 0, item) => {
        return Number(prev) + Number(item)
      })
    },

    // 请求进球分布数据
    fetchTabData(teamId) {
      return this.$axios.get(api.get.football.fetchMatchScoreTab, {
        params: { team_id: teamId },
      })
    },

    // 从返回参数中解析出数组
    fetchItemFromArr(arr = [], target) {
      return arr.map(item =>
        typeof item[target] !== 'undefined' ? item[target] : false
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.data-table-wrap {
  border-radius: 8px;
  padding: 11px 14px;
  margin: 12px 0;
  height: 492px;
  background-color: #fff;

  .title {
    font-family: $font-family-no-number;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 11px;
    color: $font-title-color;
  }

  .attention {
    margin: 14px 0;
    font-size: 12px;
    color: $font-title-color;

    .remind-icon {
      color: #ffbe52;
      font-size: 16px;
      padding-right: 8.4px;
    }

    span.sp-host {
      color: $color-active;
      font-size: 14px;
    }
    span.sp-customer {
      color: #f95d22;
      font-size: 14px;
    }
  }
}
</style>
