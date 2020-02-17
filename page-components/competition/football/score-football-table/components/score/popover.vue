<template>
  <div class="stat" @click.prevent.stop @mouseenter.prevent.stop>
    <PopsTitle :home="row.home" :guest="row.guest" />
    <div class="stat-main-box">
      <!-- 初值参考 -->
      <div class="init-params">
        <div class="font-style init-params-title">
          <span v-html="chupan" />
        </div>

        <div class="icon-group">
          <div v-for="item of iconGroup" :key="item.name">
            <Icon
              :name="item.icon"
              :class="[
                { 'color-red': item.name === '红牌' },
                { 'color-yellow': item.name === '黄牌' },
                { 'color-goal': item.name === '进球' },
              ]"
            />

            <span class="font-style" v-text="item.name" />
          </div>
        </div>
      </div>

      <!-- 比赛事件 -->
      <div v-if="!isEmpty" class="competition-things">
        <div class="font-style competition-things-title">比赛事件</div>

        <div class="things-section">
          <div class="team-icon-group">
            <div>
              <img v-lazy="row.home.icon" class="team-icon" />
            </div>
            <div>
              <img v-lazy="row.guest.icon" class="team-icon" />
            </div>
          </div>

          <div class="progress-section">
            <div class="icon-things home-things">
              <ElPopover
                v-for="(item, index) of homeStat"
                :key="index"
                placement="top"
                popper-class="score-popover"
                trigger="hover"
                :visible-arrow="0"
              >
                <div>
                  {{ item.minute }}'
                  {{
                    item.ename === '换人'
                      ? item.pName + ' 换 ' + item.pName2
                      : item.ename
                  }}
                </div>
                <div
                  slot="reference"
                  class="icon-style"
                  :style="{ left: `${positionLeft(+item.minute) - 6}px` }"
                >
                  <Icon
                    v-if="eventIcons[item.event]"
                    :name="eventIcons[item.event]"
                    :class="[
                      `event-icon-${eventIcons[item.event]}`,
                      { 'color-red': item.ename === '红牌' },
                      { 'color-yellow': item.ename === '黄牌' },
                      { 'color-goal': item.ename === '进球' },
                    ]"
                  />
                </div>
              </ElPopover>
            </div>

            <div class="competition-progress">
              <div
                class="progress-color-bar"
                :style="{ width: `${barWidth}px` }"
              />
              <div
                class="progress-slider"
                :style="{ left: `${barWidth - 2}px` }"
              />
            </div>

            <div class="icon-things guest-things">
              <ElPopover
                v-for="(item, index) of guestStat"
                :key="index"
                placement="bottom"
                popper-class="score-popover"
                trigger="hover"
                :visible-arrow="0"
              >
                <div>
                  {{ item.minute }}'
                  {{
                    item.ename === '换人'
                      ? item.pName + ' 换 ' + item.pName2
                      : item.ename
                  }}
                </div>

                <div
                  slot="reference"
                  class="icon-style"
                  :style="{ left: `${positionLeft(+item.minute) - 6}px` }"
                >
                  <Icon
                    v-if="eventIcons[item.event]"
                    :name="eventIcons[item.event]"
                    :class="[
                      `event-icon-${eventIcons[item.event]}`,
                      { 'color-red': item.ename === '红牌' },
                      { 'color-yellow': item.ename === '黄牌' },
                      { 'color-goal': item.ename === '进球' },
                    ]"
                  />
                </div>
              </ElPopover>
            </div>
          </div>
        </div>
      </div>

      <!-- 技术统计 -->
      <div v-if="statList.length" class="skill-calc">
        <div class="font-style skill-calc-title">
          技术统计
        </div>

        <div
          v-for="(item, index) of statList"
          :key="`stat-${index}`"
          class="bar-item-wrap"
        >
          <BarItem
            class="bar-item"
            :label="item.label"
            :home="item.value.home"
            :guest="item.value.guest"
          />
        </div>
      </div>

      <div v-if="isEmpty && !statList.length" class="no-data">
        暂无数据
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/icon'
import { footballAhYield } from '@/utils/status'
import PopsTitle from '../pops-title'
import BarItem from './score-calc-item'

const STAT_KEYS = {
  shots: '射门',
  onTarget: '射正',
  attack: '进攻',
  dangerousAttack: '危险进攻',
}

const ICON_GROUP = [
  { name: '角球', icon: 'icon_corner' },
  { name: '进球', icon: 'football' },
  { name: '换人', icon: 'icon_substitutions' },
  { name: '红牌', icon: 'card' },
  { name: '黄牌', icon: 'card' },
]

const EVENT_ICONS = {
  0: 'football',
  1: 'football',
  2: 'football lost',
  3: 'card',
  4: 'card',
  300: 'substitute',
}

export default {
  components: {
    BarItem,
    PopsTitle,
    Icon,
  },
  props: {
    row: Object,
    stat: Object,
    statusType: [String, Number],
  },
  data() {
    return {
      eventIcons: EVENT_ICONS,
    }
  },
  computed: {
    nowTime() {
      if (['完', '90+'].includes(this.statusType)) {
        return this.maxMinute
      } else if (['中', '45+'].includes(this.statusType)) {
        return 45
      } else if (typeof this.statusType === 'number') {
        return this.statusType
      } else {
        return 0
      }
    },
    isEmpty() {
      return !this.stat || !this.stat.events
    },
    homeStat() {
      if (this.isEmpty) {
        return []
      }
      return this.stat.events.filter(item => item.type === '1')
    },
    guestStat() {
      if (this.isEmpty) {
        return []
      }
      return this.stat.events.filter(item => item.type === '2')
    },
    maxMinute() {
      if (this.isEmpty) {
        return 0
      }
      const minGroup = this.stat.events.map(item => Number(item.minute))
      const maxMinute = Math.max(...minGroup)
      return maxMinute > 90 ? maxMinute : 90
    },
    chupan() {
      const value = this.stat ? this.stat.chupan : ''
      return '初值参考：' + footballAhYield(value)
    },
    statList() {
      if (!this.stat || !this.stat.stat) {
        return []
      }

      return Object.entries(STAT_KEYS).map(([key, name]) => ({
        label: name,
        value: this.stat.stat[key],
      }))
    },
    iconGroup() {
      return ICON_GROUP
    },
    barWidth() {
      const width = Math.round((this.nowTime / this.maxMinute).toFixed(2) * 338)

      return this.$route.query.timeType === 'past' ? 338 : width
    },
  },
  methods: {
    positionLeft(minute) {
      return Math.round((minute / this.maxMinute).toFixed(2) * this.barWidth)
    },
  },
}
</script>

<style lang="scss" scoped>
.stat {
  width: 420px;

  .color-red {
    color: $color-red;
  }

  .color-yellow {
    color: $color-yellow;
  }

  .color-goal {
    color: #333;
  }

  .event-icon-football {
    background-color: $color-white;
    border-radius: 50%;
  }

  .font-style {
    color: #333;
    font-size: $font-size-small;
    font-family: $font-family-no-number;
  }

  .skill-calc {
    border-top: 1px $color-tab-border solid;
    padding: 0 12px;

    .skill-calc-title {
      padding: 12px 0 9px;
      font-weight: bold;
    }

    .bar-item {
      margin-bottom: 6px;
    }

    .bar-item-wrap:last-of-type {
      margin-bottom: 12px;
    }
  }

  .competition-things {
    padding: 0 12px 25px;

    .competition-things-title {
      padding: 12px 0 9px;
      font-weight: bold;
    }

    .icon-things {
      height: 16px;
      position: relative;

      .icon-style {
        position: absolute;
        top: 0;
      }
    }

    .icon-ctx {
      background-color: #f3f4f7;
      text-align: center;
      color: #333;
      font-size: $font-size-small;
    }

    .competition-progress {
      width: 338px;
      position: relative;
      height: 4px;
      margin: 2px 0 2px 2px;
      border-radius: 2px;
      background-color: #f3f4f7;
    }

    .progress-color-bar {
      position: absolute;
      left: 0;
      top: 0;
      height: 4px;
      border-radius: 2px;
      background-image: linear-gradient(to right, $color-active, $color-red);
    }

    .progress-slider {
      width: 2px;
      height: 8px;
      background-color: $color-red;
      border-radius: 1px;
      position: absolute;
      top: -2px;
    }

    .things-section {
      height: 102px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .team-icon-group {
      & > div {
        margin-left: 3px;
        background-color: $color-white;
        width: 16px;
        height: 16px;
        border-radius: 8px;
        text-align: center;
        padding-top: 1px;
      }

      & > div:last-of-type {
        margin-top: 2px;
      }

      & > div:first-of-type {
        margin-top: 3px;
      }

      width: 22px;
      height: 40px;
      background-color: #f3f4f7;
      border-radius: 14px;
      text-align: center;

      .team-icon {
        border-radius: 7px;
        max-width: 14px;
        max-height: 14px;
      }
    }
  }

  .init-params {
    background-color: #f9f9f9;
    height: 32px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .init-params-title {
      font-weight: bold;
    }

    .icon-group {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      div {
        margin-left: 10px;
      }
    }
  }

  .no-data {
    text-align: center;
    color: $color-font-base;
    padding: 10px 0;
    font-size: $font-size-small;
    font-family: $font-family-no-number;
  }
}
</style>
