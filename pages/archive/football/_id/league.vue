<template>
  <div v-loading="flag" class="league-info-wrap">
    <Card title="联赛简介">
      <div class="top-info">
        <img v-lazy="icon" class="race-icon" />

        <ElInput
          v-model="raceInfo"
          type="textarea"
          readonly
          autosize
          :class="['race-ctx']"
          resize="none"
          autofocus="false"
        />

        <div v-if="!raceInfo" class="dataNone">
          <span>暂无数据</span>
        </div>
      </div>
    </Card>

    <Card title="赛季时长">
      <EventProgress :start="progress.start" :end="progress.end" />
    </Card>

    <Card title="亚冠展示">
      <div class="bottom-ctx font-style">
        <p>
          本赛季中冠军队为：<span>{{ champion }}</span>
        </p>
        <p>
          本赛季中亚军队为：<span>{{ second }}</span>
        </p>
      </div>
    </Card>
  </div>
</template>

<script>
import xss from 'xss'
import { CancelToken } from 'axios'

import api from '@/api'

import Card from '@/page-components/archive/football/league/card-info'
import EventProgress from '@/page-components/archive/event-progress'

export default {
  components: { Card, EventProgress },
  props: {
    yearId: {
      type: [Number, String],
    },
    eventId: {
      type: [Number, String],
    },
  },
  data() {
    return {
      flag: true,
      champion: '-',
      icon: '',
      second: '-',
      raceInfo: '',

      // 模拟时间
      progress: {
        start: 0,
        end: 0,
      },
      sourceToken: null,
    }
  },
  watch: {
    yearId() {
      this.fetchInfo(this.eventId)
    },
  },
  mounted() {
    this.fetchInfo(this.eventId)
  },
  methods: {
    // 清除转义字符
    clearSpecialSymbol() {
      this.raceInfo = this.raceInfo.replace(/&nbsp;/gi, '')
      this.raceInfo = this.raceInfo.replace(/&amp;/gi, '')
      this.raceInfo = xss(this.raceInfo)
    },

    // 网络请求
    fetchInfo(eventId) {
      if (!this.yearId) {
        return
      }

      this.sourceToken && this.sourceToken.cancel()

      this.sourceToken = CancelToken.source()

      this.flag = true
      return this.$axios
        .get(api.get.football.fetchInfoOfLeague, {
          params: { id: eventId },
          cancelToken: this.sourceToken.token,
        })
        .then(({ code, data }) => {
          if (code !== 0 || !data) {
            throw new Error('联赛简介暂无数据')
          }

          const {
            start_date: startDate,
            end_date: endDate,
            intro,
            icon,
          } = data.info
          this.progress.start = Number(startDate)
          this.progress.end = Number(endDate)
          this.icon = icon
          this.raceInfo = intro
          this.clearSpecialSymbol()
        })
        .catch(() => {})
        .finally(() => {
          this.flag = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.league-info-wrap {
  .dataNone {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #333;
    font-family: $font-family-no-number;
    font-size: $font-size-large;
  }

  padding: 0 18px 28px 18px;

  .top-info {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    .race-icon {
      width: 80px;
      height: 80px;
      border: 1px solid #f2f2f2;
      border-radius: 4px;
      margin-right: 15px;
    }

    .race-ctx {
      border: none;
      line-height: 24px;
      outline: none;
      display: block;
      flex: 1;
    }
  }

  .top-info /deep/ textarea.el-textarea__inner {
    border: none;
    line-height: 24px;
    color: $font-title-color;
    font-family: $font-family-no-number;
    font-size: $font-size-small;
    padding: 0;
  }

  .font-style {
    span {
      font-weight: bold;
    }

    color: $font-title-color;
    font-family: $font-family-no-number;
    font-size: $font-size-small;
  }
}
</style>
