<template>
  <CommonList sport-type="football">
    <div class="competition-score-football">
      <ClientOnly>
        <iframe v-show="false" :src="soundSrc" />
        <SocketMessage
          v-if="socket"
          :on-change-sound="onChangeSound"
          :filter="filterInfo"
        />
        <HeaderToolbar
          :filter.sync="filterInfo"
          :hidden-event-len="hiddenList.length"
          :on-change-sound="onChangeSound"
          :on-update-router="handleUpdateRouter"
          :on-show-all="handleToolShowAll"
        />
        <FixedToolbar
          :on-show="handleToolShow"
          :on-hide="handleToolHide"
          :on-show-all="handleToolShowAll"
        />

        <div v-if="['past', 'future'].includes(timeType)" class="date-select">
          <Datepicker
            v-model="filterInfo.date"
            :class="[
              'date-select-calendar',
              {
                active: isActiveCalendar,
              },
            ]"
            :disable-date="setDayDisabled"
            @change="handleUpdateRouter"
          />
          <DateList
            v-model="filterInfo.date"
            class="date-select-list"
            :date-type="timeType"
            @change="handleUpdateRouter"
          />
        </div>
      </ClientOnly>

      <div
        v-loading="scoreLoading"
        :class="[
          'score-football-table',
          { 'score-table-head-fixed': tabHeadFixed },
        ]"
      >
        <ScoreFootballTable :table-columns="tableColumns" />
      </div>
    </div>
  </CommonList>
</template>

<script>
import dayjs from 'dayjs'
import { debounce, throttle } from 'lodash'
import { mapState, mapActions } from 'vuex'
import api from '@/api'

import Message from '@/utils/football-message'
import sleepWakeUp from '@/utils/sleep-wake-up'

import Datepicker from '@/components/date-picker'
import CommonList from '@/page-components/competition/components/common-list'
import FixedToolbar from '@/page-components/competition/components/fixed-toolbar'
import DateList from '@/page-components/competition/components/date-list'
import HeaderToolbar from '@/page-components/competition/football/header-toolbar'
import ScoreFootballTable from '@/page-components/competition/football/score-football-table'
import SocketMessage from '@/page-components/competition/football/score-socket'

// 2：即时比分 3：完场比分 4：未来赛事
const TYPE_IDS = {
  now: 1,
  past: 3,
  future: 4,
}

const TIME_FORMAT = 'YY/MM/DD'

const TABLE_COLUMNS = {
  checked: {
    name: '筛选',
    width: 37,
  },
  event: {
    name: '联赛',
    width: 75,
  },
  time: {
    name: '时间/直播',
    width: 76,
  },
  status: {
    name: '状态',
    width: 52,
  },
  home: {
    name: '主场',
    width: 277,
  },
  score: {
    name: '比分',
    width: 66,
  },
  guest: {
    name: '客场',
    width: 277,
  },
  corner: {
    name: '角/半',
    width: 62,
  },
  exponential: {
    name: '指数',
    width: 224,
  },
  dataCenter: {
    name: '数据中心',
    width: 60,
  },
  pinned: {
    name: '功能',
    width: 72,
  },
}

const DEFAULT_FILTER = (query = {}) => ({
  date: query.date || '',
  events: query.events || [], // 赛事
  company: query.company || '皇冠', // 盘口公司
})

export default {
  components: {
    CommonList,
    HeaderToolbar,
    ScoreFootballTable,
    FixedToolbar,
    Datepicker,
    DateList,
    SocketMessage,
  },
  data() {
    return {
      tabHeadFixed: false,
      filterInfo: DEFAULT_FILTER(this.$route.query),
      socket: null,
      soundSrc: '',
      resetTimeout: null,
    }
  },
  computed: {
    ...mapState('user', ['isLogin', 'serverTime']),
    ...mapState('competition-football', [
      'scoreList',
      'hiddenList',
      'pinnedList',
      'scoreLoading',
      'setting',
      'checkedList',
    ]),
    timeType() {
      return this.$route.query.timeType || 'now'
    },
    tableColumns() {
      return TABLE_COLUMNS
    },
    isActiveCalendar() {
      const curDate = dayjs(this.filterInfo.date || new Date()).format(
        TIME_FORMAT
      )
      const pastDate = dayjs()
        .add(-7, 'day')
        .format(TIME_FORMAT)
      const futureDate = dayjs()
        .add(7, 'day')
        .format(TIME_FORMAT)

      return (
        (this.timeType === 'past' && curDate < pastDate) ||
        (this.timeType === 'future' && curDate > futureDate)
      )
    },
  },
  watch: {
    'hiddenList.length'() {
      this.setBlackList()
    },
    'pinnedList.length'() {
      this.setMatchTop()
    },
    serverTime(value) {
      if (
        this.timeType === 'now' &&
        value.$H === 10 &&
        value.$m === 2 &&
        value.$s === 1
      ) {
        this.fetchScoreFootball()
      }
    },
  },
  mounted() {
    this.sleepRun = sleepWakeUp({
      wakeUp: this.fetchScoreFootball.bind(this),
    })

    this.setSocketLink()
    this.fetchScoreFootball()
    this.FetchMatchListState()
    document.addEventListener('scroll', this.listenTop)
    this.tabHeadFixed = window.scrollY > 48
  },
  beforeDestroy() {
    clearInterval(this.sleepRun)
    document.removeEventListener('scroll', this.listenTop)
  },
  beforeRouteUpdate(to, from, next) {
    const {
      query: { timeType = 'now' },
    } = to

    const {
      query: { timeType: oldTimeType = 'now' },
    } = from

    if (timeType !== oldTimeType) {
      this.filterInfo = DEFAULT_FILTER()
      this.SetCheckedList([])
      this.SetHiddenList([])
    }

    this.fetchScoreFootball(timeType)
    this.setSocketLink(timeType)

    next()
  },
  methods: {
    ...mapActions('competition-football', [
      'FetchScoreList',
      'FetchMatchListState',
      'SetHiddenList',
      'SetCheckedList',
    ]),
    listenTop() {
      if (window.scrollY > 48) {
        this.tabHeadFixed = true
      } else {
        this.tabHeadFixed = false
      }
    },
    handleUpdateRouter() {
      this.$nextTick(() => {
        this.$router.replace({
          query: {
            ...this.$route.query,
            ...this.filterInfo,
          },
        })
      })
    },
    onError: throttle(function(error) {
      this.$message({
        message: error,
        type: 'error',
      })
    }, 3000),
    onClearChecked() {
      this.SetCheckedList([])
    },
    fetchScoreFootball(itemType) {
      itemType = itemType || this.timeType
      this.FetchScoreList({
        ...this.filterInfo,
        type: TYPE_IDS[itemType],
      })
    },
    setDayDisabled(date, disableDate) {
      if (this.timeType === 'past') {
        return disableDate
          ? date.endOf(disableDate) > dayjs(new Date()).startOf(disableDate)
          : date > dayjs(new Date())
      }
      if (this.timeType === 'future') {
        return disableDate
          ? date.endOf(disableDate) < dayjs(new Date()).startOf(disableDate)
          : date.add(1, 'day') < dayjs(new Date())
      }
    },
    setSocketLink(itemType) {
      itemType = itemType || this.timeType

      if (itemType === 'now') {
        if (!this.socket) {
          this.socket = new Message()
        }
      } else if (this.socket) {
        this.socket.destroy()
        this.socket = null
      }
    },
    handleToolShow() {
      if (!this.checkedList.length) {
        this.onError('请先选择比赛')
        return
      }

      this.SetHiddenList([
        ...this.hiddenList,
        ...this.scoreList
          .filter(item => !this.checkedList.includes(item.id))
          .map(item => item.id),
      ])
      this.onClearChecked()
    },
    handleToolHide() {
      if (!this.checkedList.length) {
        this.onError('请先选择比赛')
        return
      }

      this.SetHiddenList([...this.hiddenList, ...this.checkedList])
      this.onClearChecked()
    },
    handleToolShowAll() {
      this.SetHiddenList([])
    },
    setBlackList() {
      if (!this.isLogin) {
        return
      }
      this.$axios
        .post(api.post.common.setBlackList, {
          blacklist: this.hiddenList,
          category: 1, // 足球
        })
        .then(({ code, msg }) => {
          if (code !== 0) {
            throw new Error(msg + ' => 保存黑名单失败')
          }
        })
        .catch(error => {
          console.warn(error)
        })
    },
    setMatchTop: debounce(function() {
      if (!this.isLogin) {
        return
      }
      this.$axios
        .post(api.post.common.setMatchTop, {
          ids: this.pinnedList,
          category: 1, // 足球
        })
        .then(({ code, msg }) => {
          if (code !== 0) {
            throw new Error(msg + ' => 设置置顶失败')
          }
        })
        .catch(error => {
          console.warn(error)
        })
    }, 1500),
    onChangeSound(src) {
      this.soundSrc = ''
      this.$nextTick(() => {
        this.soundSrc = src
      })
    },
  },
}
</script>

<style lang="scss">
.competition-score-football {
  .date-select-calendar {
    border-radius: 4px 0 0 4px;
  }

  .date-select {
    padding-top: 12px;
    color: #666;
    display: flex;
    align-items: center;
    &-calendar {
      width: 132px;
      line-height: 56px;
      text-align: center;
      background-color: $color-white;
      &.active {
        color: $color-active;
        background-color: $color-active-light;
      }
    }
    &-list {
      flex: 1;
    }
  }

  .score-football-table {
    .table-item {
      box-sizing: border-box;
      .title {
        line-height: 20px;
        white-space: nowrap;
        overflow: hidden;
        &:hover {
          color: $color-active;
        }
      }
      img {
        max-width: 20px;
        max-height: 20px;
        vertical-align: middle;
      }
    }

    &.score-table-head-fixed .score-football-table__header {
      border-top-right-radius: 0;
      border-top-left-radius: 0;
      position: fixed;
      left: 0;
      top: 95px;
      z-index: 55;
      width: 100%;
      border-right: none;
      border-left: none;
      justify-content: center;
    }

    .score-football-table__header {
      height: 36px;
      .table-item {
        line-height: 36px;
      }
      .score,
      .home {
        border: none;
      }
      .home {
        text-align: right;
        padding-right: 32px;
      }
      .guest {
        text-align: left;
        padding-left: 32px;
      }
    }
    .score-football-table__list {
      .table-item {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .status {
        font-weight: bold;
      }
      .event {
        .title {
          text-overflow: ellipsis;
        }
      }
      .time {
        justify-content: flex-start;
        padding-left: 15px;
      }

      .home,
      .guest {
        font-size: $font-size-small;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .team-main {
          display: flex;
          align-items: center;
        }
        .team-rank {
          color: #999;
        }
        .title {
          max-width: 15em;
          margin-left: 6px;
          margin-right: 4px;
          text-overflow: ellipsis;
        }
      }
      .home {
        text-align: right;
        border: none;
      }
      .guest {
        text-align: left;
        flex-direction: row-reverse;
        .team-main {
          flex-direction: row-reverse;
        }
      }
      .exponential {
        display: block;
        margin: auto;
      }
      .dataCenter {
        a {
          font-size: 12px;
          padding: 0 2px;
          transition: color 0.3s;
          &:hover {
            color: $color-active;
          }
        }
      }
      .pinned {
        .iconfont {
          display: block;
          color: #d8d8d8;
          cursor: pointer;
          transition: color 0.3s ease-in-out;
        }
        &:hover {
          .iconfont {
            color: $color-active;
          }
        }
        &.active {
          .iconfont {
            transform: rotate(180deg);
            color: $color-active;
          }
        }
      }
    }
  }
}
</style>
