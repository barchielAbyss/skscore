<template>
  <div class="match-progress">
    <div class="match-progress__time-line">
      <span class="line-item time-0">0'</span>
      <span class="line-item time-45" :style="fetchPosition({ minute: 45 })">
        HT
      </span>
      <span class="line-item time-90" :style="fetchPosition({ minute: 90 })">
        90'
      </span>

      <span
        v-for="(item, index) of sequentialEvents"
        :key="index"
        :style="fetchPosition(item)"
        class="line-item"
        v-text="fetchMinuteName(item)"
      />
    </div>

    <div class="match-progress__home-line">
      <ElPopover
        v-for="(item, index) of homeEvents"
        :key="index"
        :style="fetchPosition(item)"
        placement="top-start"
        width="200"
        trigger="hover"
        class="line-item"
        popper-class="match-progress__line-propver"
      >
        <span v-html="fetchEventText(item)" />
        <span slot="reference">
          <VIcon
            :class="[
              fetchEventIcon(item),
              {
                yellow: [3].includes(Number(item.event)),
                red: [4, 5].includes(Number(item.event)),
              },
            ]"
            :name="fetchEventIcon(item)"
          />
        </span>
      </ElPopover>
    </div>

    <div class="match-progress__guest-line">
      <ElPopover
        v-for="(item, index) of grestEvents"
        :key="index"
        :style="fetchPosition(item)"
        placement="bottom-start"
        width="200"
        trigger="hover"
        class="line-item"
        popper-class="match-progress__line-propver"
      >
        <span v-html="fetchEventText(item)" />
        <span slot="reference">
          <VIcon
            :class="[
              fetchEventIcon(item),
              {
                yellow: [3].includes(Number(item.event)),
                red: [4, 5].includes(Number(item.event)),
              },
            ]"
            :name="fetchEventIcon(item)"
          />
        </span>
      </ElPopover>
    </div>
  </div>
</template>

<script>
import VIcon from '@/components/icon'

const TEAM_TYPE = {
  1: '主队',
  2: '客队',
}

export default {
  components: {
    VIcon,
  },
  props: {
    events: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      fullMathTime: 90,
    }
  },
  computed: {
    isEmpty() {
      return Boolean(!this.events || !this.event.length)
    },
    sequentialEvents() {
      let prevTime = 0
      return (this.events || []).reduce((prev, item) => {
        if ([101, 102, 104, 107, 110].includes(Number(item.event))) {
          return prev
        }
        const sameTimeItem = prev.filter(({ minute }) => item.minute === minute)
        if (
          sameTimeItem.length ||
          Math.abs(prevTime - Number(item.minute)) < 3 ||
          [44, 45, 46, 89, 90, 91].includes(Number(item.minute))
        ) {
          if (!item.sameItem) {
            item.hideTiem = true
            item.sameItem = sameTimeItem.length
          }
        }

        prevTime = Number(item.minute)

        return [item, ...prev]
      }, [])
    },
    homeEvents() {
      return this.sequentialEvents.filter(item => Number(item.type) === 1)
    },
    grestEvents() {
      return this.sequentialEvents.filter(item => Number(item.type) === 2)
    },
  },
  watch: {
    events: {
      immediate: true,
      handler(value) {
        if (value && value.length) {
          this.fetchLastMinute()
        }
      },
    },
  },
  methods: {
    fetchMinuteName(item) {
      if (item.hideTiem) {
        return ''
      }
      return Number(item.event) === 102 ? 'HT' : `${item.minute}'`
    },
    fetchEventText(item) {
      const eventTeam = TEAM_TYPE[item.type]
      const otherTeam = TEAM_TYPE[Number(item.type) === 1 ? 2 : 1]
      switch (Number(item.event)) {
        case 0:
          return `${item.minute}' ${eventTeam} ${item.ename}, 由 
          <b>${item.pName}</b> 射进`
        case 1:
          return `${item.minute}' ${eventTeam} ${item.ename}, 
          <b>${item.pName}</b> 点球射进`
        case 2:
          return `${item.minute}' ${otherTeam} ${item.ename}, <b>${item.pName}</b> 射进了自家球门`
        case 3:
          return `${item.minute}' ${eventTeam} 的 <b>${item.pName}</b> 吃到了一张${item.ename}`
        case 4:
          return `${item.minute}' ${eventTeam} 的 <b>${item.pName}</b> 被 
          ${item.ename} 罚下`
        case 5:
          return `${item.minute}' ${eventTeam} 的 <b>${item.pName}</b> 吃到了第二张 
          ${item.ename} 被罚下`
        case 300:
          return `${item.minute}' ${eventTeam}${item.ename} 换上 <b/>
          ${item.pName}</b> 换下 ${item.pName2}`
        default:
          return ''
      }
    },
    fetchEventIcon(item) {
      switch (Number(item.event)) {
        case 0:
        case 1:
        case 2:
          return `football`
        case 3:
          return `card`
        case 4:
        case 5:
          return `card`
        case 300:
          return `substitute`
        default:
          return ''
      }
    },
    fetchLastMinute() {
      if (this.events.length < 3) {
        return
      }
      const lastMinute = Number(this.events[0].minute)
      const boobyMinute = Number(this.events[1].minute)
      if (lastMinute > this.fullMathTime) {
        this.fullMathTime = lastMinute
      }

      if (boobyMinute > this.fullMathTime) {
        this.fullMathTime = boobyMinute
      }
    },
    fetchPosition(item) {
      const elWidth = this.$el ? this.$el.clientWidth : 649
      let numTime = Number(item.minute)
      const rank = elWidth / this.fullMathTime
      if (numTime < 5) {
        numTime = 5
      }
      const width = !item.sameItem ? 18 : 18 + item.sameItem * 6

      return {
        left: `${numTime * rank - width}px`,
      }
    },
  },
}
</script>

<style lang="scss">
.match-progress {
  margin: 0 7px;
  &__time-line,
  &__home-line,
  &__guest-line {
    position: relative;
    > .line-item {
      position: absolute;
    }
  }
  &__time-line {
    height: 20px;
    line-height: 20px;
    .line-item {
      height: 20px;
      &.time-0,
      &.time-45,
      &.time-90 {
        color: #f7b500;
      }
      &.time-0 {
        left: 0;
      }
      &.time-90,
      &.time-45 {
        left: calc(50% - 18px);
        z-index: 1;
        &::before {
          position: absolute;
          content: '';
          display: block;
          bottom: -60px;
          left: 8px;
          height: 60px;
          width: 1px;
          background-color: #eaeaea;
        }
      }
      &.time-90 {
        left: calc(100% - 18px);
      }
    }
  }
  &__home-line {
    background-color: #e5f1ff;
    height: 30px;
  }
  &__guest-line {
    background-color: #fef3ee;
    height: 30px;
  }
  &__home-line,
  &__guest-line {
    .line-item {
      height: 24px;
      top: 3px;
      z-index: 1;
      &:hover {
        background-color: $color-white;
        z-index: 2;
        border-radius: 4px;
      }
    }
  }
  .line-item {
    width: 18px;
    text-align: center;
  }
  .icon {
    margin-top: 4px;
    width: 16px;
    height: 16px;
    &.football {
      background-color: #fff;
      border-radius: 8px;
    }
  }
  .yellow {
    color: #f7b500;
  }
  .red {
    color: #e1243b;
  }
}
.match-progress__line-propver {
  font-size: 12px;
}
</style>
