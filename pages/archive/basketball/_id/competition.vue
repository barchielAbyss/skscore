<template>
  <div v-loading="loading" class="basketball-competition">
    <div v-if="stages.length" class="competition-tools">
      <button
        :class="['prev', 'btn-default', { disabled: prevLock }]"
        @click="handleClick(0)"
        v-text="'上一轮'"
      />

      <VSelect
        v-model="curValue"
        class="select-wrap"
        size="small"
        :options="opts"
        :width="132"
        @change="handleChange"
      />

      <button
        :class="['next', 'btn-default', { disabled: nextLock }]"
        @click="handleClick(1)"
        v-text="'下一轮'"
      />
    </div>

    <StageList
      :stages-id="curValue"
      :stage-data="curMatchesGroup"
      :teams="teamList"
      sport-type="basketball"
      class="competition-list"
    />
  </div>
</template>

<script>
import { CancelToken } from 'axios'
import api from '@/api'

import StageList from '@/page-components/archive/stage-list'

import VSelect from '@/components/popover-select'

export default {
  components: {
    VSelect,
    StageList,
  },
  props: {
    yearId: [String, Number],
    eventId: [String, Number],
  },
  data() {
    return {
      stages: [],
      sourceToken: null,
      teamList: {},
      curValue: '',
      curMatchesGroup: { matchs: [] },
      opts: [],
      prevLock: true,
      nextLock: true,
      odds: {},
      recordCurValue: null,
      oddsTemp: [],
      oddsTempLen: 0,
      loading: true,
    }
  },
  watch: {
    yearId() {
      this.fetchMatchList(this.yearId, this.eventId)
    },
    eventId() {
      this.fetchMatchList(this.yearId, this.eventId)
    },
  },
  mounted() {
    this.fetchMatchList(this.yearId, this.eventId)
  },
  methods: {
    // 获取篮球比赛赛程列表
    fetchMatchList(seasonId, eventId) {
      this.loading = true
      this.sourceToken && this.sourceToken.cancel()
      this.sourceToken = CancelToken.source()
      this.$axios
        .get(api.get.basketball.fetchBasketballMatch, {
          params: { event_id: eventId, season_id: seasonId },
          cancelToken: this.sourceToken.token,
        })
        .then(({ code, data }) => {
          if (!data || code !== 0) {
            throw new Error('暂无数据-资料库-篮球-赛程')
          }
          const { cur_stage: curStage, teams, stages } = data
          this.stages = stages
          this.teamList = teams

          this.curValue = curStage
          if (curStage === '0') {
            this.curValue = this.stages[0].id
          }
          this.opts = this.fetchIDArrayOfMatch(stages)
          this.isLockButton(this.curValueIndex())
          this.curMatchesGroup = this.selectedMatchesGroup(curStage)
        })
        .catch(error => {
          this.opts = []
          this.curValue = ''
          this.isLockButton(this.curValue)
          this.stages = []
          this.teamList = {}
          this.curMatchesGroup = { matchs: [] }
          console.warn(error)
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 返回下拉框选项数组
    fetchIDArrayOfMatch(arr = []) {
      return arr.map(item => ({ label: item.name, value: item.id }))
    },

    // 选择比赛步骤
    handleClick(flag) {
      let arrIndex = this.curValueIndex()

      if (flag) {
        if (arrIndex < this.opts.length) {
          arrIndex++
        }
      } else if (arrIndex > 1) {
        arrIndex--
      }

      this.isLockButton(arrIndex)
      this.curValue = this.opts[arrIndex - 1].value
      this.curMatchesGroup = this.selectedMatchesGroup(
        this.opts[arrIndex - 1].value
      )
    },

    // 返回当前 curValue 的序号 （下标 + 1）
    curValueIndex() {
      let arrIndex
      this.opts.forEach((item, index) => {
        if (item.value === this.curValue) {
          arrIndex = index + 1
        }
      })
      return arrIndex
    },

    // 判断当前两个按钮是否激活
    isLockButton(arrIndex) {
      if (arrIndex === '') {
        this.prevLock = true
        this.nextLock = true
        return 0
      }

      if (arrIndex === this.opts.length) {
        this.nextLock = true
      } else {
        this.nextLock = false
      }

      if (arrIndex === 1) {
        this.prevLock = true
      } else {
        this.prevLock = false
      }
    },

    // 选择比赛步骤
    handleChange(value) {
      if (this.recordCurValue === value) {
        return
      }
      this.curValue = value
      this.recordCurValue = value
      this.isLockButton(this.curValueIndex())
      this.curMatchesGroup = this.selectedMatchesGroup(value)
    },

    // 选择当前比赛的所有场次 matches
    selectedMatchesGroup(target) {
      if (target === '0' && this.stages.length) {
        target = this.stages[0].id
      }
      let arr = this.stages.find(item => item.id === target)
      if (!arr) {
        arr = this.stages[0]
        this.curValue = this.stages[0].id
        this.isLockButton(this.curValueIndex())
      }
      return arr
    },
  },
}
</script>

<style lang="scss" scoped>
.basketball-competition {
  padding: 20px 14px;
  position: relative;

  .competition-tools {
    background-color: #f5f5f5;
    line-height: 44px;
    height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .select-wrap {
      border-color: #ddd; // 当背景色为 #f5f5f5 时，重置边框颜色
      line-height: 0; // 避免父级样式干扰
    }

    .select-wrap /deep/ .title {
      width: 132px; // 下拉框内文本过多时，手动设置宽度
    }

    .btn-default {
      outline: none;
      border: none;
      background-color: transparent;
    }

    .prev,
    .next {
      text-align: left;
      width: 180px;
      cursor: pointer;
      &:hover {
        color: $color-active;
      }
      &.disabled {
        pointer-events: none;
        color: #cfcfcf;
      }
    }
    .prev {
      text-align: right;
    }
  }
}
</style>
