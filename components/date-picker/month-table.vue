<template>
  <table class="date-picker-month-table">
    <tbody>
      <tr v-for="(month, index) of monthList" :key="index">
        <td
          v-for="item of month"
          :key="item.name"
          :class="[
            'month-table__item',
            {
              'is-today': item.value === nowDateMonth,
              'is-active': item.value === stringCurDate,
              'is-disabled': fetchItemDisabled(item),
            },
          ]"
          @click="handleChangeMonth(item)"
        >
          <span v-text="`${item.name}月`" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import dayjs from 'dayjs'
const MONTH_LIST = new Array(12).fill('').map((_, index) => index + 1)

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
  computed: {
    nowDateMonth() {
      const nowDate = new Date(this.stringNowDate)
      const { day } = this.curDate
      return new Date(nowDate.getFullYear(), nowDate.getMonth(), day).toString()
    },
    monthList() {
      return MONTH_LIST.reduce((prev, item, index) => {
        const itemDate = {
          value: this.fetchDate(item).toString(),
          name: item,
        }

        if (index % 4 === 0) {
          prev.push([itemDate])
        } else {
          prev[parseInt(index / 4)].push(itemDate)
        }
        return prev
      }, [])
    },
  },
  methods: {
    fetchItemDisabled(month) {
      return this.disableDate && this.disableDate(dayjs(month.value))
    },
    fetchDate(value) {
      const { year, month, day } = this.curDate
      const curMonth = value || month
      return new Date(year, curMonth - 1, day)
    },
    handleChangeMonth(item) {
      if (this.fetchItemDisabled(item)) {
        return
      }
      this.$emit('click', item.value, 'month')
    },
  },
}
</script>

<style lang="scss" scoped>
.date-picker-month-table {
  text-align: center;
  .month-table__item {
    padding: 0 8px;
    cursor: pointer;
    > span {
      display: block;
      line-height: 24px;
      border-radius: 6px;
      margin-bottom: 8px;
      padding: 0 4px;
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
        background-color: #eee;
      }
    }
  }
}
</style>
