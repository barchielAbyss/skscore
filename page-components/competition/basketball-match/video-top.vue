<template>
  <div class="video-top-wrap">
    <div :class="['tab-head']">
      <div
        v-for="item of tabRow"
        :key="item"
        :class="[
          'font-default',
          {
            'width-default': ['一节', '二节', '三节', '四节'].includes(item),
          },
          { 'width-large': '总分' === item },
          { 'width-middle': '全场' === item || '欧指' === item },
          { 'width-big': '让分' === item || '对阵' === item },
        ]"
      >
        {{ item }}
      </div>
    </div>

    <div class="tab-body">
      <div
        v-for="item of tabData"
        :key="item.team"
        :class="['tab-cols', 'font-default', 'tab-bg-color']"
      >
        <div :class="['width-big', 'border-right']">{{ item.team }}</div>
        <div :class="['width-default']">{{ item.one }}</div>
        <div :class="['width-default']">{{ item.two }}</div>
        <div :class="['width-default']">{{ item.three }}</div>
        <div :class="['width-default', 'border-right']">{{ item.four }}</div>
        <div :class="['width-middle', 'border-right', 'color-red-race']">
          {{ item.race }}
        </div>
        <div :class="['width-middle', 'border-right']">
          {{ item.hda === '' ? '-' : item.hda }}
        </div>
        <div :class="['width-big', 'border-right']">
          <div v-if="item.ah[1] === '' && item.ah[0] === ''">-</div>
          <div v-else>
            <span class="color-red-score">{{ item.ah[0] }}</span>
            <span class="ml">{{ item.ah[1] }}</span>
          </div>
        </div>
        <div :class="['width-large']">
          <div v-if="item.ou[0] === '' && item.ou[1] === ''">-</div>
          <div v-else>
            <span class="mr color-red-score">{{
              item.total > item.ou[0] ? '大' : '小'
            }}</span>
            <span class="color-red-score">{{ item.ou[0] }}</span>
            <span class="ml">{{ item.ou[1] }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import emitter from '@/utils/emitter'
export default {
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
      tabRow: [
        '对阵',
        '一节',
        '二节',
        '三节',
        '四节',
        '全场',
        '欧指',
        '让分',
        '总分',
      ],
      tabData: [
        {
          team: this.matchInfo.homeInfo.name,
          one: '',
          two: '',
          three: '',
          four: '',
          race: '',
          hda: '',
          ah: [],
          ou: [],
          total: 0,
        },

        {
          team: this.matchInfo.guestInfo.name,
          one: '',
          two: '',
          three: '',
          four: '',
          race: '',
          hda: '',
          ah: [],
          ou: [],
          total: 0,
        },
      ],
      temp: this.matchInfo,
    }
  },
  mounted() {
    this.fetchOdds(Number(this.matchId))
    this.setScoreAndName()

    emitter.$on('socket-basketball-gold', this.matchStatusChange)
    emitter.$on('socket-basketball-hda', this.hdaChange)
    emitter.$on('socket-basketball-ah', this.ahChange)
    emitter.$on('socket-basketball-ou', this.ouChange)
  },
  beforeDestroy() {
    emitter.$off('socket-basketball-gold', this.matchStatusChange)
    emitter.$off('socket-basketball-hda', this.hdaChange)
    emitter.$off('socket-basketball-ah', this.ahChange)
    emitter.$off('socket-basketball-ou', this.ouChange)
  },
  methods: {
    // HTTP 请求，静态数据，获取比赛盘口信息
    fetchOdds(matchId) {
      this.$axios
        .get(api.get.common.fetchMatchOdds, {
          params: {
            category: 2,
            match_id: matchId,
            company: '金宝博',
          },
        })
        .then(({ code, data }) => {
          if (!data || code !== 0) {
            throw new Error('暂无数据')
          }

          const { ou, hda, ah } = data
          // 数组 data 内容：
          // 欧盘       had[ 主胜，主平，客胜 ]
          // 亚盘（让分） ah[ 主赔，客赔，让球 ]
          // 总分        ou[ 大球，小球，总分 ]

          // 让球数据为空
          if (ah[2] === '') {
            this.tabData[0].ah = ['', ah[0]]
            this.tabData[1].ah = ['', ah[1]]
          } else {
            // 让球数据不为空时，判断正负
            const obj = this.scoreOfAh(ah[2])
            if (obj.type === 'home') {
              this.tabData[0].ah = [obj.value, ah[0]]
              this.tabData[1].ah = ['', ah[1]]
            } else {
              this.tabData[0].ah = ['', ah[0]]
              this.tabData[1].ah = [obj.value, ah[1]]
            }
          }

          this.tabData[0].hda = hda[0]
          this.tabData[1].hda = hda[2]

          // 大小球数据为空
          if (ou[2] === '') {
            this.tabData[0].ou = ['', ou[0]]
            this.tabData[1].ou = ['', ou[1]]
          } else {
            // 大小球数据不为空
            this.tabData[0].ou = [ou[2], ou[0]]
            this.tabData[1].ou = [ou[2], ou[1]]
          }
        })
        .catch(() => {
          this.tabData = []
        })
    },

    // 设置前球队比分和队名
    setScoreAndName() {
      const {
        home_first: homeFirst,
        home_second: homeSecond,
        home_third: homeThird,
        home_fourth: homeFourth,
        home_total: homeTotal,

        guest_first: guestFirst,
        guest_second: guestSecond,
        guest_third: guestThird,
        guest_fourth: guestFourth,
        guest_total: guestTotal,
        homeInfo,
        guestInfo,
      } = this.temp

      const allTotal = Number(homeTotal) + Number(guestTotal)

      this.tabData[0].team = homeInfo.name
      this.tabData[1].team = guestInfo.name

      this.tabData[0].one = homeFirst
      this.tabData[0].two = homeSecond
      this.tabData[0].three = homeThird
      this.tabData[0].four = homeFourth
      this.tabData[0].race = homeTotal

      this.tabData[1].one = guestFirst
      this.tabData[1].two = guestSecond
      this.tabData[1].three = guestThird
      this.tabData[1].four = guestFourth
      this.tabData[1].race = guestTotal

      this.tabData[0].total = allTotal
      this.tabData[1].total = allTotal
    },

    // 处理返回数据格式
    formatData(data) {
      const match = data.matchs[0]
      const {
        event_id: eventId,
        home_team_id: homeId,
        guest_team_id: guestId,
      } = match
      const homeInfo = data.teams[homeId]
      const guestInfo = data.teams[guestId]
      const eventInfo = data.events[eventId]

      return {
        ...match,
        homeInfo,
        guestInfo,
        eventInfo,
      }
    },

    // 判断让球正负数
    scoreOfAh(target) {
      if (target) {
        return {
          type: 'home',
          value: Math.abs(Number(target)),
        }
      } else {
        return {
          type: 'guest',
          value: Math.abs(Number(target)),
        }
      }
    },

    // 动态获取、设置比分
    matchStatusChange(value) {
      if (Number(value.mid) !== Number(this.matchId)) {
        return
      }

      this.temp = {
        ...this.temp,
        ...value.ext,
      }

      this.setScoreAndName()
    },

    // 更新欧盘
    hdaChange(value) {
      const itemOdd = value.find(
        item =>
          Number(item.mid) === Number(this.matchId) &&
          Number(item.company_id) === 7
      )
      if (!itemOdd) {
        return
      }
      this.tabData[0].hda = itemOdd.odd.h
      this.tabData[1].hda = itemOdd.odd.g
    },

    // 更新亚盘
    ahChange(value) {
      const itemOdd = value.find(
        item =>
          Number(item.mid) === Number(this.matchId) &&
          Number(item.company_id) === 7
      )
      if (!itemOdd) {
        return
      }
      const obj = this.scoreOfAh(itemOdd.odd.l)
      if (obj.type === 'home') {
        this.tabData[0].ah = [obj.value, itemOdd.odd.h]
        this.tabData[1].ah = ['', itemOdd.odd.g]
      } else {
        this.tabData[0].ah = ['', itemOdd.odd.h]
        this.tabData[1].ah = [obj.value, itemOdd.odd.g]
      }
    },

    // 更新大小球
    ouChange(value) {
      const itemOdd = value.find(
        item =>
          Number(item.mid) === Number(this.matchId) &&
          Number(item.company_id) === 7
      )
      if (!itemOdd) {
        return
      }
      this.tabData[0].ou = [itemOdd.odd.t, itemOdd.odd.b]
      this.tabData[1].ou = [itemOdd.odd.t, itemOdd.odd.s]
    },
  },
}
</script>

<style lang="scss" scoped>
.video-top-wrap {
  background-color: $color-white;
  border-radius: 8px;
  margin: 12px 0;

  .tab-head,
  .tab-cols {
    color: #666;
    display: flex;

    .width-large {
      width: 170px;
    }

    .width-big {
      width: 130px;
    }

    .width-middle {
      width: 100px;
    }
  }

  .font-default {
    box-sizing: border-box;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: $font-size-small;
    font-family: $font-family-no-number;
  }

  .color-red-score {
    color: #f95d22;
  }
  .color-red-race {
    color: #e1243b;
  }

  .tab-bg-color:nth-of-type(odd) {
    background-color: #f5f5f5;
  }

  .width-default {
    flex: 1;
  }

  .border-right {
    border-right: 1px #efefef solid;
  }

  .ml {
    margin-left: 12px;
  }

  .mr {
    margin-right: 5px;
  }
}
</style>
