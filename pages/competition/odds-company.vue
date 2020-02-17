<template>
  <div class="intelligence-match-odds-company card">
    <ClientOnly>
      <ElBreadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
        <ElBreadcrumbItem
          v-for="item of breadcrumbList"
          :key="item.title"
          class="breadcrumb-item"
        >
          <NuxtLink :to="item.path">{{ item.title }}</NuxtLink>
        </ElBreadcrumbItem>
      </ElBreadcrumb>
    </ClientOnly>

    <div class="company-main">
      <CompanyMenu class="menu" :nav-list="companyList" :cur-nav="companyId" />
      <CompanyHistory
        class="history"
        :history-list="companyHistory"
        :columns="columns"
      />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mean } from 'lodash'
import { mapState } from 'vuex'

import api from '@/api'
import { diffTime } from '@/utils/date'
import { footballAhYield, footballOuYield } from '@/utils/status'

import CompanyMenu from '@/page-components/competition/odd-company/company-menu'
import CompanyHistory from '@/page-components/competition/odd-company/company-history'

const API_MAP = {
  1: {
    company: {
      ou: api.get.football.fetchOddOuList,
      hda: api.get.football.fetchOddHdaList,
      ah: api.get.football.fetchOddAhList,
    },
    history: {
      ou: api.get.football.fetchOddOuHistory,
      hda: api.get.football.fetchOddHdaHistory,
      ah: api.get.football.fetchOddAhHistory,
    },
  },
  2: {
    company: {
      ou: api.get.basketball.fetchMatchOu,
      hda: api.get.basketball.fetchMatchHda,
      ah: api.get.basketball.fetchMatchAh,
    },
    history: {
      ou: api.get.basketball.fetchMatchOuHistory,
      hda: api.get.basketball.fetchMatchHdaHistory,
      ah: api.get.basketball.fetchMatchAhHistory,
    },
  },
}

const COLUMNS = {
  ou: [
    { title: '大球', width: 195, key: 'b', border: true },
    { title: '盘口', width: 195, key: 't', border: true },
    { title: '小球', width: 195, key: 's', border: true },
    { title: '变化时间', width: 174, key: 'time' },
  ],
  basketballHda: [
    { title: '主胜', width: 87, key: 'h' },
    { title: '客胜', width: 87, key: 'g' },
    { title: '返还率', width: 87, key: 'returnRate', border: true },
    { title: '主胜率', width: 62, key: 'hRate' },
    { title: '客胜率', width: 62, key: 'gRate', border: true },
    { title: '凯利指数', width: 126, key: 'basketballKelly', border: true },
    { title: '变化时间', width: 99, key: 'time' },
  ],
  hda: [
    { title: '主胜', width: 87, key: 'w' },
    { title: '平局', width: 87, key: 'd' },
    { title: '客胜', width: 87, key: 'l' },
    { title: '返还率', width: 87, key: 'returnRate', border: true },
    { title: '主胜率', width: 62, key: 'wRate' },
    { title: '平局率', width: 62, key: 'dRate' },
    { title: '客胜率', width: 62, key: 'lRate', border: true },
    { title: '凯利指数', width: 126, key: 'kelly', border: true },
    { title: '变化时间', width: 99, key: 'time' },
  ],
  ah: [
    { title: '主胜', width: 195, key: 'h', border: true },
    { title: '盘口', width: 195, key: 'l', border: true },
    { title: '客胜', width: 195, key: 'g', border: true },
    { title: '变化时间', width: 174, key: 'time' },
  ],
}

export default {
  components: {
    CompanyMenu,
    CompanyHistory,
  },
  watchQuery: ['companyId'],
  async asyncData({ $axios, query }) {
    const companyListApi =
      API_MAP[query.category || 1].company[query.companyType]
    const historyListApi =
      API_MAP[query.category || 1].history[query.companyType]

    const companyList = await Promise.resolve(
      $axios
        .get(companyListApi, {
          params: {
            match_id: query.id,
          },
        })
        .then(({ data }) => {
          return Object.values(data.companys).map(item => ({
            label: item.name,
            value: item.id,
          }))
        })
    )

    const historyList = await Promise.resolve(
      $axios
        .get(historyListApi, {
          params: {
            match_id: query.id,
            company_id: query.companyId,
          },
        })
        .then(({ data }) => {
          return data
        })
    )

    return {
      companyList,
      historyList,
    }
  },
  computed: {
    ...mapState('user', ['serverTime']),
    category() {
      return this.$route.query.category || 1
    },
    matchId() {
      return this.$route.query.id
    },
    companyId() {
      return this.$route.query.companyId
    },
    companyType() {
      return this.$route.query.companyType
    },
    teamName() {
      return this.$route.query.teamName
    },
    isBasketBall() {
      return Number(this.category) === 2
    },
    companyHistory() {
      let history = this.historyList.history || this.historyList.odds

      if (!history) {
        return []
      }

      history = history.filter(
        item => Object.prototype.toString.call(item) === '[object Object]'
      )

      if (this.companyType === 'hda') {
        if (this.isBasketBall) {
          return this.formatBasketballHdaHistory(history)
        } else {
          return this.formatHdaHistory(history)
        }
      } else if (this.companyType === 'ah') {
        return this.formatAhHistory(history)
      } else {
        // ou
        return this.formatOuHistory(history)
      }
    },
    breadcrumbList() {
      return [
        {
          title: this.teamName,
          path: {
            name: this.isBasketBall
              ? 'competition-basketball-match-id-basic'
              : 'competition-football-match-id-basic',
            params: { id: this.matchId },
          },
        },
        {
          title: {
            ah: '亚赔',
            hda: '欧赔',
            ou: this.isBasketBall ? '总分' : '大小球',
          }[this.companyType],
          path: {
            name: this.isBasketBall
              ? 'competition-basketball-match-id-odds'
              : 'competition-football-match-id-odds',
            params: { id: this.matchId },
            query: { tab: this.companyType },
          },
        },
        {
          title: '详情',
          path: this.$route,
        },
      ]
    },
    columns() {
      return this.isBasketBall && this.companyType === 'hda'
        ? COLUMNS.basketballHda
        : COLUMNS[this.companyType]
    },
  },
  methods: {
    fetchState(value, otherValue) {
      if (Number(value) === Number(otherValue)) {
        return ''
      }
      if (Number(value) > Number(otherValue)) {
        return 'red'
      }
      if (Number(value) < Number(otherValue)) {
        return 'green'
      }
    },
    formatBasketballHdaHistory(history) {
      const meanOdd = {
        h: mean(history.map(({ h }) => Number(h))),
        g: mean(history.map(({ g }) => Number(g))),
      }

      const historyList = history.map(item => {
        const { h, g } = item
        const { h: mh, g: mg } = meanOdd

        const returnRate = (1 / (1 / h + 1 / g)) * 100
        const hRate = returnRate / h
        const gRate = returnRate / g
        const hKelly = (h / mh) * (returnRate / 100)
        const gKelly = (g / mg) * (returnRate / 100)
        const itemValue = {}

        Object.entries({
          h,
          g,
          returnRate,
          hRate,
          gRate,
          hKelly,
          gKelly,
        }).forEach(([key, value]) => {
          itemValue[key] = Number(value).toFixed(2)
        })

        return {
          ...itemValue,
          time: dayjs(Number(item.date)).format('MM-DD HH:mm'),
        }
      })

      return historyList.map((item, index) => {
        const next = historyList[index + 1]

        if (!next) {
          return item
        }

        const { h: nh, g: ng, returnRate: nReturnRate } = next
        const { h, g, returnRate } = item
        return {
          ...item,
          valueState: {
            h: this.fetchState(h, nh),
            g: this.fetchState(g, ng),
            returnRate: this.fetchState(returnRate, nReturnRate),
          },
        }
      })
    },
    formatHdaHistory(history) {
      if (!history || !Array.isArray(history)) {
        return
      }
      const meanOdd = {
        w: mean(history.map(({ Data }) => (Data ? Number(Data[0]) : 0))),
        d: mean(history.map(({ Data }) => (Data ? Number(Data[1]) : 0))),
        l: mean(history.map(({ Data }) => (Data ? Number(Data[2]) : 0))),
      }

      const historyList = history.map(item => {
        const [w, d, l] = item.Data || {}
        const { w: mw, d: md, l: ml } = meanOdd

        const returnRate = (1 / (1 / w + 1 / d + 1 / l)) * 100
        const wRate = returnRate / w
        const dRate = returnRate / d
        const lRate = returnRate / l
        const wKelly = (w / mw) * (returnRate / 100)
        const dKelly = (d / md) * (returnRate / 100)
        const lKelly = (l / ml) * (returnRate / 100)
        const itemValue = {}

        Object.entries({
          w,
          d,
          l,
          returnRate,
          wRate,
          dRate,
          lRate,
          wKelly,
          dKelly,
          lKelly,
        }).forEach(([key, value]) => {
          itemValue[key] = Number(value).toFixed(2)
        })

        return {
          ...itemValue,
          time: dayjs(Number(item.Date)).format('MM-DD HH:mm'),
        }
      })

      return historyList.map((item, index) => {
        const next = historyList[index + 1]

        if (!next) {
          return item
        }

        const { w: nw, d: nd, l: nl, returnRate: nReturnRate } = next
        const { w, d, l, returnRate } = item
        return {
          ...item,
          valueState: {
            w: this.fetchState(w, nw),
            d: this.fetchState(d, nd),
            l: this.fetchState(l, nl),
            returnRate: this.fetchState(returnRate, nReturnRate),
          },
        }
      })
    },
    formatAhHistory(history) {
      const historyList = history.map(item => {
        let h = ''
        let g = ''
        let l = ''
        let date = ''

        if (this.isBasketBall) {
          h = item.h
          g = item.g
          l = item.l
          date = item.date
        } else {
          h = item.Data[0]
          g = item.Data[1]
          l = item.Data[2]
          date = item.Date
        }

        return {
          h: Number(h).toFixed(2),
          g: Number(g).toFixed(2),
          l,
          time: dayjs(Number(date)).format('MM-DD HH:mm'),
          imminent: diffTime(this.serverTime, Number(date), 'hour') < 3,
        }
      })

      return historyList.map((item, index) => {
        const next = historyList[index + 1]
        if (!next) {
          return item
        }

        const { h: nh, g: ng, l: nl } = next
        const { h, g, l } = item

        return {
          ...item,
          l: this.isBasketBall ? l : footballAhYield(l),
          valueState: {
            h: this.fetchState(h, nh),
            g: this.fetchState(g, ng),
            l: this.fetchState(l, nl),
          },
        }
      })
    },
    formatOuHistory(history) {
      const historyList = history.map(item => {
        let b = ''
        let s = ''
        let t = ''
        let date = ''
        if (this.isBasketBall) {
          b = item.b
          s = item.s
          t = item.t
          date = item.date
        } else {
          b = item.Data[0]
          s = item.Data[1]
          t = item.Data[2]
          date = item.Date
        }

        return {
          b: Number(b).toFixed(2),
          s: Number(s).toFixed(2),
          t,
          time: dayjs(Number(date)).format('MM-DD HH:mm'),
          imminent: diffTime(this.serverTime, Number(date), 'hour') < 3,
        }
      })

      return historyList.map((item, index) => {
        const next = historyList[index + 1]
        if (!next) {
          return item
        }

        const { b: nb, s: ns, t: nt } = next
        const { b, s, t } = item

        return {
          ...item,
          t: this.isBasketBall ? t : footballOuYield(t),
          valueState: {
            b: this.fetchState(b, nb),
            s: this.fetchState(s, ns),
            t: this.fetchState(t, nt),
          },
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.intelligence-match-odds-company {
  .breadcrumb {
    padding: 10px 0 20px;
    font-size: 12px;
    .breadcrumb-item {
      /deep/ .el-breadcrumb__inner a {
        font-weight: normal;
      }
    }
    .nuxt-link-active {
      color: $color-active;
    }
  }
  &.card {
    padding: 14px;
    background-color: $color-white;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.03);
    border-radius: 4px;
    margin-bottom: 12px;
    overflow: hidden;
  }
  .company-main {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .menu {
      width: 200px;
    }
    .history {
      width: 762px;
    }
  }
}
</style>
