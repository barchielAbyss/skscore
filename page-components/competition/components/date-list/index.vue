<template>
  <div class="competition-date-list">
    <div
      v-for="item of dayList"
      :key="item.value"
      :class="[
        'competition-date-list__item',
        { active: curDay === item.value },
      ]"
      @click="changeCurDay(item)"
    >
      <p
        :class="['date-font', { active: curDay === item.value }]"
        v-text="fetchTitle(item)"
      />
      <p
        :class="['week-font', { active: curDay === item.value }]"
        v-text="fetchWeek(item)"
      />
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

const WEEK_LIST = {
  0: '星期天',
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
}

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    dateType: {
      type: String,
      required: true,
      validator(value) {
        return ['past', 'future'].includes(value)
      },
    },
    count: {
      type: Number,
      default: 7,
    },
    value: {
      type: [Number, String],
    },
    format: {
      type: String,
      default: 'YYYY/MM/DD',
    },
  },
  computed: {
    curDay() {
      return !this.value
        ? dayjs(new Date()).format(this.format)
        : dayjs(this.value).format(this.format)
    },
    dayList() {
      return this.fetchDays()
    },
  },
  methods: {
    fetchDays() {
      const res = []
      for (let i = 0; i < this.count; i++) {
        const addDay = this.dateType === 'past' ? 0 - i : i
        const item = dayjs(new Date())
          .add(addDay, 'day')
          .startOf('day')

        res.push({
          date: item,
          value: item.format(this.format),
          today: addDay === 0,
        })
      }

      return this.dateType === 'past' ? res.reverse() : res
    },
    fetchTitle(item) {
      const month = String(item.date.$M + 1).padStart(2, '0')
      const day = String(item.date.$D).padStart(2, '0')
      return `${month}-${day}`
    },
    fetchWeek(item) {
      if (item.today) {
        return '今天'
      } else {
        return WEEK_LIST[item.date.$W]
      }
    },
    changeCurDay(item) {
      this.$emit('update:value', item.value)
      this.$emit('change', item.value)
    },
  },
}
</script>

<style lang="scss" scoped>
.competition-date-list {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  display: flex;
  line-height: 19px;
  background-color: $color-white;

  .date-font {
    font-size: $font-size-large;
    color: #666;
  }

  .week-font {
    font-size: $font-size-small;
    color: #999;
  }

  &__item {
    &:last-of-type {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
    cursor: pointer;
    flex: 1;
    text-align: center;
    padding: 8px 0 4px;
    > p {
      margin-bottom: 4px;
    }
    > p.active {
      color: $color-active;
    }

    &.active {
      background-color: $color-active-light;
    }
  }
}
</style>
