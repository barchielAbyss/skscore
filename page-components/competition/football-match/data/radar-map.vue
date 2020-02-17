<template>
  <div class="teamCompare">
    <!--  雷达图  -->
    <VEcharts ref="radarMap" class="radar" :options="options" :height="360" />

    <div class="radar-details">
      <!--  雷达图选择器  -->
      <p
        v-for="(item, index) of radarItems"
        :key="index"
        :class="['default-item', { 'active-item': currentType === item.name }]"
        @click="chooseItem(item)"
      >
        {{ item.name }}
      </p>

      <!--   右侧数据详情   -->
      <div class="radar-right-data">
        <div class="details-title">
          <VIcon name="light" class="remind-icon" />{{ currentType }}提点
        </div>

        <div class="teamMsg hostWrap">
          <p class="hostTeam">{{ homeTeam.name_js || homeTeam.name }}</p>
          <p
            :class="[
              'radar-details-default',
              { 'radar-details-active': currentType === '攻击' },
            ]"
          >
            本赛季
            <span class="host-sp">{{ fight.games || '-' }}</span>
            场交锋中， 进攻次数为
            <span class="host-sp">{{ fight.home.attack || '-' }}</span>
            次，其中危险进攻为
            <span class="host-sp">{{ fight.home.dangerousAttack || '-' }}</span>
            次。
          </p>

          <p
            :class="[
              'radar-details-default',
              { 'radar-details-active': currentType === '身价' },
            ]"
          >
            <span class="host-sp">- 万</span>
            欧元
          </p>

          <p
            :class="[
              'radar-details-default',
              { 'radar-details-active': currentType === '角球' },
            ]"
          >
            角球
            <span class="host-sp">{{
              !home.corners ? '-' : home.corners
            }}</span>
            个
          </p>

          <p
            :class="[
              'radar-details-default',
              { 'radar-details-active': currentType === '状态' },
            ]"
          >
            本赛季控球率
            <span class="host-sp"
              >{{ home.possesion ? home.possesion + '%' : '-' }} </span
            >， 胜率
            <span class="host-sp"
              >{{ home.win_rate ? home.win_rate + '%' : '-' }}
            </span>
          </p>

          <p
            :class="[
              'radar-details-default',
              { 'radar-details-active': currentType === '防守' },
            ]"
          >
            共守住
            <span class="host-sp"
              >{{ !home.defence_total ? '-' : home.defence_total }}
            </span>
            次进攻，扑救
            <span class="host-sp">{{
              !home.save_total ? '-' : home.save_total
            }}</span>
            球。
          </p>
        </div>

        <div class="teamMsg customerWrap">
          <p class="customerTeam">{{ guestTeam.name_js || guestTeam.name }}</p>
          <p
            :class="[
              'radar-details-default',
              { 'radar-details-active': currentType === '攻击' },
            ]"
          >
            本赛季
            <span class="customer-sp">{{ fight.games || '-' }}</span>
            场交锋中， 进攻次数为
            <span class="customer-sp">{{ fight.guest.attack || '-' }}</span>
            次， 其中危险进攻为
            <span class="customer-sp">{{
              fight.guest.dangerousAttack || '-'
            }}</span>
            次。
          </p>

          <p
            :class="[
              'radar-details-default',
              { 'radar-details-active': currentType === '身价' },
            ]"
          >
            <span class="customer-sp">- 万</span>
            欧元
          </p>

          <p
            :class="[
              'radar-details-default',
              { 'radar-details-active': currentType === '角球' },
            ]"
          >
            角球
            <span class="host-sp">{{
              !guest.corners ? '-' : guest.corners
            }}</span>
            个
          </p>

          <p
            :class="[
              'radar-details-default',
              { 'radar-details-active': currentType === '状态' },
            ]"
          >
            本赛季控球率
            <span class="host-sp"
              >{{ guest.possesion ? guest.possesion + '%' : '-' }} </span
            >， 胜率
            <span class="host-sp"
              >{{ guest.win_rate ? guest.win_rate + '%' : '-' }}
            </span>
          </p>

          <p
            :class="[
              'radar-details-default',
              { 'radar-details-active': currentType === '防守' },
            ]"
          >
            共守住
            <span class="customer-sp"
              >{{ !guest.defence_total ? '-' : guest.defence_total }}
            </span>
            次进攻，扑救
            <span class="customer-sp">{{
              !guest.save_total ? '-' : guest.save_total
            }}</span>
            球。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VIcon from '@/components/icon'
import VEcharts from '@/components/echarts'

import api from '@/api'
import { RadarChartOptions } from './echart-options'

const TYPE_MAP = [
  { name: '状态' },
  { name: '攻击' },
  { name: '角球' },
  { name: '身价' },
  { name: '防守' },
]
export default {
  components: { VEcharts, VIcon },
  props: {
    homeTeam: {
      type: Object,
      default: () => ({}),
    },
    guestTeam: {
      type: Object,
      default: () => ({}),
    },
    matchId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      currentType: '状态',
      options: RadarChartOptions(),
      mockGuest: [],
      mockHome: [],
      home: {},
      guest: {},
      fight: { home: {}, guest: {} },
    }
  },
  computed: {
    radarItems: () => TYPE_MAP,
  },
  mounted() {
    this.fetchRadarMapMsg(this.matchId)
  },
  methods: {
    // 设置雷达图数据
    fetchRadarData() {
      // 设置客队数据
      this.options.series[0].data[0] = {
        name: '客队',
        value: this.mockGuest,
      }

      // 设置主队数据
      this.options.series[1].data[0] = {
        name: '主队',
        value: this.mockHome,
      }

      this.$refs.radarMap.chart.setOption(this.options)
    },

    // 点击事件：点击雷达选择器
    chooseItem(item) {
      this.currentType = item.name
    },

    // 网络请求
    fetchRadarMapMsg(matchId) {
      this.$axios
        .get(api.get.football.fetchMatchRadarTend, {
          params: { match_id: matchId },
        })
        .then(({ data, code, msg }) => {
          if (!data) {
            throw new Error('暂无数据')
          }

          if (code !== 0) {
            throw new Error(msg)
          }
          const { home, guest, fight } = data
          this.home = home
          this.guest = guest
          this.fight = fight

          // 数据项设置：胜率，进攻次数，角球数，身价，防守数
          this.mockHome = [
            this.radarDataFormat(Number(home.win_rate)),
            this.radarDataFormat(Number(fight.home.attack)),
            this.radarDataFormat(Number(home.corners)),
            0,
            this.radarDataFormat(Number(home.defence_total)),
          ]
          this.mockGuest = [
            this.radarDataFormat(Number(guest.win_rate)),
            this.radarDataFormat(Number(fight.guest.attack)),
            this.radarDataFormat(Number(guest.corners)),
            0,
            this.radarDataFormat(Number(guest.defence_total)),
          ]
          this.fetchRadarData()
        })
        .catch(err => {
          this.showMsg('error', err)
        })
    },

    // 消息弹框
    showMsg(type, msg) {
      this.$message({
        type: type,
        duration: 2000,
        showClose: true,
        message: msg,
      })
    },

    // 格式化雷达图数据，使用整形千位数
    radarDataFormat(data) {
      if (data > 0 && data < 100) {
        return Math.round(data) * 100
      } else if (data >= 100 && data < 1000) {
        return Math.round(data) * 10
      } else if (data >= 1000) {
        return data
      } else {
        return 0
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.teamCompare {
  border-radius: 8px;
  background-color: #fff;
  display: flex;
  position: relative;
}

.radar,
.radar-details {
  width: 500px;
  height: 360px;
}

.radar-right-data {
  flex: 1;
  height: 100%;
  font-family: $font-family-no-number;
  font-size: 14px;
  padding-right: 20px;
  color: $font-title-color;

  .hostWrap {
    margin-top: 50px;
  }

  .customerWrap {
    margin-top: 80px;
  }

  .details-title {
    font-weight: bold;
    padding-top: 50px;

    .remind-icon {
      color: #ffbe52;
      font-size: 18px;
      padding-right: 8.5px;
    }
  }

  .teamMsg {
    position: relative;
    .hostTeam {
      color: $color-active;
      font-weight: bold;
    }
    .customerTeam {
      color: #f95d22;
      font-weight: bold;
    }
    span.host-sp {
      font-size: 18px;
      font-weight: bold;
      color: $color-active;
    }
    span.customer-sp {
      font-size: 18px;
      font-weight: bold;
      color: #f95d22;
    }

    .radar-details-default {
      color: #666;
      font-size: $font-size-small;
      position: absolute;
      top: 23px;
      left: 0;
      opacity: 0;
    }

    .radar-details-active {
      @include transition-all;
      opacity: 1;
    }
  }
}

.default-item {
  position: absolute;
  background-color: #f3f4fb;
  border-radius: 10px;
  width: 46px;
  height: 22px;
  text-align: center;
  line-height: 22px;
  cursor: pointer;
  @include transition-all;
}

.active-item {
  background-color: $color-active;
  color: $color-white;
}

.default-item:nth-child(5) {
  left: 404px;
  top: 148px;
}

.default-item:nth-child(4) {
  left: 355px;
  top: 288px;
}

.default-item:nth-child(3) {
  left: 189px;
  top: 288px;
}

.default-item:nth-child(2) {
  left: 140px;
  top: 148px;
}

.default-item:nth-child(1) {
  left: 272px;
  top: 55px;
}
</style>
