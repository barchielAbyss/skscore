<template>
  <ElPopover
    v-model="isVisible"
    :open-delay="500"
    :placement="keyId === 'home' ? 'bottom-end' : 'bottom-start'"
    :visible-arrow="false"
    trigger="hover"
    width="665"
    :popper-options="{
      boundariesElement: 'body',
      removeOnDestroy: true,
    }"
    :popper-class="className"
    @show="handleShowTeamInfo"
  >
    <TeamCount
      slot="reference"
      :row="row"
      :key-id="keyId"
      :is-visible="isVisible"
    />
    <TeamPopover
      ref="popover"
      :row="row"
      :key-id="keyId"
      :cur-team="curTeam"
      :recent-opt="recentOpt"
      :fetch-team-info="fetchTeamInfo"
      :fetch-recent-info="fetchRecentInfo"
    />
  </ElPopover>
</template>

<script>
import dayjs from 'dayjs'
import api from '@/api'
import { exponentialArray2Object } from '@/utils/getOdds2Object'
import { fetchTeamIsWin } from '@/utils/status'
import TeamCount from './content'
import TeamPopover from './popover'

export default {
  components: {
    TeamCount,
    TeamPopover,
  },
  props: {
    row: Object,
    keyId: String,
  },
  data() {
    return {
      dataInfo: null,
      recentOpt: {},
      className: '',
      isVisible: false,
    }
  },
  computed: {
    curTeam() {
      return this.keyId === 'home' ? this.row.home : this.row.guest
    },
  },
  mounted() {
    // 只适配宽屏（1920、1680）的分辨率，确定弹框与队名对齐
    if ([1920, 1680].includes(window.innerWidth)) {
      const teamType =
        this.keyId === 'home'
          ? 'components-popover-score home-offset-'
          : 'components-popover-score guest-offset-'
      this.className = teamType + window.innerWidth
    }
  },
  methods: {
    handleShowTeamInfo() {
      this.$refs.popover.handleMatchTeamInfo()
    },
    fetchTeamInfo(recentOpt) {
      this.recentOpt = recentOpt
      if (this.dataInfo) {
        return Promise.resolve(this.formatTeamDataInfo(this.dataInfo))
      }

      return Promise.all([
        this.$axios.get(api.get.common.fetchTeamRecent, {
          params: {
            ...recentOpt,
            size: 10,
          },
        }),
        this.$axios.get(api.get.common.fetchTeamRecentSummary, {
          params: {
            ...recentOpt,
            event_id: this.row.event.id,
            size: 10,
          },
        }),
      ])
        .then(([recent, summary]) => {
          if (recent.code !== 0 && summary.code !== 0) {
            throw new Error(recent.msg || '获取球队信息失败')
          }

          this.dataInfo = {
            recent: recent.data,
            summary: summary.data,
          }

          return this.formatTeamDataInfo(
            Object.freeze({
              recent: recent.data,
              summary: summary.data,
            })
          )
        })
        .catch(error => {
          this.dataInfo = {}
          console.warn(error)
        })
    },
    fetchRecentInfo(recentOpt) {
      this.recentOpt = recentOpt

      return this.$axios
        .get(api.get.common.fetchTeamRecent, {
          params: {
            ...recentOpt,
            size: 10,
          },
        })
        .then(({ code, data, msg }) => {
          if (code !== 0) {
            throw new Error(msg)
          }

          this.dataInfo.recent = data
          return this.formatMatch(data)
        })
        .catch(error => {
          console.warn(error)
        })
    },
    formatTeamDataInfo(value) {
      if (!value || !value.recent || !value.summary) {
        return {}
      }
      const { recent, summary } = value

      const matches = this.formatMatch(recent)
      const ratio = this.formatRatio(summary)

      return {
        matches,
        ratio,
      }
    },
    formatMatch(recent) {
      if (!recent) {
        return []
      }
      return recent.matches
        .filter((_, index) => {
          return index < this.recentOpt.size
        })
        .map(item => {
          const {
            id,
            home_goal_all: homeGoalAll,
            guest_goal_all: guestGoalAll,
            result,
            home_team_id: homeTeamId,
            guest_team_id: guestTeamId,
            event_id: eventId,
            ah,
            ou,
          } = item
          const itemEvent = recent.events[eventId] || {}
          const homeTeam = recent.teams[homeTeamId] || {}
          const guestTeam = recent.teams[guestTeamId] || {}

          return {
            ...fetchTeamIsWin(homeTeamId, this.curTeam.id, result),
            id,
            goal: `${homeGoalAll}-${guestGoalAll}`,
            exponential: exponentialArray2Object({
              ah,
              ou,
            }),
            event: itemEvent,
            home: homeTeam,
            guest: guestTeam,
            date: dayjs(Number(item.time)).format('YY/MM/DD'),
          }
        })
    },
    formatRatio(summary) {
      if (!summary) {
        return {}
      }
      const {
        same_event: sameEvent,
        same_event_and_home_team: sameHome,
      } = summary

      const filterSameEvent = sameEvent.filter((_, index) => {
        return index < this.recentOpt.size
      })

      const filterSameHome = sameHome.filter((_, index) => {
        return index < this.recentOpt.size
      })

      const eventLen = filterSameEvent.length
      const homeLen = filterSameHome.length

      return {
        event: {
          results: this.fetchResults(filterSameEvent),
          winPlate: this.fetchPercent(
            this.fetchWinPlate(filterSameEvent),
            eventLen
          ),
          bigPlate: this.fetchPercent(
            this.fetchBigPlate(filterSameEvent),
            eventLen
          ),
          singular: this.fetchPercent(
            this.fetchSingularScore(filterSameEvent),
            eventLen
          ),
        },
        home: {
          results: this.fetchResults(filterSameHome),
          winPlate: this.fetchPercent(
            this.fetchWinPlate(filterSameHome),
            homeLen
          ),
          bigPlate: this.fetchPercent(
            this.fetchBigPlate(filterSameHome),
            homeLen
          ),
          singular: this.fetchPercent(
            this.fetchSingularScore(filterSameHome),
            homeLen
          ),
        },
      }
    },
    fetchPercent(value, total) {
      if (value === '-') {
        return value
      }
      if (!value || !total) {
        return '0%'
      }
      return `${Math.ceil((value / total) * 100)}%`
    },
    fetchResults(list) {
      const realList = list.map(item => ({
        ...item,
        ...fetchTeamIsWin(item.home_team_id, this.curTeam.id, item.result),
      }))

      const res = {
        win: realList.filter(item => item.result === 1).length,
        lost: realList.filter(item => item.result === 3).length,
        draw: realList.filter(item => item.result === 2).length,
      }

      return {
        ...res,
        winRadio: this.fetchPercent(res.win, list.length),
      }
    },
    fetchWinPlate(list) {
      if (!list.every(item => item.ah && item.ah.every(ah => ah !== ''))) {
        return '-'
      }
      return list.filter(item => {
        const {
          ah,
          guest_goal_all: guestGoalAll,
          home_goal_all: homeGoalAll,
        } = item
        const ahYield = Number(ah[2] || ah[5])

        return Number(homeGoalAll) - Number(guestGoalAll) - ahYield > 0
      }).length
    },
    fetchBigPlate(list) {
      if (!list.every(item => item.ou && item.ou.every(ou => ou !== ''))) {
        return '-'
      }
      return list.filter(item => {
        const {
          ou,
          guest_goal_all: guestGoalAll,
          home_goal_all: homeGoalAll,
        } = item
        const ouYield = Number(ou[2] || ou[5])

        return Number(homeGoalAll) + Number(guestGoalAll) - ouYield > 0
      }).length
    },
    fetchSingularScore(list) {
      return list.filter(item => {
        const {
          guest_goal_all: guestGoalAll,
          home_goal_all: homeGoalAll,
        } = item
        return (Number(homeGoalAll) + Number(guestGoalAll)) % 2
      }).length
    },
  },
}
</script>
