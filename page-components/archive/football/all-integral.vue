<template>
  <div v-loading="loading" class="total-integral-wrap">
    <div v-if="!isEmpty" class="tab-wrap">
      <!--   表头   -->
      <div :class="['tab-head', 'tab-background-color']">
        <div
          v-for="item of row_head"
          :key="item"
          :class="[
            'tab-head-row',
            'border-top-none',
            { 'row-width-mini': item === '排名' },
            { 'border-left-none': item === '排名' },
            { 'row-width-large': item === '球队名称' },
            { 'row-width-mid': item === '近六轮赛果' },
          ]"
        >
          {{ item }}
        </div>
      </div>

      <!--   表身   -->
      <div
        v-for="(item, index) of teamList"
        :key="item.team"
        :class="['tab-body']"
      >
        <!--    排名    -->
        <div :class="['tab-body-col', 'row-width-mini', 'border-left-none']">
          {{ index + 1 }}
        </div>

        <!--    球队名称    -->
        <div :class="['tab-body-col', 'row-width-large']">
          <span>{{ item.name.name_j }}</span>
          <span
            v-show="item.name.red_cards !== '0'"
            class="red tab-team-card"
            >{{ item.name.red_cards }}</span
          >
          <span
            v-show="item.name.yellow_cards !== '0'"
            class="yellow tab-team-card"
            >{{ item.name.yellow_cards }}</span
          >
        </div>

        <!--    比赛总次数    -->
        <div :class="['tab-body-col']">{{ item.data[0] }}</div>
        <div :class="['tab-body-col']">{{ item.data[1] }}</div>
        <div :class="['tab-body-col']">{{ item.data[2] }}</div>
        <div :class="['tab-body-col']">{{ item.data[3] }}</div>
        <div :class="['tab-body-col']">{{ item.data[4] }}</div>
        <div :class="['tab-body-col']">{{ item.data[5] }}</div>

        <div :class="['tab-body-col']">{{ item.data[4] - item.data[5] }}</div>

        <!--    积分    -->
        <div :class="['tab-body-col']">{{ item.data[6] }}</div>

        <!--    近六轮赛果    -->
        <div
          v-show="types === '总积分'"
          :class="['tab-body-col', 'row-width-mid']"
        >
          <span
            v-for="(result, resIndex) of item.name.recent_records"
            :key="resIndex"
            :class="[
              'result',
              { defeat: result === 3 },
              { win: result === 1 },
              { tie: result === 2 },
            ]"
            >{{ result | justifyResult }}</span
          >
        </div>
      </div>
    </div>
    <div v-if="isEmpty" class="empty">
      暂无数据
    </div>
  </div>
</template>

<script>
import { CancelToken } from 'axios'

import api from '@/api'

export default {
  filters: {
    justifyResult(value) {
      if (value === 1) {
        return '胜'
      } else if (value === 2) {
        return '平'
      } else if (value === 3) {
        return '负'
      }
    },
  },
  props: {
    types: {
      type: String,
      required: true,
    },
    yearId: {
      type: [Number, String],
    },
    eventId: {
      type: [Number, String],
    },
  },
  data() {
    return {
      isEmpty: true,
      loading: true,
      sourceToken: null,
      tabHead1: [
        '排名',
        '球队名称',
        '赛',
        '胜',
        '平',
        '负',
        '得',
        '失',
        '净',
        '积分',
        '近六轮赛果',
      ],
      tabHead2: [
        '排名',
        '球队名称',
        '赛',
        '胜',
        '平',
        '负',
        '得',
        '失',
        '净',
        '积分',
      ],
      teamList: [],
      receiveData: {
        total: [],
        home: [],
        guest: [],
        team: [],
      },
    }
  },
  computed: {
    row_head() {
      return this.types === '总积分' ? this.tabHead1 : this.tabHead2
    },
  },
  watch: {
    types() {
      this.justifyTypeOfList()
    },

    yearId() {
      this.fetchDataOfIntegral()
    },
  },
  mounted() {
    this.fetchDataOfIntegral()
  },
  methods: {
    // 网路请求
    fetchIntegral(eventId, yearId) {
      this.sourceToken && this.sourceToken.cancel()

      this.sourceToken = CancelToken.source()

      return this.$axios.get(api.get.football.fetchIntegralOfTeam, {
        params: {
          year_id: yearId,
          event_id: eventId,
          need_recent_records: 6,
          need_cards: 1,
        },
        cancelToken: this.sourceToken.token,
      })
    },

    // 处理返回数据
    handleData(arr, obj) {
      arr.forEach(item => {
        item.name = obj[item.team_id]
      })
    },

    // 判断当前积分榜的类型
    justifyTypeOfList() {
      if (this.types === '总积分') {
        this.teamList = this.receiveData.total
      } else if (this.types === '主场积分') {
        this.teamList = this.receiveData.home
      } else if (this.types === '客场积分') {
        this.teamList = this.receiveData.guest
      }
    },

    // 数据绑定
    fetchDataOfIntegral() {
      this.loading = true
      this.isEmpty = false
      this.fetchIntegral(this.eventId, this.yearId)
        .then(({ code, data, msg }) => {
          if (!data) {
            throw new Error(msg)
          }
          this.loading = false
          const { teams, standing } = data

          this.receiveData.team = teams
          this.receiveData.total = standing.total || []
          this.receiveData.home = standing.home || []
          this.receiveData.guest = standing.guest || []

          this.handleData(this.receiveData.total, this.receiveData.team)
          this.handleData(this.receiveData.home, this.receiveData.team)
          this.handleData(this.receiveData.guest, this.receiveData.team)

          this.justifyTypeOfList()
        })
        .catch(() => {
          this.isEmpty = true
          this.loading = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.total-integral-wrap {
  .empty {
    text-align: center;
    line-height: 40px;
  }
  .tab-background-color {
    background-color: #f5f5f5;
  }

  .tab-wrap {
    font-family: $font-family-no-number;
    font-size: $font-size-small;
    color: $font-title-color;
    text-align: center;
    border: 1px #efefef solid;

    .tab-team-card {
      display: inline-block;
      line-height: 16px;
      min-width: 10px;
      text-align: center;
      font-weight: bold;
      color: $color-white;
      border-radius: 2px;
      margin-left: 4px;
    }

    .red {
      background-color: #e1243b;
    }
    .yellow {
      background-color: #ffbe52;
    }

    .border-top-none {
      border-top: none;
    }

    .border-left-none {
      border-left: none;
    }

    .result {
      padding: 0 1px;
    }

    .win {
      color: #e1243b;
    }

    .tie {
      color: $font-title-color;
    }

    .defeat {
      color: #00a54f;
    }
  }

  .tab-head-row,
  .tab-body-col {
    flex: 1;
    height: 45px;
    line-height: 45px;
    border-left: 1px #efefef solid;
    border-top: 1px #efefef solid;
  }

  .tab-head,
  .tab-body {
    display: flex;

    .row-width-mini {
      min-width: 40px;
    }

    .row-width-large {
      min-width: 230px;
    }

    .row-width-mid {
      min-width: 97px;
    }
  }
}
</style>
