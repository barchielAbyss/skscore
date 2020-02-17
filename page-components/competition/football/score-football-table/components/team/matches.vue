<template>
  <table class="team-matches">
    <thead>
      <tr>
        <th
          v-for="item of rowMap"
          :key="item.id"
          :title="item.label"
          :style="{
            width: `${item.width}px`,
            textAlign: item.align,
          }"
          :class="`team-${item.id}`"
          v-text="item.label"
        />
      </tr>
    </thead>
    <tbody v-if="matches.length">
      <tr v-for="item of matches" :key="item.id">
        <td
          v-for="(row, index) of rowMap"
          :key="row.id"
          :class="[
            `team-${row.id}`,
            { 'border-left': !(index === 2 || index === 3) },
          ]"
          :style="{
            width: `${row.width}px`,
            textAlign: row.align,
          }"
        >
          <template v-if="['event', 'home', 'guest'].includes(row.id)">
            <span
              :class="[
                {
                  'is-select-team': Number(team.id) === Number(item[row.id].id),
                },
                'border-left',
              ]"
              :title="lang === 'zh' ? item[row.id].name : item[row.id].name_e"
            >
              {{ lang === 'zh' ? item[row.id].name : item[row.id].name_e }}
            </span>
          </template>

          <template v-else-if="['ah'].includes(row.id)">
            <span
              class="border-left"
              v-html="fetchAhYield(item.exponential.ah.li)"
            />
          </template>

          <template v-else-if="['result'].includes(row.id)">
            <span
              class="win-type"
              :class="[
                'border-left',
                {
                  win: Number(item[row.id]) === 1,
                  lost: Number(item[row.id]) === 3,
                  draw: Number(item[row.id] === 2),
                },
              ]"
            >
              {{ fetchWinType(item[row.id]) }}
            </span>
          </template>

          <template v-else-if="['exponential'].includes(row.id)">
            <div v-if="item[row.id]" class="team-exponential border-left">
              <p class="yield-item">
                <span class="ah-h">
                  {{ item[row.id].ah.h || item[row.id].ah.hi }}
                </span>
                <span
                  class="ah-l"
                  v-html="
                    fetchAhYield(item[row.id].ah.l) ||
                      fetchAhYield(item[row.id].ah.li)
                  "
                />
                <span class="ah-g">
                  {{ item[row.id].ah.g || item[row.id].ah.gi }}
                </span>
              </p>

              <p class="yield-item">
                <span class="ou-b">
                  {{ item[row.id].ou.b || item[row.id].ou.bi }}
                </span>
                <span class="ou-t">
                  {{
                    fetchOuYield(item[row.id].ou.t) ||
                      fetchOuYield(item[row.id].ou.ti)
                  }}
                </span>
                <span class="ou-s">
                  {{ item[row.id].ou.s || item[row.id].ou.si }}
                </span>
              </p>
            </div>
          </template>

          <template v-else class="border-left">
            <span>
              {{ item[row.id] ? item[row.id] : '-' }}
            </span>
          </template>
        </td>
      </tr>
    </tbody>

    <tbody v-else>
      <tr>
        <td class="empty" colspan="8">暂无数据</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { footballAhYield, footballOuYield } from '@/utils/status'

const ROW_KEYS = [
  { id: 'event', width: 64, label: '赛事' },
  { id: 'date', width: 66, label: '时间' },
  { id: 'home', width: 88, label: '主场', align: 'right' },
  { id: 'goal', width: 48, label: '比分' },
  { id: 'guest', width: 88, label: '客场', align: 'left' },
  { id: 'result', width: 34, label: '胜负' },
  { id: 'ah', width: 64, label: '盘口' },
  { id: 'exponential', width: 150, label: '赔率' },
]

const WIN_TYPES = {
  0: '未知',
  1: '胜',
  2: '平',
  3: '负',
}

export default {
  props: {
    team: Object,
    matches: Array,
    lang: String,
  },
  computed: {
    rowMap: () => ROW_KEYS,
  },
  methods: {
    fetchAhYield(value) {
      const yieldValue = footballAhYield(value)
      return yieldValue === '-' ? '' : yieldValue
    },
    fetchOuYield(value) {
      const yieldValue = footballOuYield(value)
      return yieldValue === '-' ? '' : yieldValue
    },
    fetchWinType(type) {
      return WIN_TYPES[type]
    },
  },
}
</script>

<style lang="scss" scoped>
.team-matches {
  width: 100%;
  color: #666;
  font-size: 12px;
  text-align: center;
  thead {
    background-color: #f9f9f9;
    border: 1px #f9f9f9 solid;
  }
  th {
    font-weight: normal;
    line-height: 32px;
    height: 32px;
  }
  tbody {
    tr {
      &:nth-of-type(even) {
        background-color: #f9f9f9;
      }
      &:nth-of-type(odd) {
        background-color: $color-white;
      }
    }
    td:first-of-type {
      border-left: 1px $color-tab-border solid;
    }

    td.border-left {
      border-right: 1px $color-tab-border solid;
    }

    td {
      height: 40px;
      line-height: 40px;
      &.empty {
        line-height: 60px;
      }
      .is-select-team {
        color: $color-active;
      }
      .team-exponential {
        line-height: 18px;
      }
      .yield-item {
        display: flex;
        > span {
          flex: 1;
        }
      }
      .win-type {
        &.win {
          color: #e1243b;
        }
        &.lost {
          color: #00a54f;
        }
        &.draw {
          color: $color-active;
        }
      }
      &.goal {
        font-weight: bold;
        color: #e1243b;
      }

      &.team-event,
      &.team-home,
      &.team-guest,
      &.team-ah {
        > span {
          display: block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      &.team-home,
      &.team-guest {
        span {
          width: 88px;
        }
      }

      &.team-home {
        padding-left: 7px;
      }

      &.team-event,
      &.team-ah {
        span {
          width: 56px;
          margin: auto;
        }
      }
    }
  }
}
</style>
