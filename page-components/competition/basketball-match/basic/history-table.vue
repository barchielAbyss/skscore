<template>
  <table class="match-basic-history-table">
    <thead>
      <tr class="row-title">
        <template v-for="(item, index) of columns">
          <td
            v-if="item.title"
            :key="index"
            :width="item.width"
            :rowspan="item.rowspan"
            :class="{ border: item.border }"
          >
            {{ item.title }}
          </td>

          <td
            v-else-if="['ah', 'hda'].includes(item.key)"
            :key="index"
            :colspan="item.children.length"
          >
            <div class="filter-select-main" />
          </td>

          <td
            v-else-if="['session'].includes(item.key)"
            :key="index"
            :colspan="item.children.length"
          >
            全场
          </td>
        </template>
      </tr>
    </thead>

    <tbody v-if="filterList.length">
      <tr v-for="item of filterList" :key="item.id">
        <td
          v-for="(column, index) of columns"
          :key="index"
          :class="[
            {
              'is-cur-team':
                Number(curTeam.id) === Number(item[`${column.key}Id`]),
            },
            column.key,
          ]"
          :style="{
            color: ['胜', '赢', '大'].includes(item[column.key])
              ? '#e1243b '
              : ['负', '输', '小'].includes(item[column.key])
              ? '#00a54f'
              : '',
          }"
          v-html="item[column.key]"
        />
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <td colspan="20">暂无数据</td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td colspan="20">
          <template>
            近 <span>{{ isEmpty ? '-' : filterList.length }}</span> 场,
            {{ curTeam.name_js || curTeam.name }}
          </template>

          <template>
            胜出<span> {{ isEmpty ? '-' : winedLen }} </span>场,
          </template>

          <template>
            胜率: <span class="green">{{ fetchPercent(winedLen) }}</span>
          </template>

          <template>
            让分胜率:
            <span
              v-if="filterList.every(item => item.ahType !== '-')"
              class="blue"
              v-text="
                fetchPercent(
                  filterList.filter(item => item.ahType === '赢').length
                )
              "
            />
            <span v-else class="gray" v-text="'-'" />
          </template>

          <template>
            大分率:
            <span
              v-if="filterList.every(item => item.ouType !== '-')"
              class="blue"
              v-text="
                fetchPercent(
                  filterList.filter(item => item.ouType === '大').length
                )
              "
            />
            <span v-else class="gray" v-text="'-'" />
          </template>

          <template>
            单率:
            <span class="blue">
              {{
                fetchPercent(
                  filterList.filter(item => item.totalScore % 2).length
                )
              }}
            </span>
          </template>
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<script>
import dayjs from 'dayjs'

import { exponentialArray2Object } from '@/utils/getOdds2Object'

const WIN_TYPES = {
  0: '未知',
  1: '胜',
  2: '负',
}

const COLUMNS_LIST = () => [
  { title: '赛事', width: 80, key: 'event' },
  { title: '日期', width: 80, key: 'time' },
  { title: '主场', width: 118, key: 'homeTeam' },
  { title: '比分', width: 86, key: 'score' },
  { title: '客场', width: 118, key: 'guestTeam', border: true },
  { title: '胜/负', width: 65, key: 'winType' },
  { title: '分差', width: 70, key: 'gap' },
  { title: '让分盘', width: 70, key: 'ahL' },
  { title: '盘路', width: 70, key: 'ahType' },
  { title: '总分', width: 70, key: 'totalScore' },
  { title: '总分盘', width: 70, key: 'ouT' },
  { title: '盘路', width: 70, key: 'ouType' },
]

export default {
  props: {
    curTeam: {
      type: Object,
      default: () => ({}),
    },
    tableData: {
      type: Array,
      default: () => [],
    },
    tableSize: {
      type: Number,
      default: 6,
    },
  },
  data() {
    return {
      tableList: [],
      isEmpty: false,
    }
  },
  computed: {
    columns() {
      return COLUMNS_LIST()
    },
    filterList() {
      return this.tableList.filter((item, index) => index < this.tableSize)
    },
    winedLen() {
      return this.filterList.filter(item => item.winType === '胜').length
    },
  },
  watch: {
    tableData: {
      immediate: true,
      handler(value) {
        if (value === null || value.length === 0) {
          this.isEmpty = true
        } else {
          this.isEmpty = false
          this.tableList = this.formatTableData()
        }
      },
    },
  },
  methods: {
    fetchPercent(value) {
      if (this.isEmpty) {
        return '-'
      }
      const total = this.filterList.length

      if (!value || !total) {
        return '0%'
      }
      return `${Math.ceil((value / total) * 100)}%`
    },
    formatTableData() {
      return (this.tableData || [])
        .map(item => {
          const {
            id,
            event,
            home,
            guest,
            ah,
            hda,
            ou,
            result,
            time,
            guest_total: guestScore,
            home_total: homeScore,
          } = item

          const exponential = exponentialArray2Object({
            ah,
            hda,
            ou,
          })

          return {
            id,
            exponential,
            event: event.name_js || event.name,
            time: dayjs(Number(time)).format('YY/MM/DD'),
            homeTeamId: home.id,
            homeTeam: home.name_js || home.name,
            score: `<span class="red">${homeScore}-${guestScore}</span>`,
            guestTeamId: guest.id,
            guestTeam: guest.name_js || guest.name,
            winType: WIN_TYPES[result],
            gap: Number(homeScore) - Number(guestScore),
            ahL: exponential.ah.l || '-',
            totalScore: Number(guestScore) + Number(homeScore),
            ouT: exponential.ou.t || '-',
          }
        })
        .map(item => ({
          ...item,
          ahType: this.fetchWinPlate(item),
          ouType: this.fetchBigPlate(item),
        }))
    },
    fetchWinPlate(item) {
      const {
        exponential: { ah },
        gap,
      } = item
      if (!ah.g) {
        return '-'
      }
      const ahYield = Number(ah.g)
      const res = gap - ahYield
      if (res > 0) {
        return '赢'
      }
      if (res < 0) {
        return '输'
      }
      if (res === 0) {
        return '平'
      }
    },
    fetchBigPlate(item) {
      const {
        exponential: { ou },
        totalScore,
      } = item
      if (!ou.t) {
        return '-'
      }
      const ouYield = Number(ou.t)

      const res = totalScore - ouYield
      if (res > 0) {
        return '大'
      }
      if (res < 0) {
        return '小'
      }
      if (res === 0) {
        return '平'
      }
    },
    handleChangeFilter(key, type, value) {
      this.filterInfo[key][type] = value
    },
  },
}
</script>

<style lang="scss" scoped>
.match-basic-history-table {
  width: 100%;
  text-align: center;

  thead {
    tr {
      background-color: #f3f4f7;
      &.row-sub-title {
        line-height: 20px;
      }
      td {
        border-right: 1px solid transparent;
        line-height: 46px;
        &.border {
          border-color: $color-white;
        }
      }
      .filter-select-main {
        display: flex;
        line-height: 24px;
        .filter-select-item {
          width: 4em;
          flex: 1;
          border-right: 1px solid $color-white;
          &:last-of-type {
            border-right: none;
          }
        }
      }
    }
  }

  tbody {
    tr {
      &:nth-of-type(even) {
        background-color: #f5f5f5;
      }
      &:nth-of-type(odd) {
        background-color: $color-white;
      }
      td {
        line-height: 36px;
        border: 1px solid #efefef;
        white-space: nowrap;

        &:first-of-type,
        &:last-of-type {
          border-left: none;
          border-right: none;
        }
      }
    }
    .is-cur-team {
      color: $color-active;
    }
  }

  tfoot {
    text-align: left;
    td {
      padding-top: 8px;
    }
  }

  /deep/ span {
    &.red {
      color: #e1243b;
    }
    &.green {
      color: #00a54f;
      padding: 0 12px 0 2px;
    }
    &.blue {
      color: $color-active;
      padding: 0 12px 0 2px;
    }
    &.gray {
      color: #aaa;
      padding: 0 12px 0 2px;
    }
  }
}
</style>
