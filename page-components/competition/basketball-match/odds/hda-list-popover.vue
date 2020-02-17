<template>
  <div
    class="intelligence-match-odds-hda-list-porpover"
    @mouseenter="fetchHistoryList"
    @mouseleave="showPopover = false"
  >
    <div
      v-show="showPopover"
      ref="elPopover"
      v-loading="loading"
      class="porpover-main"
    >
      <div class="title">{{ company.name }}</div>
      <table class="table-list">
        <tbody>
          <tr v-for="(item, index) of historyList" :key="index">
            <td :class="item.valueState.h">{{ item.h }}</td>
            <td :class="item.valueState.g">{{ item.g }}</td>
            <td :class="item.valueState.returnRate">{{ item.returnRate }}%</td>
            <td>{{ item.time }}</td>
          </tr>
          <tr v-if="historyList && historyList.length === 10">
            <td colspan="5">
              <a :href="historyInfoUrl" target="_blank">点击指数查看更多变化</a>
            </td>
          </tr>
          <tr v-if="initialHda">
            <td>{{ initialHda.h }}</td>
            <td>{{ initialHda.g }}</td>
            <td>{{ initialHda.returnRate }}%</td>
            <td>{{ initialHda.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div slot="reference" class="tree-box">
      <a
        v-for="key of keys"
        :key="key"
        :href="historyInfoUrl"
        target="_blank"
        :class="[
          'item',
          ['returnRate'].includes(key)
            ? ''
            : fetchClassType(initial[key], instant[key]),
        ]"
      >
        <ValueChange
          class="value"
          :value="instant[key]"
          :format="formatValue(key)"
        />
      </a>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { debounce } from 'lodash'

import api from '@/api'
import ValueChange from '@/components/value-change'

export default {
  components: {
    ValueChange,
  },
  props: {
    company: {
      type: Object,
    },
    keys: {
      type: Array,
    },
    initial: {
      type: Object,
    },
    instant: {
      type: Object,
    },
    fetchClassType: {
      type: Function,
    },
    teamName: String,
  },
  data() {
    return {
      loading: false,
      showPopover: false,
      historyList: null,
      initialHda: null,
      position: {},
    }
  },
  computed: {
    historyInfoUrl() {
      return this.$router.resolve({
        name: 'competition-odds-company',
        query: {
          category: 2,
          id: this.$route.params.id,
          companyId: this.company.id,
          teamName: this.teamName,
          companyType: 'hda',
        },
      }).href
    },
  },
  mounted() {
    this.$el.addEventListener('mousemove', this.fetchMousePosition, false)
  },
  beforeDestroy() {
    this.$el.removeEventListener('mousemove', this.fetchMousePosition, false)
  },
  methods: {
    formatValue(key) {
      return value => (~key.indexOf('Rate') ? `${value}%` : value)
    },
    fetchHistoryList: debounce(function() {
      this.showPopover = true

      this.loading = true
      this.$axios
        .get(api.get.basketball.fetchMatchHdaHistory, {
          params: {
            match_id: this.$route.params.id,
            company_id: this.company.id,
            size: 10,
          },
        })
        .then(({ code, data, msg }) => {
          if (code !== 0) {
            throw new Error(msg)
          }

          const { odds } = data

          this.historyList = this.formatList(odds)
          this.loading = false
        })
        .catch(() => {
          this.historyList = []
          this.loading = false
        })
    }, 800),
    fetchMousePosition(event) {
      const $elPopover = this.$refs.elPopover
      const $elClientRect = this.$el.getBoundingClientRect()

      this.position = {
        left: `${event.clientX - $elClientRect.left}px`,
      }

      if (
        !$elPopover ||
        event.clientX >= $elClientRect.x + $elClientRect.width
      ) {
        return
      }
      $elPopover.style.left = this.position.left
    },
    formatList(history) {
      const initial = history[history.length - 1]
      const historyList = history
        .filter((item, index) => index !== history.length - 1 && index < 10)
        .map(item => {
          const itemValue = {
            h: Number(item.h).toFixed(2),
            g: Number(item.g).toFixed(2),
          }

          return {
            ...itemValue,
            returnRate: this.fetchReturnRate(itemValue),
            time: dayjs(Number(item.date)).format('MM-DD HH:mm'),
          }
        })

      this.initialHda = {
        h: initial.h,
        g: initial.g,
        returnRate: this.fetchReturnRate({
          h: initial.h,
          g: initial.g,
        }),
        time: dayjs(Number(initial.date)).format('MM-DD HH:mm'),
      }

      return historyList.map((item, index) => {
        const next = historyList[index + 1] || this.initialHda

        const { h: nh, g: ng } = next
        const { h, g } = item

        return {
          ...item,
          valueState: {
            h: this.fetchState(h, nh),
            g: this.fetchState(g, ng),
          },
        }
      })
    },
    fetchReturnRate({ h, g }) {
      return Number((1 / (1 / h + 1 / g)) * 100).toFixed(2)
    },
    fetchState(value, otherValue) {
      if (Number(value) === Number(otherValue)) {
        return ''
      }
      if (Number(value) > Number(otherValue)) {
        return 'red'
      }
      if (Number(value) < Number(otherValue)) {
        return 'green'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.intelligence-match-odds-hda-list-porpover {
  font-size: 12px;
  position: relative;
  width: 100%;

  .tree-box {
    display: flex;
    .item {
      flex: 1;
      .value {
        padding-left: 7px;
      }
    }
  }
  .red {
    color: #e1243b;
  }
  .green {
    color: #00a54f;
  }
}

.porpover-main {
  width: 320px;
  top: 100%;
  position: absolute;
  z-index: 1;
  background-color: $color-white;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  word-break: break-all;

  .title {
    color: $color-white;
    line-height: 36px;
    background: #4c516a;
    border-radius: 8px 8px 0 0;
    text-align: center;
  }
  .table-list {
    line-height: 30px;
    width: 100%;
    text-align: center;
    border-radius: 8px 8px 0 0;
    overflow: hidden;
    tr {
      &:nth-of-type(even) {
        background-color: #f5f5f5;
      }
      &:nth-of-type(odd) {
        background-color: $color-white;
      }
    }
    td {
      min-width: 3em;
    }
  }
}
</style>
