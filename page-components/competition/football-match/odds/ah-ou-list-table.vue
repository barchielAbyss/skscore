<template>
  <table class="ah-ou-list-table">
    <thead>
      <tr>
        <template v-for="column of columns">
          <th
            v-if="!column.children"
            :key="column.key"
            :style="{ width: `${column.width}px` }"
            rowspan="2"
            v-text="column.title"
          />

          <th
            v-if="column.children"
            :key="column.key"
            :style="{ width: `${column.width}px` }"
            :colspan="column.children.length"
            v-text="column.title"
          />
        </template>
      </tr>
      <tr>
        <template v-for="column of columns">
          <template v-if="column.children">
            <th
              v-for="cItem of column.children"
              :key="cItem.key"
              :style="{ width: `${cItem.width}px` }"
              v-text="cItem.title"
            />
          </template>
        </template>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(item, index) of dataList" :key="index">
        <template v-for="column of columns">
          <td
            v-if="!column.children"
            :key="column.key"
            v-html="item[column.key]"
          />
          <template v-if="column.children">
            <td
              v-for="cItem of column.children"
              :key="cItem.key"
              :class="[
                item.valueState[cItem.key],
                {
                  max: showTag.max
                    ? statistical.max[cItem.key] === item[cItem.key]
                    : false,
                  min: showTag.min
                    ? statistical.min[cItem.key] === item[cItem.key]
                    : false,
                },
              ]"
            >
              <ValueChange
                class="value"
                :value="item[cItem.key]"
                :format="fetchFormat(cItem.key)"
              />
            </td>
          </template>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { footballOuYield, footballAhYield } from '@/utils/status'

import ValueChange from '@/components/value-change'

export default {
  components: {
    ValueChange,
  },
  props: {
    columns: Array,
    dataList: Array,
    showTag: Object,
    statistical: {
      type: Object,
      validator(value) {
        return ['max', 'min'].every(key =>
          Object.prototype.hasOwnProperty.call(value, key)
        )
      },
    },
  },
  methods: {
    fetchFormat(key) {
      if (['t', 'ti'].includes(key)) {
        return value => footballOuYield(value)
      }

      if (['l', 'li'].includes(key)) {
        return value => footballAhYield(value)
      }

      return value => value
    },
  },
}
</script>

<style lang="scss" scoped>
.ah-ou-list-table {
  font-size: 12px;
  text-align: center;
  thead {
    font-size: 13px;
    line-height: 28px;
    tr {
      background-color: #f5f5f5;
      th {
        font-weight: normal;
        border: 1px solid $color-white;
      }
    }
  }

  tbody {
    line-height: 36px;
    tr {
      &:nth-of-type(even) {
        background-color: #f5f5f5;
      }
      &:nth-of-type(odd) {
        background-color: $color-white;
      }
      td {
        border: 1px solid #efefef;
        .value {
          padding-left: 12px;
        }
        &:first-of-type {
          border-left-color: $color-white;
        }
        &:last-of-type {
          border-right-color: $color-white;
        }
        &.red {
          color: #e1243b;
        }
        &.green {
          color: #00a54f;
        }
        &.min {
          background-color: #ebf8f1;
        }
        &.max {
          background-color: #fbeff0;
        }
      }
    }
  }
}
</style>
