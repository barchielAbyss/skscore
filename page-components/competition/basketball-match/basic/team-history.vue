<template>
  <div class="match-basic-team-history">
    <div class="history-header">
      <div class="history-header__title">近期战绩</div>
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
            matchInfo.eventInfo
              ? matchInfo.eventInfo.name_js || matchInfo.eventInfo.name
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

    <div v-loading="loading" class="home-team-history">
      <div class="team-tilte">
        <img v-lazy="matchInfo.homeInfo.icon" class="team-title-icon" />
        <span class="team-title-name">{{
          matchInfo.homeInfo.name_js || matchInfo.homeInfo.name
        }}</span>
      </div>
      <HistoryTable
        :cur-team="matchInfo.homeInfo"
        :table-data="homeTableData"
        :table-size="historySize"
        class="history-table"
      />
    </div>

    <div v-loading="loading" class="guest-team-history">
      <div class="team-tilte">
        <img v-lazy="matchInfo.guestInfo.icon" class="team-title-icon" />
        <span class="team-title-name">{{
          matchInfo.guestInfo.name_js || matchInfo.guestInfo.name
        }}</span>
      </div>
      <HistoryTable
        :cur-team="matchInfo.guestInfo"
        :table-data="guestTableData"
        :table-size="historySize"
        class="history-table"
      />
    </div>
  </div>
</template>

<script>
import api from '@/api'

import VSelect from '@/components/popover-select'
import { fetchBasketBallTeamIsWin } from '@/utils/status'
import HistoryTable from './history-table'

const FILTER_INFO = vm => {
  const { home_team_id: homeTeamId } = vm.matchInfo
  return {
    category: 2, // 1 足球， 2篮球
    event_id: '',
    team_id: homeTeamId,
    other_team_id: '',
    list_type: 0,
    is_host: 1,
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
      filter: {},
      loading: false,
      homeTableData: null,
      guestTableData: null,
      historyType: [],
      historySize: 6,
    }
  },
  mounted() {
    this.filter = FILTER_INFO(this)
    const { guest_team_id: guestTeamId } = this.matchInfo

    this.fetchTeamMatchRecent({
      guest: {
        team_id: guestTeamId,
      },
      host: {},
    })
  },
  methods: {
    fetchTeamMatchRecent({ guest = {}, host = {} } = {}) {
      this.loading = true

      Promise.all([
        this.fetchFootballMatchRecent(guest),
        this.fetchFootballMatchRecent(host),
      ])
        .then(([guestData, homeData]) => {
          this.homeTableData = Object.freeze(homeData)
          this.guestTableData = Object.freeze(guestData)
        })
        .finally(() => {
          this.loading = false
        })
    },
    fetchFootballMatchRecent(options) {
      const opt = {
        ...this.filter,
        ...options,
      }
      return this.$axios
        .get(api.get.common.fetchTeamRecent, { params: opt })
        .then(({ code, data, msg }) => {
          if (code !== 0) {
            throw new Error(msg)
          }
          const { events, teams, matches } = data
          return matches.map(item => ({
            ...item,
            event: events[item.event_id],
            home: teams[item.home_team_id],
            guest: teams[item.guest_team_id],
            ...fetchBasketBallTeamIsWin(
              item.home_team_id,
              opt.team_id,
              item.result
            ),
          }))
        })
        .catch(() => {
          return []
        })
    },
    handleChangeHistoryType() {
      const { event_id: eventId, guest_team_id: guestTeamId } = this.matchInfo
      const options = {
        guest: {},
        host: {},
      }

      if (this.historyType.length === 2) {
        options.guest.list_type = 4
        options.host.list_type = 3

        options.guest.team_id = guestTeamId
        options.guest.event_id = eventId
        options.host.event_id = eventId
      } else {
        const type = Number(this.historyType.join())
        if (type === 0) {
          options.host = FILTER_INFO(this)
          options.guest = {
            ...options.host,
            team_id: guestTeamId,
          }
        }
        if (type === 1) {
          options.guest.list_type = 4
          options.host.list_type = 3

          options.guest.team_id = guestTeamId
        }
        if (type === 2) {
          options.guest.list_type = 0
          options.host.list_type = 0

          options.guest.team_id = guestTeamId
          options.guest.event_id = eventId
          options.host.event_id = eventId
        }
      }

      this.fetchTeamMatchRecent(options)
    },
  },
}
</script>

<style lang="scss" scoped>
.match-basic-team-history {
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
  .home-team-history {
    margin-bottom: 20px;
    .team-tilte {
      background-color: #e5f1ff;
      color: $color-active;
    }
  }
  .guest-team-history {
    .team-tilte {
      background-color: #fef3ee;
      color: #f95d22;
    }
  }
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
