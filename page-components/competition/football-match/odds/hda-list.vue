<template>
  <div v-loading="loading" class="match-odds-hda-list">
    <div class="list-box card">
      <div class="list-tools-bar">
        <div class="tools-bar-left">
          <span class="tool-button" @click="handleHideItem">删除选中</span>
          <span class="tool-button" @click="handleShowItem">保留选中</span>
          <VSelect
            v-model="curOddType"
            class="tool-select"
            :options="oddTypes"
            @change="clearChecked"
          />
        </div>
        <div class="tools-bar-right">
          <span class="tool-total">
            共 <i>{{ totalCompanyLen - hiddenList.length }}</i
            >/{{ totalCompanyLen }} 家公司
          </span>
          <span class="tool-show-all" @click="handleShowAll">[全部显示]</span>
        </div>
      </div>

      <HdaListTable
        ref="tableList"
        :is-fixed="fixedType"
        :hda-list="hdaList"
        :company-list="companyList"
        :odd-type="curOddType"
        :hidden-list="hiddenList"
        :team-name="teamName"
        :on-change-checked="onChangeChecked"
        :on-change-hidden-list="onChangeHiddenList"
      />
    </div>
    <HdaListStatistics
      ref="statisticsList"
      :is-fixed="fixedType"
      :hda-list="hdaList"
      :odd-type="curOddType"
      :on-change-fixed="onChangeFixed"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mean } from 'lodash'

import api from '@/api'
import emitter from '@/utils/emitter'

import VSelect from '@/components/popover-select'
import HdaListStatistics from './hda-list-statistics'
import HdaListTable from './hda-list-table'

const ODD_TYPES = [
  { label: '所有指数', value: 0 },
  { label: '初盘', value: 1 },
  { label: '即时盘', value: 2 },
]

export default {
  components: {
    VSelect,
    HdaListTable,
    HdaListStatistics,
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
      curOddType: 0,
      loading: false,
      originData: null,
      hdaList: [],
      hiddenList: [],
      companyList: [],
      fixedType: false,
    }
  },
  computed: {
    oddTypes: () => ODD_TYPES,
    totalCompanyLen() {
      return this.hdaList ? this.hdaList.length : 0
    },
    checkedIds() {
      return (this.hdaList || [])
        .filter(item => item.checked)
        .map(item => item.id)
    },
    unCheckedIds() {
      return (this.hdaList || [])
        .filter(item => !item.checked && !this.hiddenList.includes(item.id))
        .map(item => item.id)
    },
  },
  watch: {
    originData(value) {
      if (value) {
        this.hdaList = this.formatData(value)
      }
    },
  },
  mounted() {
    this.fetchHdaList()
    this.onSocketMessage()
  },
  beforeDestroy() {
    this.offSocketMessage()
  },
  methods: {
    onSocketMessage() {
      emitter.$on('socket-football-hda', this.changeOriginData)
    },
    offSocketMessage() {
      emitter.$off('socket-football-hda', this.changeOriginData)
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
          console.log('获取到的欧值', curItem)

          this.$set(this.originData.odds, companyIndex, {
            ...this.originData.odds[companyIndex],
            ...curItem.odd,
          })
        }
      })
    },
    fetchHdaList() {
      this.loading = true
      this.$axios
        .get(api.get.football.fetchOddHdaList, {
          params: {
            match_id: this.matchId,
          },
        })
        .then(({ code, data, msg }) => {
          if (code !== 0 || !data) {
            throw new Error(msg)
          }
          this.originData = data

          this.$nextTick(() => {
            this.clearChecked()
          })
        })
        .catch(() => {
          this.originData = null
        })
        .finally(() => {
          this.loading = false
        })
    },
    formatData({ companys, odds } = {}) {
      const meanOdd = {
        w: mean(odds.map(o => Number(o.w))),
        d: mean(odds.map(o => Number(o.d))),
        l: mean(odds.map(o => Number(o.l))),
        wi: mean(odds.map(o => Number(o.wi))),
        di: mean(odds.map(o => Number(o.di))),
        li: mean(odds.map(o => Number(o.li))),
      }
      return odds.map(item => {
        const company = companys[item.company_id]
        const { w, d, l, wi, di, li, date } = item
        return {
          id: item.company_id,
          company,
          companyName: company.name,
          checked: false,
          time: dayjs(Number(date)).format('MM-DD HH:mm'),
          instant: this.fetchHdaItem({
            value: { w, d, l },
            mean: { w: meanOdd.w, d: meanOdd.d, l: meanOdd.l },
          }),
          initial: this.fetchHdaItem({
            value: { w: wi, d: di, l: li },
            mean: { w: meanOdd.wi, d: meanOdd.di, l: meanOdd.li },
          }),
        }
      })
    },
    fetchHdaItem(data) {
      const {
        value: { w, d, l },
        mean: { w: mw, d: md, l: ml },
      } = data

      const returnRate = (1 / (1 / w + 1 / d + 1 / l)) * 100
      const wRate = returnRate / w
      const dRate = returnRate / d
      const lRate = returnRate / l
      const wKelly = (w / mw) * (returnRate / 100)
      const dKelly = (d / md) * (returnRate / 100)
      const lKelly = (l / ml) * (returnRate / 100)

      return {
        w: w,
        d: d,
        l: l,
        returnRate: returnRate.toFixed(2),
        wRate: wRate.toFixed(2),
        dRate: dRate.toFixed(2),
        lRate: lRate.toFixed(2),
        wKelly: wKelly.toFixed(2),
        dKelly: dKelly.toFixed(2),
        lKelly: lKelly.toFixed(2),
      }
    },
    onChangeFixed(type) {
      this.fixedType = type
    },
    onChangeChecked(value) {
      value.forEach(id => {
        this.hdaList.find(item => item.id === id).checked = true
      })
    },
    onChangeHiddenList(value) {
      this.hiddenList = value
      this.clearChecked()
    },
    clearChecked() {
      if (!this.hadList) {
        return
      }

      this.hdaList.forEach((_, index) => {
        this.hdaList[index].checked = false
      })

      this.$nextTick(() => {
        this.$refs.tableList.checkedList = []
      })
    },
    handleShowAll() {
      this.hiddenList = []
      this.clearChecked()
    },
    handleHideItem() {
      this.hiddenList.push(...this.checkedIds)
      this.clearChecked()
    },
    handleShowItem() {
      if (!this.checkedIds.length) {
        return
      }
      this.hiddenList.push(...this.unCheckedIds)
      this.clearChecked()
    },
  },
}
</script>

<style lang="scss" scoped>
.match-odds-hda-list {
  .list-tools-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #666;
    padding-bottom: 14px;
    line-height: 30px;
    .tool-button {
      cursor: pointer;
      border: 1px solid #ededef;
      padding: 4px 10px;
      margin-right: 8px;
      @include transition-all;
      &:hover {
        background-color: #ededef;
      }
    }
    .tool-total {
      color: #999;
      padding-right: 8px;
      i {
        color: #e1243b;
        font-style: normal;
      }
    }
    .tool-show-all {
      color: #999;
      cursor: pointer;
      @include transition-all;
      &:hover {
        color: $color-active;
      }
    }
  }
}
</style>
