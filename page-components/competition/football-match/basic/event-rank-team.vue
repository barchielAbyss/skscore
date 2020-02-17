<template>
  <div class="event-rank-team">
    <div class="team-tilte">
      <img v-lazy="teamInfo.icon" class="team-title-icon" />
      <span class="team-title-name">{{ teamNameTitle }}</span>
    </div>
    <table class="team-table">
      <thead>
        <tr>
          <td v-for="(row, key) of rows" :key="key" v-text="row" />
        </tr>
      </thead>
      <tbody>
        <template v-if="teamInfo.isEmpty">
          <tr>
            <td class="is-empty" colspan="8" v-text="'暂无数据'" />
          </tr>
        </template>
        <template v-else>
          <tr v-for="(item, index) of tableData" :key="index">
            <td v-for="(row, key) of rows" :key="key" v-text="item[key]" />
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
const TABLE_ROWS = {
  time: '全场',
  event: '赛',
  results: '胜/平/负',
  goal: '得/失',
  winGoal: '净',
  score: '得分',
  rank: '排名',
  odds: '胜率',
}

const TIME_LIST = [
  { title: '总', key: 'Total' },
  { title: '主', key: 'Home' },
  { title: '客', key: 'Away' },
  { title: '近6场', key: 'Last6Game' },
]

export default {
  props: {
    teamInfo: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    teamNameTitle() {
      const {
        event_name: eventName,
        name_js: nameJs,
        name,
        rank,
      } = this.teamInfo
      return `[${eventName}${rank}] ${nameJs || name}`
    },
    rows: () => TABLE_ROWS,
    tableData() {
      return this.fetchTableData()
    },
  },
  methods: {
    fetchTableData() {
      return TIME_LIST.map(time => {
        const item = {
          time: time.title,
        }
        Object.keys(TABLE_ROWS).forEach(rowKey => {
          if (['time'].includes(rowKey)) {
            return
          }
          item[rowKey] = this.fetchRow(time.key, rowKey)
        })

        return item
      })
    },
    fetchRow(type, rowKey) {
      const dataInfo = this.teamInfo[type]
      if (!dataInfo) {
        return ''
      }
      switch (rowKey) {
        case 'event':
          return Number(dataInfo[0]) || '-'
        case 'results':
          return `${dataInfo[1]}/${dataInfo[2]}/${dataInfo[3]}`
        case 'goal':
          return `${dataInfo[4]}/${dataInfo[5]}`
        case 'winGoal':
          return Number(dataInfo[6]) || '-'
        case 'score':
          return Number(dataInfo[7]) || '-'
        case 'rank':
          return Number(dataInfo[8]) || '-'
        case 'odds':
          return dataInfo[9] || '-'
        default:
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.event-rank-team {
  .team-tilte {
    padding-left: 14px;
    line-height: 36px;
    .team-title-icon {
      max-width: 20px;
      max-height: 20px;
      vertical-align: text-bottom;
      padding-right: 5px;
    }
    .team-title-name {
      font-weight: bold;
      font-size: 14px;
    }
  }
  .team-table {
    text-align: center;
    width: 100%;
    thead {
      tr {
        background-color: #f5f5f5;
        line-height: 45px;
      }
    }
    tbody {
      tr {
        line-height: 36px;
        &:nth-of-type(odd) {
          background-color: $color-white;
        }
        &:nth-of-type(even) {
          background-color: #f5f5f5;
        }
      }
      td {
        border-right: 1px solid #efefef;
        &:last-of-type {
          border-right: none;
        }
        &.is-empty {
          border-bottom: 1px solid #efefef;
          border-left: 1px solid #efefef;
          border-right: 1px solid #efefef;
        }
      }
    }
  }
}
</style>
