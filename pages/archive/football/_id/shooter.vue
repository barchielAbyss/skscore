<template>
  <div class="shooter-wrap">
    <div v-if="!isEmpty" v-loading="loading">
      <div class="shoot-tab-wrap">
        <div :class="['tab-row-default', 'tab-row-thead']">
          <div
            v-for="(item, index) of tabHead"
            :key="item"
            :class="[
              'tab-col',
              'none-border-top',
              { 'none-border-left': index === 0 },
            ]"
          >
            {{ item }}
          </div>
        </div>

        <div
          v-for="item of list"
          :key="item.player_id"
          :class="['tab-row-default', 'tab-row-tbody']"
        >
          <div :class="['tab-col', 'none-border-left']">
            {{ item.rank }}
          </div>
          <div :class="['tab-col']">{{ players[item.player_id].name_j }}</div>
          <div :class="['tab-col']">{{ teams[item.team_id].name_j }}</div>
          <div :class="['tab-col']">{{ item | formatScore }}</div>
        </div>
      </div>
    </div>

    <div v-if="isEmpty" class="empty">
      暂无数据
    </div>

    <div class="remind-bottom" />
  </div>
</template>

<script>
import { CancelToken } from 'axios'

import api from '@/api'

export default {
  filters: {
    formatScore(value) {
      return value.goal + '（' + value.penalty + '）'
    },
  },
  props: {
    yearId: {
      type: [Number, String],
    },
    eventId: {
      type: [Number, String],
    },
  },
  data() {
    return {
      tabHead: ['排名', '球员', '效力球队', '总进球（点球）'],
      list: [],
      isEmpty: false,
      loading: true,
      players: [],
      teams: [],
      sourceToken: null,
    }
  },
  watch: {
    yearId: {
      immediate: true,
      handler: function(value) {
        this.fetchShooter(value)
      },
    },
  },
  methods: {
    fetchShooter(seasonId) {
      if (!this.yearId) {
        return
      }

      this.loading = true
      this.sourceToken && this.sourceToken.cancel()
      this.sourceToken = CancelToken.source()
      this.$axios
        .get(api.get.football.fetchShootOfSeason, {
          params: { season_id: seasonId },
          cancelToken: this.sourceToken.token,
        })
        .then(({ code, data }) => {
          if (!data || code !== 0) {
            throw new Error('暂无数据-射手榜')
          }
          this.teams = data.teams
          this.players = data.players
          this.list = data.list
          this.isEmpty = false
        })
        .catch(error => {
          this.isEmpty = true
          console.warn(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.shooter-wrap {
  padding: 14px;

  .remind-bottom {
    height: 38px;
    margin-top: 11px;
  }

  .empty {
    text-align: center;
    line-height: 40px;
  }

  .title {
    border-radius: 4px;
    background-color: #f5f5f5;
    height: 45px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .shoot-tab-wrap {
    border: 1px solid #efefef;
    text-align: center;
    font-family: $font-family-no-number;
    font-size: $font-size-small;
    color: $font-title-color;

    .tab-row-default {
      .tab-col:nth-child(1) {
        min-width: 40px;
      }

      .tab-col:nth-child(n + 2) {
        flex: 1;
      }

      .tab-col {
        height: 36px;
        line-height: 36px;
        border-top: 1px solid #efefef;
        border-left: 1px solid #efefef;
      }

      div.none-border-top {
        border-top: none;
      }

      div.none-border-left {
        border-left: none;
      }

      display: flex;
    }

    .tab-row-thead,
    .tab-row-tbody:nth-child(odd) {
      background-color: #f5f5f5;
    }
  }
}
</style>
