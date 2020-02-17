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
            :class="{ 'no-border': item.rowspan === 2 }"
          >
            {{ item.title }}
          </td>

          <td
            v-else-if="['ah', 'hda'].includes(item.key)"
            :key="index"
            :colspan="item.children.length"
          >
            <div class="filter-select-main">
              <VSelect
                v-model="filterInfo[item.key].company"
                :options="companyList"
                :on-change="handleChangeFilter.bind(null, item.key, 'company')"
                class="filter-select-item"
              />

              <VSelect
                v-model="filterInfo[item.key].dish"
                :options="dishList"
                :on-change="handleChangeFilter.bind(null, item.key, 'dish')"
                class="filter-select-item"
              />
            </div>
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

      <tr class="row-sub-title">
        <td v-for="(item, index) of columnsChildren" :key="index">
          {{ item.title }}
        </td>
      </tr>
    </thead>

    <tbody v-if="filterList.length">
      <tr v-for="item of filterList" :key="item.id">
        <template v-for="(column, index) of columns">
          <td
            v-if="!column.children"
            :key="index"
            :class="[
              {
                'is-cur-team': curTeamId === Number(item[`${column.key}Id`]),
              },
              column.key,
            ]"
            v-html="item[column.key]"
          />
          <template v-if="column.children">
            <td
              v-for="(children, childrenIndex) of column.children"
              :key="`${index}-${childrenIndex}`"
              :style="{
                color: ['胜', '赢', '大'].includes(
                  item[column.key][children.key]
                )
                  ? '#e1243b '
                  : ['负', '输', '小'].includes(item[column.key][children.key])
                  ? '#00a54f'
                  : '',
              }"
            >
              <template
                v-if="column.key === 'ah' && ['l', 'li'].includes(children.key)"
              >
                {{ fetchAhYield(item[column.key][children.key]) }}
              </template>
              <template v-else>
                {{ item[column.key][children.key] }}
              </template>
            </td>
          </template>
        </template>
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
          </template>

          <template>
            胜出<span> {{ isEmpty ? '-' : winedLen }} </span>场,
          </template>

          <template>
            平局<span>
              {{
                isEmpty
                  ? '-'
                  : filterList.filter(item => item.session.win === '平').length
              }}
            </span>
            场,
          </template>

          <template>
            输<span>
              {{
                isEmpty
                  ? '-'
                  : filterList.filter(item => item.session.win === '负').length
              }}
            </span>
            场,
          </template>

          <template>
            胜率: <span class="green">{{ fetchPercent(winedLen) }}</span>
          </template>

          <template>
            赢盘率:
            <span
              v-if="filterList.every(item => item.session.ahWin !== '-')"
              class="blue"
              v-text="
                fetchPercent(
                  filterList.filter(item => item.session.ahWin === '赢').length
                )
              "
            />
            <span v-else class="gray" v-text="'-'" />
          </template>

          <template>
            大球率:
            <span
              v-if="filterList.every(item => item.session.bigWin !== '-')"
              class="blue"
              v-text="
                fetchPercent(
                  filterList.filter(item => item.session.bigWin === '大').length
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
                  filterList.filter(item => item.scoreTotal % 2).length
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

import { footballAhYield } from '@/utils/status'
import { exponentialArray2Object } from '@/utils/getOdds2Object'

import VSelect from '@/components/popover-select'

const DEFAULT_FILTER = () => ({
  ah: { company: '皇冠', dish: 1 },
  hda: { company: '皇冠', dish: 1 },
  session: '',
})

const COMPANY_LIST = [
  { value: '皇冠', label: '皇冠' },
  { value: 'bet365', label: 'bet365' },
  { value: '澳门', label: '澳门' },
]

const WIN_TYPES = {
  0: '未知',
  1: '胜',
  2: '平',
  3: '负',
}

const DISH_LIST = [
  { value: 1, label: '终盘' },
  { value: 2, label: '初盘' },
]

const COLUMNS_LIST = () => [
  { title: '类型', rowspan: 2, width: 80, key: 'event' },
  { title: '日期', rowspan: 2, width: 80, key: 'time' },
  { title: '主场', rowspan: 2, width: 100, key: 'homeTeam' },
  { title: '比分(半场)', rowspan: 2, width: 80, key: 'score' },
  { title: '角球', rowspan: 2, width: 40, key: 'corners' },
  { title: '客场', rowspan: 2, width: 100, key: 'guestTeam' },
  {
    width: 164,
    key: 'ah',
    children: [
      { title: '主', key: 'h' },
      { title: '盘口', key: 'l' },
      { title: '客', key: 'g' },
    ],
  },
  {
    width: 182,
    key: 'hda',
    children: [
      { title: '主', key: 'w' },
      { title: '平', key: 'd' },
      { title: '客', key: 'l' },
    ],
  },
  {
    width: 138,
    key: 'session',
    children: [
      { title: '胜负', key: 'win' },
      { title: '让球', key: 'ahWin' },
      { title: '大小', key: 'bigWin' },
    ],
  },
]

export default {
  components: {
    VSelect,
  },
  props: {
    curTeamId: {
      type: Number,
      default: 0,
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
      filterInfo: DEFAULT_FILTER(),
      tableList: [],
      isEmpty: false,
    }
  },
  computed: {
    companyList: () => COMPANY_LIST,
    dishList: () => DISH_LIST,
    columns() {
      const defaultColumns = COLUMNS_LIST()
      if (this.filterInfo.ah.dish === 2) {
        const children = defaultColumns.find(item => item.key === 'ah').children
        children.forEach((item, index) => {
          children[index].key = `${item.key}i`
        })
      }
      if (this.filterInfo.hda.dish === 2) {
        const children = defaultColumns.find(item => item.key === 'hda')
          .children
        children.forEach((item, index) => {
          children[index].key = `${item.key}i`
        })
      }

      return defaultColumns
    },
    filterList() {
      return this.tableList.filter((item, index) => index < this.tableSize)
    },
    columnsChildren() {
      return (this.columns || []).reduce((prev, item) => {
        if (item.children) {
          prev = [...prev, ...item.children]
        }
        return prev
      }, [])
    },
    winedLen() {
      return this.filterList.filter(item => item.session.win === '胜').length
    },
  },
  watch: {
    'filterInfo.ah.company'() {
      this.tableList = this.formatTableData()
    },
    'filterInfo.hda.company'() {
      this.tableList = this.formatTableData()
    },
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
    fetchPercent(value, total = this.filterList.length) {
      if (this.isEmpty) {
        return '-'
      }

      if (!value || !total) {
        return '0%'
      }
      return `${Math.ceil((value / total) * 100)}%`
    },
    fetchAhYield(value) {
      const odd = footballAhYield(value)
      return odd === '-' ? '' : odd
    },
    formatTableData() {
      return (this.tableData || [])
        .map(item => {
          const eventName = item.event.name_js || item.event.name
          const homeTeamName = item.home
            ? item.home.name_js || item.home.name
            : '-'
          const guestTeamName = item.guest
            ? item.guest.name_js || item.guest.name
            : '-'

          const exponential = exponentialArray2Object({
            ah: item.ah[this.filterInfo.ah.company],
            hda: item.hda[this.filterInfo.hda.company],
            ou: item.ou[this.filterInfo.ah.company],
          })

          return {
            ...item,
            homeTeamId: item.home_team_id,
            guestTeamId: item.guest_team_id,
            event: eventName,
            time: dayjs(Number(item.time)).format('YY/MM/DD'),
            homeTeam: homeTeamName,
            score: `<span style="color: #e1243b">${item.home_goal_all ||
              0}-${item.guest_goal_all || 0}</span> (${item.home_goal_b ||
              0}-${item.guest_goal_b || 0})`,
            corners: `${item.home_corners || 0}-${item.guest_corners || 0}`,
            guestTeam: guestTeamName,
            scoreTotal:
              Number(item.home_goal_all) ||
              0 + Number(item.guest_goal_all) ||
              0,
            ...exponential,
          }
        })
        .map(item => {
          return {
            ...item,
            session: {
              win: WIN_TYPES[item.result],
              ahWin: this.fetchWinPlate(item),
              bigWin: this.fetchBigPlate(item),
            },
          }
        })
    },
    fetchWinPlate(item) {
      const {
        ah,
        guest_goal_all: guestGoalAll,
        home_goal_all: homeGoalAll,
      } = item
      if (!ah.l && !ah.li[5]) {
        return '-'
      }
      const ahYield = Number(ah.l || ah.li)
      const res = Number(homeGoalAll) - Number(guestGoalAll) - ahYield
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
        ou,
        guest_goal_all: guestGoalAll,
        home_goal_all: homeGoalAll,
      } = item
      if (!ou.t && !ou.ti) {
        return '-'
      }
      const ouYield = Number(ou.t || ou.ti)

      const res = Number(homeGoalAll) + Number(guestGoalAll) - ouYield
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
      background-color: #f5f5f5;
      &.row-sub-title {
        line-height: 20px;
      }
      td {
        border: 1px solid #fff;
        &.no-border {
          border: none;
        }
      }
      .filter-select-main {
        display: flex;
        line-height: 24px;
        .filter-select-item {
          width: 4em;
          flex: 1;
          border-right: 1px solid #fff;
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
        white-space: nowrap;
        border: 1px solid #efefef;
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
    span {
      color: #e1243b;
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
}
</style>
