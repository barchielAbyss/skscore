<template>
  <ElPopover
    :open-delay="500"
    :visible-arrow="false"
    :popper-options="{
      boundariesElement: 'body',
      removeOnDestroy: true,
    }"
    placement="bottom"
    trigger="hover"
    width="380"
    popper-class="components-popover-score"
    @show="fetchMatchExponential"
  >
    <ExponentialCountent slot="reference" :row="row" />
    <ExponentialPopover :row="row" />
  </ElPopover>
</template>

<script>
import { mapActions } from 'vuex'

import api from '@/api'
import { exponentialArray2Object } from '@/utils/getOdds2Object'
import ExponentialCountent from './content'
import ExponentialPopover from './popover'

export default {
  components: {
    ExponentialCountent,
    ExponentialPopover,
  },
  props: {
    row: {
      type: Object,
    },
  },
  data() {
    return {
      isFetchData: false,
    }
  },
  computed: {},
  methods: {
    ...mapActions('competition-football', ['OnChangeScoreList']),
    fetchMatchExponential() {
      if (this.isFetchData) {
        return Promise.resolve()
      }
      return this.$axios
        .get(api.get.common.fetchMatchOdds, {
          params: {
            category: 1,
            match_id: this.row.id,
            company: this.$route.query.company || '皇冠',
          },
        })
        .then(({ code, data, msg }) => {
          if (code !== 0) {
            throw new Error(msg)
          }

          this.isFetchData = true

          const formatData = exponentialArray2Object(data)

          this.OnChangeScoreList({
            ids: [this.row.id],
            newValue: {
              exponential: formatData,
            },
          })
        })
        .catch(() => {
          return false
        })
    },
  },
}
</script>
