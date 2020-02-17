<template>
  <div v-loading="loading" class="match-basic-match-history">
    <div class="history-header">
      <div class="history-header__title">对赛往绩</div>
      <div class="history-header__types">
        <label>
          <input
            v-model="historyType"
            type="checkbox"
            value="1"
            class="m-checkbox"
            @change="handleChangeHistoryType"
          />
          主客相同
        </label>
        <label>
          <input
            v-model="historyType"
            type="checkbox"
            value="2"
            class="m-checkbox"
            @change="handleChangeHistoryType"
          />
          {{
            matchInfo.event
              ? matchInfo.event.name_js || matchInfo.event.name
              : ''
          }}
        </label>
      </div>
      <div class="history-header__size">
        近
        <VSelect
          v-model="historySize"
          :options="[{ value: 6 }, { value: 10 }]"
          class="size-select"
        />
        场
      </div>
    </div>

    <HistoryTable
      :table-data="tableData"
      :table-size="historySize"
      :cur-team-id="Number(matchInfo.home_team_id)"
      class="history-table"
    />
  </div>
</template>

<script>
import api from '@/api'

import VSelect from '@/components/popover-select'
import { fetchTeamIsWin } from '@/utils/status'
import HistoryTable from './history-table'

const FILTER_INFO = vm => {
  const { home_team_id: homeTeamId, guest_team_id: guestTeamId } = vm.matchInfo
  return {
    category: 1, // 1 足球， 2篮球
    event_id: '',
    team_id: homeTeamId,
    other_team_id: guestTeamId,
    list_type: 5,
    is_host: 1,
    market_type: 'hot',
    size: 10,
  }
}

export default {
  components: {
    VSelect,
    HistoryTable,
  },
  props: {
    matchInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
      filter: {},
      tableData: null,
      historyType: [],
      historySize: 6,
    }
  },
  mounted() {
    this.filter = FILTER_INFO(this)
    this.fetchFootballMatchRecent()
  },
  methods: {
    fetchFootballMatchRecent() {
      this.loading = true
      this.$axios
        .get(api.get.common.fetchTeamRecent, { params: this.filter })
        .then(({ code, data, msg }) => {
          if (code !== 0) {
            throw new Error(msg)
          }
          const { events, teams, matches } = data
          this.tableData = Object.freeze(
            matches.map(item => ({
              ...item,
              event: events[item.event_id],
              home: teams[item.home_team_id],
              guest: teams[item.guest_team_id],
              ...fetchTeamIsWin(
                item.home_team_id,
                this.matchInfo.home_team_id,
                item.result
              ),
            }))
          )
        })
        .catch(() => {
          this.tableData = []
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleChangeHistoryType() {
      const { event_id: eventId } = this.matchInfo

      if (this.historyType.length === 2) {
        this.filter.list_type = 1
        this.filter.is_host = 1
        this.filter.event_id = eventId
      } else {
        const type = Number(this.historyType.join())
        if (type === 0) {
          this.filter = FILTER_INFO(this)
        }
        if (type === 1) {
          this.filter.list_type = 1
          this.filter.is_host = 1
        }
        if (type === 2) {
          this.filter.list_type = 5
          this.filter.event_id = eventId
        }
      }

      this.fetchFootballMatchRecent()
    },
  },
}
</script>

<style lang="scss" scoped>
.match-basic-match-history {
  .history-header {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    margin-bottom: 12px;
    .history-header__title {
      font-weight: bold;
      width: 7em;
    }
    .history-header__types {
      flex: 1;
      display: flex;
      justify-content: center;
      > label {
        min-width: 7em;
      }
    }
    .history-header__size {
      width: 7em;
      text-align: right;
      .size-select {
        padding: 0 4px;
        border: 1px solid #ccc;
        border-radius: 2px;
      }
    }
  }
}
</style>
