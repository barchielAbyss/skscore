<template>
  <ElPopover
    ref="popover"
    :visible-arrow="false"
    :open-delay="500"
    :popper-options="{
      boundariesElement: 'body',
      removeOnDestroy: true,
    }"
    trigger="hover"
    placement="bottom"
    width="420"
    popper-class="components-popover-score"
    @show="fetchMatchStat"
  >
    <div slot="reference" class="score-title">
      <p
        slot="reference"
        :class="[!row.isStart ? 'default-color' : 'active-color']"
      >
        <span v-text="!row.isStart ? '' : row.score.home" />
        <span>-</span>
        <span v-text="!row.isStart ? '' : row.score.guest" />
      </p>
    </div>
    <ScorePopover
      v-loading="loading"
      :row="row"
      :stat="statInfo"
      :status-type="statusType"
    />
  </ElPopover>
</template>

<script>
import api from '@/api'
import ScorePopover from './popover'

export default {
  components: {
    ScorePopover,
  },
  props: {
    row: Object,
    statusType: [String, Number],
  },
  data() {
    return {
      statInfo: null,
      loading: false,
    }
  },
  methods: {
    fetchMatchStat() {
      this.loading = true
      if (this.statInfo) {
        this.loading = false
        return Promise.resolve(this.statInfo)
      }
      this.$axios
        .get(api.get.football.fetchMatchStat, {
          params: { match_id: this.row.id, chupan: 1 },
        })
        .then(({ code, data, msg }) => {
          if (code !== 0 || !data) {
            throw new Error(msg)
          }

          this.statInfo = data
          this.$nextTick(() => {
            this.$refs.popover.updatePopper()
          })
        })
        .catch(() => {
          this.statInfo = {}
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.score-title {
  font-weight: bold;
  cursor: pointer;
  .gold {
    background: none;
    color: $color-active;
  }
  .gary {
    font-size: 12px;
    color: #aaa;
    line-height: 14px;
  }

  .active-color {
    color: #333;
  }

  .default-color {
    color: #999;
  }
}
</style>

<style lang="scss">
.components-popover-score {
  background-color: $color-white;
  box-shadow: 0 0 6px 1px rgba(51, 51, 51, 0.14);
  border-radius: 4px;
  padding: 0;
  z-index: 51 !important;

  &.el-popper[x-placement^='bottom'] {
    margin-top: 6px;
  }

  &.el-popper[x-placement^='top'] {
    margin-bottom: 6px;
  }
}
</style>
