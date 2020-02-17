<template>
  <div class="intelligence-page">
    <div class="team-container">
      <TeamIntelligence :msg="homeTeam" />
      <TeamIntelligence :msg="guestTeam" />
    </div>

    <div class="bottom-part">
      <div class="same-odds">
        <div class="title-part">
          <div class="title">相同赔率</div>

          <div class="btn-group">
            <button
              :class="['btn', active === 2 ? 'btn-active' : 'btn-default']"
              @click="chooseType(2)"
            >
              亚指
            </button>
            <button
              :class="['btn', active === 1 ? 'btn-active' : 'btn-default']"
              @click="chooseType(1)"
            >
              欧指
            </button>
          </div>
        </div>

        <div class="tab-part">
          <TeamTab :msg="homeTeam" :active="active" :list="receiveHome" />
          <TeamTab :msg="guestTeam" :active="active" :list="receiveGuest" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import TeamTab from '@/page-components/competition/football-match/news/team-tab'
import TeamIntelligence from '@/page-components/competition/football-match/news/team-intelligence'
import api from '@/api'

export default {
  components: { TeamIntelligence, TeamTab },
  props: {
    matchId: {
      type: [String, Number],
      required: true,
    },
    matchInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      title1: '欧指情报',
      title2: '亚指情报',
      active: 2,
      homeTeam: {},
      guestTeam: {},
      receiveHome: [],
      receiveGuest: [],
    }
  },
  watch: {
    matchId: {
      immediate: true,
      handler: function(val) {
        this.homeTeam.raceId = val
        this.guestTeam.raceId = val
      },
    },
    matchInfo: {
      immediate: true,
      handler: function(val) {
        this.homeTeam.name = val.home.name
        this.homeTeam.icon = val.home.icon
        this.homeTeam.id = val.home.id
        this.homeTeam.type = 1

        this.guestTeam.name = val.guest.name
        this.guestTeam.icon = val.guest.icon
        this.guestTeam.id = val.guest.id
        this.guestTeam.type = 0
      },
    },
  },
  created() {
    this.initTeamMsgArr()
  },
  mounted() {
    this.fetchOdds(2)
    this.fetchMsgOfTeam(this.matchId)
  },
  methods: {
    // 初始化情报种类对象
    initTeamMsgArr() {
      this.homeTeam.arrGood = { type: 1, mockData: [] }
      this.homeTeam.arrWorst = { type: 3, mockData: [] }
      this.homeTeam.arrNormal = { type: 2, mockData: [] }

      this.guestTeam.arrGood = { type: 1, mockData: [] }
      this.guestTeam.arrWorst = { type: 3, mockData: [] }
      this.guestTeam.arrNormal = { type: 2, mockData: [] }
    },

    // 切换状态
    chooseType(type) {
      this.active = type
      this.fetchOdds(type)
    },

    // 获取主客队的情报
    fetchMsgOfTeam(id) {
      this.$axios
        .get(api.get.football.fetchIntelligenceOfTeam, {
          params: {
            match_id: id,
          },
        })
        .then(res => {
          if (!res.data) {
            throw new Error('暂无数据-球队情报')
          } else {
            res.data.home.map(item => {
              if (Number(item.upDown) === 0) {
                this.homeTeam.arrGood.mockData.push(item.title)
              } else if (Number(item.upDown) === 1) {
                this.homeTeam.arrWorst.mockData.push(item.title)
              } else if (Number(item.upDown) === 2) {
                this.homeTeam.arrNormal.mockData.push(item.title)
              }
            })

            res.data.guest.map(item => {
              if (Number(item.upDown) === 0) {
                this.guestTeam.arrGood.mockData.push(item.title)
              } else if (Number(item.upDown) === 1) {
                this.guestTeam.arrWorst.mockData.push(item.title)
              } else if (Number(item.upDown) === 2) {
                this.guestTeam.arrNormal.mockData.push(item.title)
              }
            })
          }
        })
        .catch(err => {
          console.warn(err)
        })
    },

    // 历史同赔
    fetchOdds(type) {
      this.$axios
        .get(api.get.football.fetchSameOdds, {
          params: {
            match_id: this.matchId,
            category: 1,
            type,
          },
        })
        .then(({ code, data }) => {
          if (!data || code !== 0) {
            throw new Error('暂无数据-相同赔率')
          }

          const { home, guest, teams, events, matches } = data
          this.receiveHome = this.formatData(home, teams, events, matches)
          this.receiveGuest = this.formatData(guest, teams, events, matches)
        })
        .catch(error => {
          console.warn(error)
          this.receiveHome = []
          this.receiveGuest = []
        })
    },

    // 格式化返回数据
    formatData(target, teams, events, matches) {
      return target.map(item => {
        const timeObj = dayjs(Number(matches[item.match_id].time))
        item.eventName = events[item.event_id].name_j
        item.homeName = teams[item.home_team_id].name_j
        item.guestName = teams[item.guest_team_id].name_j
        item.eventTime = timeObj.format('YY/MM/DD')
        item.teamScore =
          matches[item.match_id].home_goal_all +
          '-' +
          matches[item.match_id].guest_goal_all
        item.raceResult = matches[item.match_id].result
        return item
      })
    },
  },
}
</script>

<style lang="scss" scoped>
$nav-color-red: #e1243b !default;
$nav-color-green: #00a54f !default;
$nav-color-gray: #aab4bd !default;

$tab-background-1: #fef3ee !default;
$tab-background-2: #f3f4f7 !default;
$tab-background-3: rgba(0, 122, 255, 0.1) !default;
$tab-background-4: #f5f5f5 !default;
$tab-border-color: #efefef !default;
$btn-background: #f3f4fb !default;

.intelligence-page {
  background-color: $tab-background-2;
  width: 1000px;

  .team-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .bottom-part {
    background-color: $color-white;
    margin: 12px 0;
    padding: 15px;
    border-radius: 4px;

    .same-odds {
      .title-part {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;

        div.title {
          font-weight: bold;
          color: $font-title-color;
          font-size: $font-size-middle;
          font-family: $font-family-no-number;
        }

        div.btn-group {
          .btn-default {
            background-color: $btn-background;
            color: $font-title-color;
          }

          .btn-active {
            background-color: $tab-background-3;
            color: $color-active;
          }

          .btn {
            cursor: pointer;
            font-size: $font-size-middle;
            font-family: $font-family-no-number;
            border-radius: 2px;
            width: 88px;
            height: 33.8px;
            outline: none;
            border: none;
            margin-left: 10px;
          }
        }
      }
      .tab-part {
        display: flex;
        justify-content: space-between;
      }
    }

    .handicap-part {
      div.title {
        font-weight: bold;
        margin-bottom: 14px;
        color: $font-title-color;
        font-size: $font-size-middle;
        font-family: $font-family-no-number;
      }

      div.section {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
