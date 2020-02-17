<template>
  <ElPopover
    ref="datePicker"
    :placement="placement"
    :trigger="trigger"
    :visible-arrow="false"
    @after-leave="onClose"
  >
    <span slot="reference" class="date-picker-button">
      <VIcon name="icon_calendar1" class="icon-icon_calendar" />
      日历
    </span>

    <div class="date-picker-select-box">
      <div class="date-picker-header">
        <i
          :class="{ disabled: fetchArrowDisable(-1) }"
          class="iconfont icon-arrow arrow-right"
          @click="onDateAdd(-1)"
        />
        <span class="date-picker-header__time" @click="changeCurType">
          {{ dateShow }}
        </span>
        <i
          :class="{ disabled: fetchArrowDisable(0) }"
          class="iconfont icon-arrow arrow-left"
          @click="onDateAdd(+1)"
        />
      </div>

      <component
        :is="selectTypes[curType]"
        :cur-date="valueDate"
        :string-now-date="stringNowDate"
        :string-cur-date="stringCurDate"
        :disable-date="disableDate"
        @click="handleChangeDate"
      />

      <!-- <div @click="handleToday">今天</div> -->
    </div>
  </ElPopover>
</template>

<script>
import dayjs from 'dayjs'
import VIcon from '@/components/icon'
import DayTable from './day-table'
import MonthTable from './month-table'
const SELECT_TYPES_COMPONENTS = {
  day: 'DayTable',
  month: 'MonthTable',
}

export default {
  components: {
    DayTable,
    VIcon,
    MonthTable,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    placement: {
      type: String,
      default: 'bottom-start',
    },
    trigger: {
      type: String,
      default: 'click',
    },
    disableDate: {
      type: Function,
      default: () => {},
    },
    format: {
      type: String,
      default: 'YYYY/MM/DD',
    },
  },
  data() {
    return {
      curType: 'day',
      localValue: '',
      stringCurDate: '',
    }
  },
  computed: {
    selectTypes: () => SELECT_TYPES_COMPONENTS,
    dateShow() {
      const { year, month } = this.valueDate
      return this.curType === 'day' ? `${year}/${month}` : year
    },
    stringNowDate() {
      return this.fetchDateString(this.formatDate())
    },
    valueDate() {
      return this.formatDate(this.localValue)
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        this.localValue = value || dayjs().format(this.format)
        this.stringCurDate = this.fetchDateString(this.formatDate(value))
      },
    },
  },
  methods: {
    onClose() {
      this.localValue = this.value || dayjs().format(this.format)
    },
    fetchArrowDisable(value) {
      const dateUnit = this.curType === 'day' ? 'month' : 'year'
      const nextDate = dayjs(this.localValue).add(value, dateUnit)

      return this.disableDate(nextDate, dateUnit)
    },
    fetchDateString(date) {
      const { year, month, day } = date
      return new Date(year, month - 1, day).toString()
    },
    onDateAdd(value) {
      const dateUnit = this.curType === 'day' ? 'month' : 'year'
      this.localValue = dayjs(this.localValue)
        .add(value, dateUnit)
        .format(this.format)
    },
    changeCurType() {
      this.curType = this.curType === 'day' ? 'month' : 'day'
    },
    formatDate(date) {
      const { $y: year, $M: month, $D: day, $W: week } = dayjs(
        date || new Date()
      )
      return {
        year,
        month: month + 1,
        day,
        week,
      }
    },
    handleChangeDate(date, type) {
      if (date === this.stringCurDate) {
        return
      }
      this.localValue = dayjs(date).format(this.format)
      this.stringCurDate = this.fetchDateString(this.valueDate)

      if (type === 'month') {
        this.changeCurType()
      } else {
        this.$emit('change', this.localValue)
        this.$refs.datePicker.showPopper = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.date-picker-button {
  cursor: pointer;
  vertical-align: middle;
  font-size: $font-size-middle;
  .icon-icon_calendar {
    font-size: $font-size-large;
  }
}
.date-picker-select-box {
  padding: 2px 6px;
  .date-picker-header {
    padding: 4px 0 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #999;
    font-size: 18px;
    user-select: none;
    &__time {
      cursor: pointer;
      transition: color 0.3s ease-in-out;
      &:hover {
        color: #666;
      }
    }
    .icon-arrow {
      cursor: pointer;
      color: #999;
      transition: 0.3s ease-in-out;
      &:hover {
        color: #333;
      }
      &.disabled {
        pointer-events: none;
        color: #cfcfcf;
      }
    }
  }
}
</style>
