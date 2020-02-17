<template>
  <CommonList sport-type="basketball">
    <div class="competition-score-basketball">
      <ClientOnly>
        <iframe v-show="false" :src="soundSrc" />
        <SocketMessage
          v-if="socket"
          :filter="filterInfo"
          :on-change-sound="onChangeSound"
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

      <div v-loading="scoreLoading" class="score-basketball-table">
        <ScoreFootballTable />
      </div>
    </div>
  </CommonList>
</template>

<script>
import dayjs from 'dayjs'
import { debounce, throttle } from 'lodash'

import { mapState, mapActions } from 'vuex'

import api from '@/api'
import Message from '@/utils/basketball-message'
import sleepWakeUp from '@/utils/sleep-wake-up'

import Datepicker from '@/components/date-picker'

import CommonList from '@/page-components/competition/components/common-list'
import FixedToolbar from '@/page-components/competition/components/fixed-toolbar'
import DateList from '@/page-components/competition/components/date-list'

import HeaderToolbar from '@/page-components/competition/basketball/header-toolbar'
import ScoreFootballTable from '@/page-components/competition/basketball/score-basketball-table'
import SocketMessage from '@/page-components/competition/basketball/score-socket'

// 2：即时比分 3：完场比分 4：未来赛事
const TYPE_IDS = {
  now: 1,
  past: 3,
  future: 4,
}

const TIME_FORMAT = 'YY/MM/DD'

const DEFAULT_FILTER = (query = {}) => ({
  date: query.date || '',
  events: query.events || [], // 赛事
  company: query.company || '金宝博', // 盘口公司
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
      filterInfo: DEFAULT_FILTER(this.$route.query),
      socket: null,
      soundSrc: '',
      sleepRun: null,
    }
  },
  computed: {
    ...mapState('user', ['isLogin', 'serverTime']),
    ...mapState('competition-basketball', [
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
        this.fetchScoreBasketball()
      }
    },
  },
  mounted() {
    this.sleepRun = sleepWakeUp({
      wakeUp: this.fetchScoreBasketball.bind(this),
    })

    this.setSocketLink()
    this.fetchScoreBasketball()
    this.FetchMatchListState()
  },
  beforeDestroy() {
    clearInterval(this.sleepRun)
    if (this.socket) {
      this.socket.destroy()
      this.socket = null
    }
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

    this.fetchScoreBasketball(timeType)
    this.setSocketLink(timeType)
    next()
  },
  methods: {
    ...mapActions('competition-basketball', [
      'FetchScoreList',
      'FetchMatchListState',
      'SetHiddenList',
      'SetCheckedList',
    ]),
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
    fetchScoreBasketball(itemType) {
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
          category: 2, // 篮球
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
          category: 2, // 篮球
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
.competition-score-basketball {
  .date-select {
    color: #666;
    display: flex;
    align-items: center;
    &-calendar {
      width: 132px;
      line-height: 56px;
      text-align: center;
      &.active {
        color: $color-active;
        background-color: #e5f1ff;
      }
    }
    &-list {
      flex: 1;
    }
  }
}
</style>
