<template>
  <div v-loading="loading" class="archive-detail-competition">
    <div v-if="!isEmpty" class="competition-tools">
      <span
        :class="[
          'prev',
          {
            disabled: curStagesIndex === 0,
          },
        ]"
        @click="handleChangeRound(-1)"
        v-text="'上一轮'"
      />
      <VSelect
        v-model="curStagesId"
        class="select-wrap"
        size="small"
        :options="stagesRound"
        :width="132"
      />
      <span
        :class="[
          'next',
          {
            disabled: curStagesIndex === stagesRound.length - 1,
          },
        ]"
        @click="handleChangeRound(+1)"
        v-text="'下一轮'"
      />
    </div>

    <StageList
      :stages-id="curStagesId"
      :stage-data="curStages"
      :teams="teams"
      sport-type="football"
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
      loading: false,
      stages: [],
      teams: {},
      odds: {},
      curStagesId: '',
      sourceToken: null,
      isEmpty: false,
    }
  },
  computed: {
    stagesRound() {
      return (this.stages || []).map(item => ({
        label: item.name,
        value: Number(item.id),
      }))
    },
    curStages() {
      const stageData = (this.stages || []).find(
        item => Number(item.id) === this.curStagesId
      )
      const LastData = (this.stages || [])[this.stages.length - 1]
      return stageData || LastData
    },
    curStagesIndex() {
      const stageIndex = this.stagesRound.findIndex(
        item => item.value === this.curStagesId
      )
      return ~stageIndex ? stageIndex : this.stagesRound.length - 1
    },
  },
  watch: {
    curStagesIndex(value) {
      this.curStagesId = this.stagesRound[value].value
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchSeasonMatches({
      season_id: to.query.yearId,
      event_id: to.query.eventId,
    })

    next()
  },
  mounted() {
    this.fetchSeasonMatches()
  },
  methods: {
    handleChangeRound(add) {
      this.curStagesId = this.stagesRound[this.curStagesIndex + add].value
    },
    fetchSeasonMatches(options) {
      if (!this.yearId) {
        return
      }
      this.sourceToken && this.sourceToken.cancel()

      this.sourceToken = CancelToken.source()
      this.isEmpty = false
      this.loading = true
      return this.$axios
        .get(api.get.football.fetchSeasonMatches, {
          params: {
            season_id: this.yearId,
            event_id: this.eventId,
            ...options,
          },
          cancelToken: this.sourceToken.token,
        })
        .then(({ code, data, msg }) => {
          if (code !== 0 || !data) {
            throw new Error(msg || '获取比赛信息失败')
          }

          const { teams = {} } = data
          this.stages = this.formatStages(data)
          this.teams = teams
        })
        .catch(error => {
          this.isEmpty = true
          this.stages = []
          this.teams = {}
          console.warn(error)
        })
        .finally(() => {
          this.loading = false
        })
    },
    formatStages({ stages, cur_stage: curStage }) {
      if (
        !stages ||
        !stages.length ||
        stages.every(item => !item.matchs || !item.matchs.length)
      ) {
        this.isEmpty = true
        return
      }
      let stagesList = []
      stages.forEach(item => {
        if (stages.length === 1 && ['Round'].includes(item.type)) {
          this.curStagesId = Number(item.cur_round) || 1
          const staesKeyMap = new Array(Number(item.rounds))
            .fill('')
            .map((_, index) => ({ round: index + 1 }))

          stagesList = staesKeyMap.map(({ round }) => ({
            name: `第${round}轮 ${this.curStagesId === round ? '[当前]' : ''}`,
            id: round,
            matchs: item.matchs
              .map(match => {
                return {
                  ...match,
                  round: String(match.round) === '0' ? 1 : match.round,
                }
              })
              .filter(match => Number(match.round) === round),
          }))
        } else {
          this.curStagesId = Number(curStage) || 1
          stagesList = stages.map(stage => ({
            ...stage,
            name: `${stage.name} ${
              this.curStagesId === Number(stage.id) ? '[当前]' : ''
            }`,
          }))
        }
      })

      return Object.freeze(stagesList)
    },
  },
}
</script>

<style lang="scss" scoped>
.archive-detail-competition {
  padding: 20px 14px 10px;
  position: relative;

  .competition-tools {
    background-color: #f5f5f5;
    line-height: 44px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .select-wrap {
      border-color: #ddd;
      line-height: 0;
    }

    .select-wrap /deep/ .title {
      min-width: 132px;
      padding-right: 24px;
    }

    .prev,
    .next {
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
