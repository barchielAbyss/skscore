<template>
  <div v-loading="loading" class="match-odds-ah-list">
    <div class="card">
      <TableList
        :columns="columns"
        :data-list="ahList"
        :statistical="statistical"
        :show-tag="showTag"
      />
    </div>

    <Statistics
      :statistical="statistical"
      :key-map="itemKeys"
      :show-tag="showTag"
      :on-change-show-tag="onChangeShowTag"
      class="card"
    />
  </div>
</template>

<script>
import { max, min } from 'lodash'
import api from '@/api'
import emitter from '@/utils/emitter'
import TableList from './ah-ou-list-table'
import Statistics from './ah-ou-list-statistics'

const COLUMNS_LIST = [
  { title: '公司', key: 'companyName', width: 120 },
  {
    title: '初盘',
    key: 'instant',
    width: 360,
    children: [
      { title: '主胜', key: 'hi', width: 120 },
      { title: '盘口', key: 'li', width: 120 },
      { title: '客胜', key: 'gi', width: 120 },
    ],
  },
  {
    title: '即时',
    key: 'initial',
    width: 360,
    children: [
      { title: '主胜', key: 'h', width: 120 },
      { title: '盘口', key: 'l', width: 120 },
      { title: '客胜', key: 'g', width: 120 },
    ],
  },
  { title: '赔率走势', key: 'info', width: 105 },
]

export default {
  components: {
    TableList,
    Statistics,
  },
  props: {
    typeId: String,
    matchId: {
      type: [String, Number],
      required: true,
    },
    teamName: String,
  },
  data() {
    return {
      test: 0,
      originData: null,
      loading: false,
      showTag: {
        max: false,
        min: false,
      },
    }
  },
  computed: {
    columns() {
      return COLUMNS_LIST
    },
    itemKeys() {
      return ['hi', 'li', 'gi', 'h', 'l', 'g']
    },
    ahList() {
      return this.originData ? this.formatList(this.originData) : []
    },
    statistical() {
      return this.originData
        ? this.fetchStatistical(this.originData.odds)
        : {
            max: '',
            min: '',
          }
    },
  },
  mounted() {
    this.fetchAhList()
    this.onSocketMessage()
  },
  beforeDestroy() {
    this.offSocketMessage()
  },
  methods: {
    onSocketMessage() {
      emitter.$on('socket-football-ah', this.changeOriginData)
    },
    offSocketMessage() {
      emitter.$off('socket-football-ah', this.changeOriginData)
    },
    changeOriginData(data) {
      const curItemList = data.filter(
        item => Number(item.mid) === Number(this.matchId)
      )

      if (!curItemList.length) {
        return
      }

      curItemList.forEach(curItem => {
        const companyIndex = this.originData.odds.findIndex(
          item => Number(item.company_id) === Number(curItem.company_id)
        )

        if (~companyIndex) {
          console.log('获取到的亚值', curItem)

          this.$set(this.originData.odds, companyIndex, {
            ...this.originData.odds[companyIndex],
            ...curItem.odd,
          })
        }
      })
    },
    fetchAhList() {
      this.loading = true

      this.$axios
        .get(api.get.football.fetchOddAhList, {
          params: {
            match_id: this.matchId,
          },
        })
        .then(({ code, data, msg }) => {
          if (code !== 0) {
            throw new Error(msg)
          }

          this.originData = data
        })
        .catch(() => {
          this.ahList = []
        })
        .finally(() => {
          this.loading = false
        })
    },
    fetchStatistical(odds) {
      const oddList = {
        h: odds.map(o => Number(o.h)),
        g: odds.map(o => Number(o.g)),
        l: odds.map(o => Number(o.l)),
        hi: odds.map(o => Number(o.hi)),
        gi: odds.map(o => Number(o.gi)),
        li: odds.map(o => Number(o.li)),
      }

      const maxValues = Object.keys(oddList).reduce((prev, key) => {
        prev[key] = max(oddList[key]).toFixed(2)
        return prev
      }, {})

      const minValues = Object.keys(oddList).reduce((prev, key) => {
        prev[key] = min(oddList[key]).toFixed(2)
        return prev
      }, {})

      return {
        max: {
          ...maxValues,
        },
        min: {
          ...minValues,
        },
        maxValueState: {
          h: this.fetchState(maxValues.h, maxValues.hi),
          g: this.fetchState(maxValues.g, maxValues.gi),
          l: this.fetchState(maxValues.l, maxValues.li),
        },
        minValueState: {
          h: this.fetchState(minValues.h, minValues.hi),
          g: this.fetchState(minValues.g, minValues.gi),
          l: this.fetchState(minValues.l, minValues.li),
        },
      }
    },
    formatList({ odds, companys }) {
      return odds.map(item => {
        const { h, g, l, hi, gi, li } = item
        const ItemCompany = companys[item.company_id]
        const InfoSrc = this.$router.resolve({
          name: 'competition-odds-company',
          query: {
            id: this.matchId,
            companyId: item.company_id,
            teamName: this.teamName,
            companyType: 'ah',
          },
        }).href

        this.itemKeys.forEach(key => {
          item[key] = Number(item[key]).toFixed(2)
        })

        return {
          ...item,
          valueState: {
            h: this.fetchState(h, hi),
            g: this.fetchState(g, gi),
            l: this.fetchState(l, li),
          },
          companyName: ItemCompany ? ItemCompany.name : '未知',
          info: `<a href="${InfoSrc}" target="_blank">详情</a>`,
        }
      })
    },
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
    onChangeShowTag(key, flag) {
      this.showTag[key] = flag
    },
  },
}
</script>
