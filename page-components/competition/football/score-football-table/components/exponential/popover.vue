<template>
  <div class="exponential-popover">
    <PopsTitle :home="row.home" :guest="row.guest" />
    <table class="exponential-list">
      <thead>
        <tr>
          <th v-for="(name, key) of columns" :key="key" v-text="name" />
        </tr>
      </thead>

      <tbody>
        <tr v-for="(rowName, rowKey) of rows" :key="rowKey">
          <td v-for="(name, key) of columns" :key="key" :class="key">
            <span v-if="key === 'odds'" :class="key" v-text="rowName" />

            <span v-else-if="rowKey === 'ah'" class="yield-item">
              <ValueChange
                :disabled="isDisabledWatch"
                :value="key === 'instant' ? ah.h : ah.hi"
                :init-value="ah.hi"
              />
              <ValueChange
                :disabled="isDisabledWatch"
                :value="key === 'instant' ? ah.l : ah.li"
                :format="fetchAhYield"
                :init-value="ah.li"
              />
              <ValueChange
                :disabled="isDisabledWatch"
                :value="key === 'instant' ? ah.g : ah.gi"
                :init-value="ah.gi"
              />
            </span>

            <span v-else-if="rowKey === 'hda'" class="yield-item">
              <ValueChange
                :disabled="isDisabledWatch"
                :value="key === 'instant' ? hda.w : hda.wi"
                :init-value="hda.wi"
              />
              <ValueChange
                :disabled="isDisabledWatch"
                :value="key === 'instant' ? hda.d : hda.di"
                :init-value="hda.di"
              />
              <ValueChange
                :disabled="isDisabledWatch"
                :value="key === 'instant' ? hda.l : hda.li"
                :init-value="hda.li"
              />
            </span>

            <span v-else-if="rowKey === 'ou'" class="yield-item">
              <ValueChange
                :disabled="isDisabledWatch"
                :value="key === 'instant' ? ou.b : ou.bi"
                :init-value="ou.bi"
              />
              <ValueChange
                :disabled="isDisabledWatch"
                :value="key === 'instant' ? ou.t : ou.ti"
                :format="fetchOuYield"
                :init-value="ou.ti"
              />
              <ValueChange
                :disabled="isDisabledWatch"
                :value="key === 'instant' ? ou.s : ou.si"
                :init-value="ou.si"
              />
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { footballAhYield, footballOuYield } from '@/utils/status'

import ValueChange from '@/components/value-change'
import PopsTitle from '../pops-title'

const TABLE_COLUMN = {
  odds: '赔率',
  instant: '即时指数(全场)',
  initial: '初盘指数(全场)',
}

const TABLE_ROW = {
  ah: '亚盘',
  hda: '欧盘',
  ou: '大小球',
}

export default {
  components: {
    PopsTitle,
    ValueChange,
  },
  props: {
    row: Object,
  },
  computed: {
    columns: () => TABLE_COLUMN,
    rows: () => TABLE_ROW,
    ah() {
      return this.row.exponential.ah
    },
    ou() {
      return this.row.exponential.ou
    },
    hda() {
      return this.row.exponential.hda
    },
    isDisabledWatch() {
      return this.$route.query.timeType !== 'now'
    },
  },
  methods: {
    fetchAhYield(value) {
      const yieldValue = footballAhYield(value)
      return yieldValue === '-' ? '' : yieldValue
    },
    fetchOuYield(value) {
      const yieldValue = footballOuYield(value)
      return yieldValue === '-' ? '' : yieldValue
    },
  },
}
</script>

<style lang="scss" scoped>
.exponential-popover {
  padding: 0 14px 14px;
  width: 374px;
  font-size: $font-size-small;
  background-color: $color-white;
  box-shadow: 0 0 6px 1px rgba(51, 51, 51, 0.14);
  border-radius: 4px;
  overflow: hidden;
  z-index: 2002;

  .exponential-list {
    width: 100%;
    border-bottom: 1px $color-tab-border solid;
    text-align: center;
    line-height: 32px;
    td {
      border-left: 1px $color-tab-border solid;
      border-right: 1px $color-tab-border solid;
    }
    thead {
      tr {
        border: 1px #f9f9f9 solid;
        background-color: #f9f9f9;
        color: #666;
        th {
          font-weight: normal;
        }
      }
    }
    tbody {
      tr {
        &:nth-of-type(even) {
          background-color: #f9f9f9;
        }
        &:nth-of-type(odd) {
          background-color: $color-white;
        }
      }
    }
    .odds {
      width: 48px;
    }
    .instant {
      width: 161px;
    }
    .initial {
      width: 161px;
    }
    .yield-item {
      display: flex;
      justify-content: center;
      padding: 0 9px;
      > span {
        white-space: nowrap;
        &:last-of-type {
          border: none;
        }
        &.is-up {
          color: #e1243b;
        }
        &.is-down {
          color: #00a54f;
        }
      }
    }
  }
}
</style>
