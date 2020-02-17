<template>
  <table class="date-picker-day-table">
    <thead>
      <tr>
        <th v-for="(item, key) in weekList" :key="key" class="day-table__title">
          {{ item }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(week, index) of monthDays" :key="index">
        <td
          v-for="(day, dayIndex) of week"
          :key="dayIndex"
          :class="[
            'day-table__item',
            {
              'is-today': day.value === stringNowDate,
              'is-active': day.value === stringCurDate,
              'is-other': day.other,
              'is-disabled': fetchItemDisabled(day),
            },
          ]"
          @click="handleChangeDay(day)"
        >
          <span v-text="day.name" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import dayjs from 'dayjs'

const WEEK_LIST = {
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
}

export default {
  props: {
    curDate: {
      type: Object,
      default: () => ({}),
    },
    stringNowDate: {
      type: String,
      default: () => '',
    },
    stringCurDate: {
      type: String,
      default: () => '',
    },
    disableDate: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      monthDays: [],
    }
  },
  computed: {
    weekList: () => WEEK_LIST,
  },
  watch: {
    curDate() {
      this.$nextTick(() => {
        this.fetchMonthDays()
      })
    },
  },
  created() {
    this.fetchMonthDays()
  },
  methods: {
    fetchItemDisabled(day) {
      return this.disableDate && this.disableDate(dayjs(day.value))
    },
    handleChangeDay(day) {
      if (this.fetchItemDisabled(day)) {
        return
      }
      this.$emit('click', day.value)
    },
    fetchMonthDays() {
      const monthDaysCount = this.fetchMonthCountDay(1)
      const lastMonthDayCount = this.fetchMonthCountDay(0)

      const monthFirstDayWeek = this.fetchWeek(1)
      const monthLastDayWeek = this.fetchWeek(monthDaysCount)

      const dayCount = new Array(monthDaysCount).fill('').map((_, index) => ({
        value: this.fetchDate(0, index + 1).toString(),
        name: index + 1,
      }))

      for (let i = 0; i < monthFirstDayWeek; i++) {
        const day = lastMonthDayCount - i
        dayCount.unshift({
          value: this.fetchDate(-1, day).toString(),
          name: day,
          other: true,
        })
      }
      for (let i = 0; i < 6 - monthLastDayWeek; i++) {
        const day = i + 1
        dayCount.push({
          value: this.fetchDate(+1, day).toString(),
          name: day,
          other: true,
        })
      }

      this.monthDays = dayCount.reduce((prev, item, index) => {
        if (index % 7 === 0) {
          prev.push([item])
        } else {
          prev[parseInt(index / 7)].push(item)
        }
        return prev
      }, [])
    },
    fetchDate(addMonth = 0, day = 1) {
      const { year, month } = this.curDate
      return new Date(year, month - 1 + addMonth, day)
    },
    fetchMonthCountDay(add = 0) {
      return this.fetchDate(add, 0).getDate()
    },
    fetchWeek(day = 0) {
      return this.fetchDate(0, day).getDay()
    },
  },
}
</script>

<style lang="scss" scoped>
.date-picker-day-table {
  text-align: center;
  .day-table__title {
    color: #ccc;
    font-weight: normal;
    line-height: 24px;
    padding-bottom: 8px;
  }
  .day-table__item {
    padding: 0 8px;
    cursor: pointer;
    > span {
      display: block;
      width: 24px;
      height: 24px;
      line-height: 24px;
      border-radius: 50%;
      margin-bottom: 8px;
      border: 1px solid transparent;
    }
    &:hover {
      color: $color-white;
      > span {
        background-color: $color-active;
      }
    }
  }
  .is-other {
    color: #ccc;
  }
  .is-today {
    position: relative;
    ::after {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-2px);
      content: '';
      display: block;
      border-radius: 50%;
      width: 4px;
      height: 4px;
      background-color: $color-active;
    }
  }
  .is-active {
    color: $color-white;
    > span {
      background-color: $color-active;
    }
  }
  .is-disabled {
    cursor: not-allowed;
    color: #aaa;
    &:hover {
      color: #aaa;
      > span {
        background-color: transparent;
      }
    }
  }
}
</style>
