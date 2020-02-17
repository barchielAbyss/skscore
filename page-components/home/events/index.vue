<template>
  <div class="home-events">
    <div v-loading="loading" class="box">
      <div class="home-events__types">
        <div class="home-events__types-select">
          <div
            v-for="type of matchTypes"
            :key="type.id"
            :class="[
              'select-option',
              {
                active: curType === type.id,
              },
            ]"
            @click="handleChangeType(type.id)"
          >
            <i :class="['iconfont', `icon-${type.icon}`]" />
            <span v-text="type.label" />
          </div>
        </div>
      </div>

      <Carousel
        v-show="!loading"
        :per-page="pageSize"
        :value="curPage"
        :mouse-drag="false"
        navigation-arrow="always"
        navigation-enabled
        class="home-events__carousel"
        @page-change="onPageChange"
      >
        <CarouselSlide
          v-for="(item, index) in matchList"
          :key="index"
          class="home-events__item-box"
        >
          <EventItem :event-info="item" :event-type="curType" />
        </CarouselSlide>
      </Carousel>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapState } from 'vuex'

import api from '@/api'

import emitter from '@/utils/emitter'

import {
  footballOngoing,
  footballMatchEnd,
  basketballOngoing,
  basketballMatchEnd,
} from '@/utils/status'

import FootballMessage from '@/utils/football-message'
import BasketballMessage from '@/utils/basketball-message'

import Carousel from '@/components/carousel'
import CarouselSlide from '@/components/carousel/slide'
import EventItem from './events-item'

const LIMIT_MATCH_LEN = 20

const MATCH_TYPE = [
  {
    id: 1,
    label: '足球',
    icon: 'football',
    companyIds: [12],
    company: '皇冠',
    api: api.get.football.fetchMatchList,
    ongoing: footballOngoing,
    end: footballMatchEnd,
    underway: [0, 17],
    filter: matchList => {
      return matchList
        .filter(item => ![15].includes(Number(item.status)))
        .filter((_, index) => index < LIMIT_MATCH_LEN)
    },
  },
  {
    id: 2,
    label: '篮球',
    icon: 'basketball',
    companyIds: [7],
    company: '金宝博',
    api: api.get.basketball.fetchMatchList,
    ongoing: basketballOngoing,
    end: basketballMatchEnd,
    underway: [0],
    filter: matchList => {
      return matchList.filter((_, index) => index < LIMIT_MATCH_LEN)
    },
  },
]

export default {
  components: {
    Carousel,
    CarouselSlide,
    EventItem,
  },
  data() {
    return {
      curType: 1,
      pageSize: 4,
      curPage: 0,
      matchList: [],
      loading: false,
      socketMessage: null,
    }
  },
  computed: {
    ...mapState('user', ['serverTime']),
    matchTypes: () => MATCH_TYPE,
    curTypeInfo() {
      return this.matchTypes.find(item => item.id === this.curType)
    },
  },
  watch: {
    curType(value) {
      if (this.socketMessage) {
        this.socketMessage.destroy()
        this.socketMessage = null
      }

      if (Number(value) === 1) {
        this.socketMessage = new FootballMessage()
      } else {
        this.socketMessage = new BasketballMessage()
      }
    },
    serverTime(value) {
      if (value.$H === 10 && value.$m === 2 && value.$s === 1) {
        this.fetchMatchList()
      }
    },
  },
  beforeDestroy() {
    this.offMessage()
    if (this.socketMessage) {
      this.socketMessage.destroy()
      this.socketMessage = null
    }
  },
  mounted() {
    this.fetchMatchList()
    this.onMessage()
    this.socketMessage = new FootballMessage()
  },
  methods: {
    onMessage() {
      emitter.$on('socket-football-status', this.changeFootballStatus)
      emitter.$on('socket-football-gold', this.changeFootballGold)
      emitter.$on('socket-football-ah', this.changeFootballAh)
      emitter.$on('socket-basketball-status', this.changebasketballStatus)
      emitter.$on('socket-basketball-gold', this.changebasketballGold)
      emitter.$on('socket-basketball-ah', this.changebasketballAh)
    },
    offMessage() {
      emitter.$off('socket-football-status', this.changeFootballStatus)
      emitter.$off('socket-football-gold', this.changeFootballGold)
      emitter.$off('socket-football-ah', this.changeFootballAh)
      emitter.$off('socket-basketball-status', this.changebasketballStatus)
      emitter.$off('socket-basketball-gold', this.changebasketballGold)
      emitter.$off('socket-basketball-ah', this.changebasketballAh)
    },
    onMergeScoreList(valueList) {
      valueList.forEach(({ mid, key, value }) => {
        const item = this.matchList.find(
          item => Number(item.id) === Number(mid)
        )
        if (item) {
          item[key] = {
            ...item[key],
            ...value,
          }
        }
      })
    },
    onChangeMatchList({ ids, newValue }) {
      ids.forEach(id => {
        const curItemIndex = this.matchList.findIndex(
          item => Number(id) === Number(item.id)
        )

        if (~curItemIndex) {
          this.$set(this.matchList, curItemIndex, {
            ...this.matchList[curItemIndex],
            ...newValue,
          })
        }
      })
    },
    changeFootballStatus(value) {
      if (Number(value.event) !== 100) {
        return
      }
      const isOngoing = footballOngoing(value.ext.status)
      const isEnd = footballMatchEnd(value.ext.status)
      const isStart = isOngoing || isEnd

      this.onChangeMatchList({
        ids: [value.mid],
        newValue: {
          isStart,
          status: {
            value: value.ext.status,
            time: Number(value.ext.t_start_time),
          },
        },
      })
    },
    changeFootballGold(value) {
      const [homeScore = 0, guestScore = 0] = value.ext.score.split('-')
      this.onChangeMatchList({
        ids: [value.mid],
        newValue: {
          goal: {
            home: Number(homeScore),
            guest: Number(guestScore),
          },
        },
      })
    },
    changeFootballAh(value) {
      const ahList = (value || []).filter(item => {
        return this.curTypeInfo.companyIds.includes(Number(item.company_id))
      })
      if (!ahList || !ahList.length) {
        return
      }
      this.onMergeScoreList(
        value.map(item => {
          const { h, g, l } = item.odd
          return {
            mid: item.mid,
            key: 'ah',
            value: [h, g, l],
          }
        })
      )
    },
    changebasketballStatus(value) {
      const isOngoing = basketballOngoing(value.ext.status)
      const isEnd = basketballMatchEnd(value.ext.status)
      const isStart = isOngoing || isEnd

      this.onChangeMatchList({
        ids: [value.mid],
        newValue: {
          isStart,
          status: {
            value: value.ext.status,
            time: Number(value.ext.t_start_time),
          },
        },
      })
    },
    changebasketballGold(value) {
      const item = value.ext
      this.onChangeMatchList({
        ids: [value.mid],
        newValue: {
          status: {
            value: item.status,
          },
          goal: {
            home: Number(item.home_total),
            guest: Number(item.guest_total),
          },
        },
      })
    },
    changebasketballAh(value) {
      this.onMergeScoreList(
        value.map(item => {
          const { h, g, l } = item.odd

          return {
            mid: item.mid,
            key: 'ah',
            value: [h, g, l],
          }
        })
      )
    },
    onPageChange(page) {
      this.curPage = page
    },
    handleChangeType(id) {
      this.curType = id
      this.fetchMatchList()
    },
    fetchMatchList() {
      this.loading = true

      const {
        api: curApi,
        ongoing,
        end,
        filter,
        company,
        underway,
      } = this.curTypeInfo

      this.$axios
        .get(curApi)
        .then({
          type: 1,
          company,
          find_previous_day_if_empty: true,
        })
        .then(({ code, data }) => {
          if (code !== 0) {
            throw new Error('获取球队信息失败')
          }

          const hotListOngoingList = []
          const ongoingList = []
          const underwayList = []
          const otherList = []
          const endList = []

          data.matchs.forEach(item => {
            if (![15].includes(Number(item.status))) {
              const isOngoing = ongoing(item.status)
              const isEnd = end(item.status)
              const isUnderway = underway.includes(Number(item.status))
              const isStart = isOngoing || isEnd
              const itemData = { ...item, isStart }

              if (isOngoing) {
                if (item.is_hot) {
                  hotListOngoingList.push(itemData)
                } else {
                  ongoingList.push(itemData)
                }
              } else if (isEnd) {
                endList.push(itemData)
              } else if (isUnderway) {
                underwayList.push(itemData)
              } else {
                otherList.push(itemData)
              }
            }
          })

          data.matchs = [
            ...hotListOngoingList,
            ...ongoingList,
            ...underwayList,
            ...otherList,
            ...endList,
          ]

          data.matchs = filter ? filter(data.matchs) : data.matchs

          this.matchList = this.formatData(data)
          // 翻页到当前日期下
          this.$nextTick(() => {
            this.curPage = 0
          })
        })
        .catch(error => {
          console.warn(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    formatData(matchData) {
      const { events, matchs, teams } = matchData

      return matchs.map(item => {
        const eventInfo = events[item.event_id]
        const homeTeam = teams[item.home_team_id]
        const guestTeam = teams[item.guest_team_id]

        return {
          isStart: item.isStart,
          id: item.id,
          event: eventInfo.name.slice(0, 9),
          status: {
            value: item.status,
            time: Number(item.t_start_time || item.time),
          },
          startTime: dayjs(Number(item.time)).format('YYYY/MM/DD HH:mm:ss'),
          homeTeam,
          guestTeam,
          ah: item.ah,
          goal: {
            home: item.home_goal_all || item.home_total || 0,
            guest: item.guest_goal_all || item.guest_total || 0,
          },
        }
      })
    },
  },
}
</script>

<style lang="scss">
.home-events {
  .box {
    display: flex;
    position: relative;
    margin: 12px 0 10px;
  }
  .home-events__types {
    @include card;
    margin-right: 42px;
    padding: 2px 10px 2px;
    width: 50px;
    height: 112px;
    box-sizing: border-box;
    margin-bottom: 3px;
    &-select {
      margin: 0 -12px;
      .select-option {
        padding: 4px 12px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-bottom: 1px solid #f3f4f7;
        font-size: 12px;
        color: #666;
        .iconfont {
          font-size: 18px;
          color: #999;
        }
        &:last-of-type {
          border-bottom: none;
        }
        &.active {
          color: $color-active;
          .iconfont {
            color: $color-active;
          }
        }
      }
    }
  }

  .home-events__carousel {
    margin-right: 36px;
    width: calc(100% - 130px);
    height: 112px;
    .carousel-navigation-button {
      width: 32px;
      height: 112px;
      color: #999;
      background-color: $color-white;
      box-shadow: 0 0 4px 0 rgba(51, 51, 51, 0.05);
      .iconfont {
        font-size: 24px;
      }
    }
    .carousel-navigation-next {
      transform: translateX(36px);
    }
    .carousel-navigation-prev {
      transform: translateX(-36px);
    }
  }
}
</style>
