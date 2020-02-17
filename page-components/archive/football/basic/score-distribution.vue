<template>
  <div v-loading="flag" class="score-distribution-wrap">
    <div class="score-section">
      <div class="score-details victory">
        <p class="title box-style">胜</p>
        <ShowScoreBox
          v-for="item of mockData.victory"
          :key="item.score"
          :score="item.score"
          :count="item.num"
          :max="remindCtx.count"
        />
      </div>

      <div class="score-details tie">
        <p class="title box-style">平</p>
        <ShowScoreBox
          v-for="item of mockData.tie"
          :key="item.score"
          :score="item.score"
          :count="item.num"
          :max="remindCtx.count"
        />
      </div>

      <div class="score-details defeat">
        <p class="title box-style">负</p>
        <ShowScoreBox
          v-for="item of mockData.defeat"
          :key="item.score"
          :score="item.score"
          :count="item.num"
          :max="remindCtx.count"
        />
      </div>
    </div>

    <div class="bottom">
      <VIcon name="light" class="remind-icon" />
      <span class="bottom-span-ctx">
        本赛季共进行了
        <span class="span-remind">{{ remindCtx.total }}</span>
        场比赛，其中比分最常见的为
        <span v-for="(item, index) of remindCtx.score" :key="index">
          <span class="span-remind">{{ item.score }}</span>
          {{ remindCtx.score.length === index + 1 ? '' : ' , ' }}</span
        >
        , 一共出现过
        <span class="span-remind">{{ remindCtx.count }}</span>
        次
      </span>
    </div>
  </div>
</template>

<script>
import { CancelToken } from 'axios'

import api from '@/api'

import VIcon from '@/components/icon'
import ShowScoreBox from './show-score-box'

export default {
  components: { VIcon, ShowScoreBox },
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
      remindCtx: { total: 0, score: [], count: 0 },
      mockData: { victory: [], tie: [], defeat: [] },
      flag: true,
      sourceToken: null,
    }
  },
  watch: {
    yearId: {
      immediate: true,
      handler(value) {
        if (value) {
          this.fetchScoreDistribution(this.eventId, value)
        }
      },
    },
  },
  methods: {
    // 获取比分分布
    fetchScoreDistribution(eventId, yearId) {
      if (!yearId) {
        return
      }
      this.sourceToken && this.sourceToken.cancel()

      this.sourceToken = CancelToken.source()
      this.flag = true
      this.$axios
        .get(api.get.football.fetchScoreDistributionOfSeason, {
          params: {
            event_id: eventId,
            season_id: yearId,
          },
          cancelToken: this.sourceToken.token,
        })
        .then(({ code, data }) => {
          if (code !== 0 || !data) {
            throw new Error('比分分布暂无数据')
          }
          const { draws, wins, loses, total } = data
          this.mockData.victory = wins
          this.mockData.defeat = loses
          this.mockData.tie = draws
          this.remindCtx.total = total

          const obj = this.handleData(draws.concat(wins).concat(loses))
          this.remindCtx.score = obj.arr
          this.remindCtx.count = obj.max
        })
        .catch(() => {
          this.mockData = { victory: [], tie: [], defeat: [] }
          this.remindCtx = { total: 0, score: [], count: 0 }
        })
        .finally(() => {
          this.flag = false
        })
    },

    // 处理返回数组
    handleData(tar = []) {
      let flag = false
      const arr = []

      const max = Math.max(...tar.map(item => item.num)) // 获得出现次数的最大值

      const maxItem = tar.filter(item => item.num === max) // 筛选出现次数最多的对象（可能有多个）

      // 只保留一个"其他"类型的 score，并放入数组最末
      maxItem.forEach(obj => {
        if (obj.score !== '其他') {
          arr.push(obj)
        } else {
          flag = true // flag = true，表示 "其他" 类型出现
        }
      })

      if (flag) {
        arr.push({ score: '其他', num: max })
      }

      return { arr, max }
    },
  },
}
</script>

<style lang="scss" scoped>
.score-distribution-wrap {
  .box-style {
    width: 252px;
    height: 45px;
    text-align: center;
  }

  .score-section {
    display: flex;
    justify-content: space-between;

    .score-details {
      p.title {
        font-size: $font-size-large;
        color: $color-white;
        font-weight: bold;
        font-family: $font-family-no-number;
        line-height: 45px;
      }
    }

    .victory {
      p.title {
        background-color: #e1243b;
      }
    }

    .defeat {
      p.title {
        background-color: #00a54f;
      }
    }

    .tie {
      p.title {
        background-color: #808290;
      }
    }
  }

  .bottom {
    margin-top: 20px;

    .span-remind {
      color: #e1243b;
    }

    .bottom-span-ctx {
      font-size: $font-size-small;
      font-family: $font-family-no-number;
      color: $font-title-color;
    }

    .remind-icon {
      margin-right: 5px;
      color: #ffbe52;
      font-size: 16px;
    }
  }
}
</style>
