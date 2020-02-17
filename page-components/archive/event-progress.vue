<template>
  <div class="event-progress-wrap">
    <div class="progress">
      <div
        class="done"
        :style="{
          width: timeProgress,
        }"
      />
    </div>

    <div class="date-title">
      <span class="style-default">
        {{ startTime.format('YYYY年M月D日') }}
      </span>
      <span class="style-default">
        {{ endTime.format('YYYY年M月D日') }}
      </span>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapState } from 'vuex'

export default {
  props: {
    start: {
      type: [Number, String],
      required: true,
    },
    end: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('user', ['serverTime']),
    startTime() {
      return dayjs(Number(this.start))
    },
    endTime() {
      return dayjs(Number(this.end))
    },
    diffStartTime() {
      return (this.serverTime || dayjs()).diff(this.startTime)
    },
    totalTime() {
      return this.endTime.diff(this.startTime)
    },
    timeProgress() {
      let diffTime = this.diffStartTime
      if (diffTime < 0) {
        diffTime = 0
      }
      if (diffTime > this.totalTime) {
        diffTime = this.totalTime
      }

      return this.fetchPercent(diffTime, this.totalTime)
    },
  },
  methods: {
    fetchPercent(value, total) {
      if (!value || !total) {
        return '0%'
      }
      return `${Math.ceil((value / total) * 100)}%`
    },
  },
}
</script>

<style lang="scss" scoped>
.event-progress-wrap {
  .progress {
    height: 2px;
    display: flex;
    background: #ebebeb;
    border-radius: 2px;
    position: relative;

    .done {
      width: 0;
      height: 2px;
      background: #e1243b;
      text-align: right;
      &::before {
        content: '';
        display: inline-block;
        transform: translate(0%, -9px);
        border-radius: 50%;
        width: 10px;
        height: 10px;
        box-sizing: border-box;
        background: #ffffff;
        border: 2px solid #e1243b;
      }
    }
  }

  .date-title {
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
    .style-default {
      padding: 0;
      line-height: $font-size-small;
      color: $font-title-color;
      font-size: $font-size-small;
      font-family: $font-family-no-number;
    }
  }
}
</style>
