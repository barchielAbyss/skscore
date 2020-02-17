<template>
  <div v-loading="loading" class="match-odds-ou-list">
    <div class="card">
      <TableList
        :columns="columns"
        :data-list="ouList"
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
      { title: '大球', key: 'bi', width: 120 },
      { title: '盘口', key: 'ti', width: 120 },
      { title: '小球', key: 'si', width: 120 },
    ],
  },
  {
    title: '即时',
    key: 'initial',
    width: 360,
    children: [
      { title: '大球', key: 'b', width: 120 },
      { title: '盘口', key: 't', width: 120 },
      { title: '小球', key: 's', width: 120 },
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
      loading: false,
      originData: null,
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
      return ['bi', 'ti', 'si', 'b', 't', 's']
    },
    ouList() {
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
    this.fetchOuList()
    this.onSocketMessage()
  },
  beforeDestroy() {
    this.offSocketMessage()
  },
  methods: {
    onSocketMessage() {
      emitter.$on('socket-football-ou', this.changeOriginData)
    },
    offSocketMessage() {
      emitter.$off('socket-football-ou', this.changeOriginData)
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
          console.log('获取到的大小球', curItem)

          this.$set(this.originData.odds, companyIndex, {
            ...this.originData.odds[companyIndex],
            ...curItem.odd,
          })
        }
      })
    },
    fetchOuList() {
      this.loading = true

      this.$axios
        .get(api.get.football.fetchOddOuList, {
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
          this.originData = {}
        })
        .finally(() => {
          this.loading = false
        })
    },
    fetchStatistical(odds) {
      const oddList = {
        b: odds.map(o => Number(o.b)),
        s: odds.map(o => Number(o.s)),
        t: odds.map(o => Number(o.t)),
        bi: odds.map(o => Number(o.bi)),
        si: odds.map(o => Number(o.si)),
        ti: odds.map(o => Number(o.ti)),
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
          b: this.fetchState(maxValues.b, maxValues.bi),
          s: this.fetchState(maxValues.s, maxValues.si),
          t: this.fetchState(maxValues.t, maxValues.ti),
        },
        minValueState: {
          b: this.fetchState(minValues.b, minValues.bi),
          s: this.fetchState(minValues.s, minValues.si),
          t: this.fetchState(minValues.t, minValues.ti),
        },
      }
    },
    formatList({ odds, companys }) {
      return odds.map(item => {
        const { b, s, t, bi, si, ti } = item
        const ItemCompany = companys[item.company_id]
        const InfoSrc = this.$router.resolve({
          name: 'competition-odds-company',
          query: {
            id: this.matchId,
            companyId: item.company_id,
            teamName: this.teamName,
            companyType: 'ou',
          },
        }).href

        this.itemKeys.forEach(key => {
          item[key] = Number(item[key]).toFixed(2)
        })

        return {
          ...item,
          valueState: {
            b: this.fetchState(b, bi),
            s: this.fetchState(s, si),
            t: this.fetchState(t, ti),
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
