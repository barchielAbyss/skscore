<template>
  <table class="competition-table">
    <thead>
      <tr>
        <th
          v-for="column of columns"
          :key="column.key"
          :style="{
            width: `${column.width}px`,
          }"
          :class="`${column.key}-title`"
        >
          <div>
            <template v-if="column.key === 'odds'">
              <div class="odd-checkbox">
                <label>
                  <input
                    v-model="curChecked"
                    type="checkbox"
                    class="m-checkbox"
                    value="hda"
                  />
                  欧指
                </label>
                <label>
                  <input
                    v-model="curChecked"
                    type="checkbox"
                    class="m-checkbox"
                    value="ah"
                  />
                  亚指
                </label>
              </div>

              <div class="odd-company">
                <span class="name">即时盘</span>
                <ClientOnly>
                  <VSelect
                    v-model="curSelect"
                    class="select"
                    :options="companyOpt"
                  />
                </ClientOnly>
              </div>
            </template>
            <template v-else>
              {{ column.title }}
            </template>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item of tableList" :key="item.id">
        <td v-for="column of columns" :key="column.key">
          <div
            :class="`${column.key}-main`"
            :style="{
              color: item[column.key] === '-' && '#333',
            }"
          >
            <template v-if="column.key === 'odds'">
              <div
                v-if="odds[item.id] && curChecked.includes('ah')"
                class="odd-ah"
              >
                <span>{{ fetchOdd(odds[item.id], 'ah', 0) | handleZero }}</span>
                <span>{{ fetchOdd(odds[item.id], 'ah', 2) | handleZero }}</span>
                <span>{{ fetchOdd(odds[item.id], 'ah', 1) | handleZero }}</span>
              </div>
              <div
                v-if="odds[item.id] && curChecked.includes('hda')"
                class="odd-hda"
              >
                <span>{{
                  fetchOdd(odds[item.id], 'hda', 0) | handleZero
                }}</span>
                <span>{{
                  fetchOdd(odds[item.id], 'hda', 2) | handleZero
                }}</span>
                <span>{{
                  fetchOdd(odds[item.id], 'hda', 1) | handleZero
                }}</span>
              </div>
            </template>
            <template v-else-if="column.key === 'more'">
              <NuxtLink
                :to="{
                  name:
                    sportType === 'football'
                      ? 'competition-football-match-id-basic'
                      : 'competition-basketball-match-id-basic',
                  params: {
                    id: item.id,
                  },
                }"
                v-text="'析'"
              />
              <NuxtLink
                :to="{
                  name:
                    sportType === 'football'
                      ? 'competition-football-match-id-odds'
                      : 'competition-basketball-match-id-odds',
                  params: {
                    id: item.id,
                  },
                  query: {
                    tab: 'ah',
                  },
                }"
                v-text="'亚'"
              />
              <NuxtLink
                :to="{
                  name:
                    sportType === 'football'
                      ? 'competition-football-match-id-odds'
                      : 'competition-basketball-match-id-odds',
                  params: {
                    id: item.id,
                  },
                  query: {
                    tab: 'hda',
                  },
                }"
                v-text="'欧'"
              />
              <NuxtLink
                :to="{
                  name:
                    sportType === 'football'
                      ? 'competition-football-match-id-odds'
                      : 'competition-basketball-match-id-odds',
                  params: {
                    id: item.id,
                  },
                  query: {
                    tab: 'ou',
                  },
                }"
                v-text="'大'"
              />
            </template>
            <template v-else>
              {{ item[column.key] }}
            </template>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import dayjs from 'dayjs'

import { footballAhYield } from '@/utils/status'
import VSelect from '@/components/popover-select'

const TABLE_COLUMNS = [
  { title: '时间', key: 'time', width: 60 },
  { title: '主队', key: 'hostTeam', width: 125 },
  { title: '比分', key: 'score', width: 90 },
  { title: '客队', key: 'guestTeam', width: 125 },
  { title: '指数', key: 'odds', width: 230 },
  { title: '更多参考', key: 'more', width: 145 },
]

export default {
  components: {
    VSelect,
  },
  filters: {
    handleZero(value) {
      if (!value) {
        return '-'
      } else {
        return value
      }
    },
  },
  props: {
    list: Array,
    teams: Object,
    odds: Object,
    companyOpt: Array,
    sportType: {
      type: String,
      default: 'football',
    },
  },
  data() {
    return {
      columns: TABLE_COLUMNS,
      tableList: [],
      curChecked: ['hda', 'ah'],
      curSelect: this.sportType === 'football' ? '澳门' : '金宝博',
    }
  },
  mounted() {
    this.tableList = Object.freeze(this.formatList())
  },
  methods: {
    formatList() {
      return (this.list || []).map(item => {
        const hostTeam = this.teams[item.home_team_id]
        const guestTeam = this.teams[item.guest_team_id]
        const odds = this.odds[item.id]

        return {
          id: item.id,
          time: dayjs(Number(item.time)).format('HH:mm'),
          hostTeam: `${hostTeam.name_js || hostTeam.name}`,
          guestTeam: `${guestTeam.name_js || guestTeam.name}`,
          score: [0, 13, 15, 17].includes(Number(item.status))
            ? '-'
            : `${item.home_goal_all ||
                item.home_total ||
                0}-${item.guest_goal_all || item.guest_total || 0}`,
          odds,
        }
      })
    },
    fetchOdd(item, key, index) {
      const itemValue = item[key].find(i => i.company === this.curSelect)
      const value = itemValue ? itemValue.odds[index] : ''
      if (this.sportType === 'football' && key === 'ah' && index === 2) {
        return footballAhYield(Number(value))
      }
      return value ? Number(value).toFixed(2) : '-'
    },
  },
}
</script>

<style lang="scss" scoped>
.competition-table {
  width: 100%;
  font-size: 12px;
  border-bottom: 1px solid #efefef;
  margin-bottom: 12px;
  thead {
    th {
      background-color: #f5f5f5;
      font-weight: normal;
      &.odds-title {
        border-left: 1px solid $color-white;
        border-right: 1px solid $color-white;
        padding: 7px 0;
        line-height: 1;
      }
      .odd-checkbox {
        padding-bottom: 5px;
        padding-left: 50px;
        padding-right: 50px;
        border-bottom: 1px solid $color-white;
        display: flex;
        > label {
          flex: 1;
          cursor: pointer;
          &:hover {
            color: $color-active;
          }
        }
      }
      .odd-company {
        padding-top: 8px;
        display: flex;
        .name {
          flex: 1;
          text-align: right;
          margin-right: 22px;
        }
        .select {
          flex: 1;
          text-align: left;
        }
      }
    }
  }

  tbody {
    text-align: center;
    line-height: 36px;
    tr {
      &:nth-of-type(even) {
        background-color: #f5f5f5;
      }
      &:nth-of-type(odd) {
        background-color: $color-white;
      }
      td {
        border-right: 1px solid #efefef;
        &:last-of-type {
          border-right: none;
        }
        .more-main {
          display: flex;
          justify-content: space-evenly;
        }
        .odds-main {
          padding: 6px 0;
          > div {
            line-height: 18px;
            display: flex;
            > span {
              flex: 1;
            }
          }
        }
        .score-main {
          color: #e1243b;
        }
      }
    }
  }
}
</style>
