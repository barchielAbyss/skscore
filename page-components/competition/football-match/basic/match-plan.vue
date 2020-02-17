<script>
import dayjs from 'dayjs'
import { mapState } from 'vuex'

import api from '@/api'
import { diffTime } from '@/utils/date'

const TABLE_ROW = [
  { key: 'event', title: '赛事', width: 90 },
  { key: 'time', title: '时间', width: 90 },
  { key: 'vs', title: '对阵', width: 192 },
  { key: 'think', title: '分析', width: 54 },
  { key: 'distance', title: '相隔', width: 54 },
]

export default {
  props: {
    matchInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
      homeData: null,
      guestData: null,
    }
  },
  computed: {
    ...mapState('user', ['serverTime']),
  },
  mounted() {
    this.fetchAllTeamPlan()
  },
  methods: {
    fetchAllTeamPlan() {
      this.loading = true
      Promise.all([
        this.fetchTeamPlan({
          team_id: this.matchInfo.home.id,
        }),
        this.fetchTeamPlan({
          team_id: this.matchInfo.guest.id,
        }),
      ])
        .then(([homeData, guestData]) => {
          this.homeData = Object.freeze(homeData)
          this.guestData = Object.freeze(guestData)
        })
        .finally(() => {
          this.loading = false
        })
    },
    fetchDiffDay(Time) {
      const diffDay = diffTime(Time, this.serverTime, 'day')
      if (diffDay === 0) {
        const diffHours = diffTime(Time, this.serverTime, 'hours')
        if (diffHours === 0) {
          const diffMinute = diffTime(Time, this.serverTime, 'minute')
          return `${diffMinute}分`
        } else {
          return `${diffHours}小时`
        }
      } else {
        return `${diffDay}天`
      }
    },
    fetchTeamPlan(options) {
      return this.$axios
        .get(api.get.common.fetchMatchPlan, {
          params: {
            category: 1,
            size: 5,
            ...options,
          },
        })
        .then(({ code, data, msg }) => {
          if (code !== 0) {
            throw new Error(msg)
          }
          const { matches, events, teams } = data
          return matches
            .filter(item => Number(item.id) !== Number(this.matchInfo.id))
            .map(item => {
              const event = events[item.event_id]
              const homeTeam = teams[item.home_team_id]
              const guestTeam = teams[item.guest_team_id]
              const Time = dayjs(Number(item.time))

              return {
                id: item.id,
                event: event.name_js || event.name,
                time: Time.format('YY/MM/DD'),
                vs: { home: homeTeam, guest: guestTeam },
                live: Number(item.animated) === 1,
                distance: this.fetchDiffDay(Time),
              }
            })
        })
        .catch(() => {
          return []
        })
    },
    fetchTeamTable(type) {
      const dataInfo = type === 'home' ? this.homeData : this.guestData
      const teamInfo = this.matchInfo[type]
      const IconSrc = teamInfo.icon
      const Name = teamInfo.name_js || teamInfo.name
      return (
        <div class={['match-plan__main-team', type]}>
          <div class="team-tilte">
            <img v-lazy={IconSrc} class="team-title-icon" />
            <span class="team-title-name">{Name}</span>
          </div>

          <table class="team-table">
            <thead>
              <tr>
                {TABLE_ROW.map(item => (
                  <td style={`width: ${item.width}px`}>{item.title}</td>
                ))}
              </tr>
            </thead>
            {!dataInfo || !dataInfo.length ? (
              <tbody>
                <tr>
                  <td colspan={TABLE_ROW.length}>暂无数据</td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {dataInfo.map(item => (
                  <tr>{this.fetchTableRow(item, type)}</tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      )
    },
    fetchTableRow(item, type) {
      const teamId =
        type === 'home' ? this.matchInfo.home.id : this.matchInfo.guest.id

      return TABLE_ROW.map(row => {
        if (row.key === 'vs') {
          return (
            <td>
              <div class="vs">
                <span
                  class={[
                    Number(teamId) === Number(item.vs.home.id)
                      ? 'is-cur-team'
                      : '',
                    'home-team',
                  ]}>
                  {item.vs.home.name_js || item.vs.home.name}
                </span>
                <span>-</span>
                <span
                  class={[
                    Number(teamId) === Number(item.vs.guest.id)
                      ? 'is-cur-team'
                      : '',
                    'guest-team',
                  ]}>
                  {item.vs.guest.name_js || item.vs.guest.name}
                </span>
              </div>
            </td>
          )
        } else if (row.key === 'live') {
          return item.live ? (
            <td>
              <a
                href={
                  this.$router.resolve({
                    name: 'competition-football-match-id-video',
                    params: {
                      id: item.id,
                    },
                  }).href
                }
                target="_blank">
                <i class="iconfont icon-animation" />
              </a>
            </td>
          ) : (
            <td>-</td>
          )
        } else if (row.key === 'think') {
          return (
            <td>
              <a
                href={
                  this.$router.resolve({
                    name: 'competition-football-match-id-basic',
                    params: {
                      id: item.id,
                    },
                  }).href
                }>
                分析
              </a>
            </td>
          )
        } else {
          return <td>{item[row.key]}</td>
        }
      })
    },
  },
  render() {
    return (
      <div class="match-basic-match-plan">
        <div class="match-plan__title">未来五场</div>

        <div class="match-plan__main">
          {this.fetchTeamTable('home')}
          {this.fetchTeamTable('guest')}
        </div>
      </div>
    )
  },
}
</script>

<style lang="scss" scoped>
.match-basic-match-plan {
  .match-plan__title {
    font-size: 14px;
    color: #1e2647;
    font-weight: bold;
    margin-bottom: 11px;
  }
  .match-plan__main {
    display: flex;
    justify-content: space-between;
    .home {
      .team-tilte {
        background-color: #e5f1ff;
        color: $color-active;
      }
    }
    .guest {
      .team-tilte {
        background-color: #fef3ee;
        color: #f95d22;
      }
    }
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
      line-height: 36px;

      thead {
        tr {
          background-color: #f5f5f5;
        }
      }
      tbody {
        tr {
          &:nth-of-type(even) {
            background-color: #f5f5f5;
          }
          &:nth-of-type(odd) {
            background-color: $color-white;
          }
        }
        td {
          border: 1px solid #efefef;
          .vs {
            display: flex;
            justify-content: center;
          }
          .is-cur-team {
            color: $color-active;
          }
          .home-team {
            text-align: right;
          }
          .guest-team {
            text-align: left;
          }
          .home-team,
          .guest-team {
            flex: 1;
            display: inline-block;
            vertical-align: middle;
            max-width: 6em;
            white-space: nowrap;
            overflow: hidden;
          }
          &:first-of-type,
          &:last-of-type {
            border-left: none;
            border-right: none;
          }
        }
      }
    }
  }
}
</style>
