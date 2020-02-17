<template>
  <div class="hda-list-table">
    <div class="table-header-box">
      <ul ref="tableHeader" class="table-header">
        <li
          v-for="column of columns"
          :key="column.key"
          :class="[
            'column',
            { 'has-border': column.border, 'tree-box': column.hasTree },
          ]"
          :style="{ width: `${column.width}px` }"
        >
          <template v-if="column.hasTree">
            <span v-for="title of column.titles" :key="title" v-text="title" />
          </template>
          <template v-else>
            {{ column.title }}
          </template>
        </li>
      </ul>
    </div>

    <ul class="table-body">
      <template v-for="(item, index) of hadList">
        <li v-if="!hiddenList.includes(item.id)" :key="index" class="row">
          <div
            v-for="column of columns"
            :key="column.key"
            :class="['column', column.key, { 'has-border': column.border }]"
            :style="{ width: `${column.width}px` }"
          >
            <template v-if="['checkbox'].includes(column.key)">
              <input
                v-model="checkedList"
                :value="item.id"
                class="m-checkbox"
                type="checkbox"
              />
            </template>

            <template v-else-if="['companyName', 'time'].includes(column.key)">
              {{ item[column.key] }}
            </template>

            <template v-else-if="['kelly'].includes(column.key)">
              <!-- <div
                v-if="[0, 1].includes(oddType)"
                :class="['initial', 'tree-box', { 'no-border': oddType === 1 }]"
              >
                <span>{{ item.initial.hKelly }}</span>
                <span>{{ item.initial.gKelly }}</span>
              </div>
              <div
                v-if="[0, 2].includes(oddType)"
                :class="['instant', 'tree-box', { 'no-border': oddType === 1 }]"
              >
                <span>{{ item.instant.hKelly }}</span>
                <span>{{ item.instant.gKelly }}</span>
              </div> -->

              <div
                v-if="[0, 1].includes(oddType)"
                :class="['initial', { 'no-border': oddType === 1 }]"
              >
                -
              </div>

              <div
                v-if="[0, 2].includes(oddType)"
                :class="['instant', { 'no-border': oddType === 1 }]"
              >
                -
              </div>
            </template>

            <template v-else-if="column.hasTree">
              <div
                v-if="[0, 1].includes(oddType)"
                :class="['initial', 'tree-box', { 'no-border': oddType === 1 }]"
              >
                <span v-for="key of column.keys" :key="key">
                  {{
                    ['returnRate'].includes(key)
                      ? `${item.initial[key]}%`
                      : item.initial[key]
                  }}
                </span>
              </div>
              <div v-if="[0, 2].includes(oddType)" class="instant tree-box">
                <HdaListPopover
                  :company="item.company"
                  :keys="column.keys"
                  :initial="item.initial"
                  :instant="item.instant"
                  :team-name="teamName"
                  :fetch-class-type="fetchClassType"
                />
              </div>
            </template>

            <template v-else>
              <div
                v-if="[0, 1].includes(oddType)"
                :class="['initial', { 'no-border': oddType === 1 }]"
              >
                {{
                  ['hRate', 'gRate'].includes(column.key)
                    ? `${item.initial[column.key]}%`
                    : item.initial[column.key]
                }}
              </div>

              <div
                v-if="[0, 2].includes(oddType)"
                :class="[
                  'instant',
                  ['hRate', 'gRate'].includes(column.key)
                    ? ''
                    : fetchClassType(
                        item.initial[column.key],
                        item.instant[column.key]
                      ),
                ]"
              >
                {{
                  ['hRate', 'gRate'].includes(column.key)
                    ? `${item.instant[column.key]}%`
                    : item.instant[column.key]
                }}
              </div>
            </template>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import HdaListPopover from './hda-list-popover'

const COLUMNS_LIST = [
  { title: '', width: 39, key: 'checkbox', border: true },
  { title: '所有公司', width: 110, key: 'companyName', border: true },
  {
    titles: ['主胜', '客胜', '返还率'],
    width: 360,
    hasTree: true,
    keys: ['h', 'g', 'returnRate'],
    border: true,
  },
  { title: '主胜率', width: 110, key: 'hRate' },
  { title: '客胜率', width: 110, key: 'gRate', border: true },
  { title: '凯利指数', width: 140, key: 'kelly', border: true },
  { title: '变化时间', width: 100, key: 'time' },
]

export default {
  components: {
    HdaListPopover,
  },
  props: {
    oddType: {
      type: Number,
      default: 0,
    },
    hadList: {
      type: Array,
      default: () => [],
    },
    hiddenList: {
      type: Array,
      default: () => [],
    },
    isFixed: {
      type: Boolean,
      default: false,
    },
    teamName: String,
    onChangeChecked: {
      type: Function,
      default: () => {},
    },
    onChangeHiddenList: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      checkedList: [],
    }
  },
  computed: {
    columns: () => COLUMNS_LIST,
  },
  watch: {
    checkedList(value) {
      this.onChangeChecked(value)
    },
    isFixed(value) {
      if (value) {
        this.addScrollListen()
      } else {
        this.removeScrollListen()
      }
    },
  },
  mounted() {
    if (this.isFixed) {
      this.addScrollListen()
    }
  },
  beforeDestroy() {
    this.removeScrollListen()
  },
  methods: {
    addScrollListen() {
      this.listenTop()
      document.addEventListener('scroll', this.listenTop)
    },
    removeScrollListen() {
      this.$refs.tableHeader.classList.remove('fixed')
      document.removeEventListener('scroll', this.listenTop)
    },
    listenTop() {
      const $header = this.$refs.tableHeader
      const offsetTop = this.$el.offsetTop

      if (window.scrollY - offsetTop >= 0) {
        $header.classList.add('fixed')
      } else {
        $header.classList.remove('fixed')
      }
    },
    handleChangeChecked(id, e) {
      this.onChangeChecked(id, e.target.checked)
    },
    fetchClassType(initial, instant) {
      if (parseFloat(initial) > parseFloat(instant)) {
        return 'green'
      }
      if (parseFloat(initial) < parseFloat(instant)) {
        return 'red'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.hda-list-table {
  text-align: center;
  border-left: 1px solid #efefef;
  border-right: 1px solid #efefef;
  .tree-box {
    display: flex;
    > span {
      flex: 1;
    }
  }
  .table-header-box {
    height: 45px;
  }
  .table-header {
    line-height: 45px;
    color: #666666;
    background-color: #f5f5f5;
    display: flex;
    .has-border {
      border-right: 1px solid #fff;
    }
    &.fixed {
      position: fixed;
      z-index: 2;
      top: 0;
    }
  }
  .table-body {
    font-size: 12px;
    .row {
      display: flex;
      border-bottom: 1px solid #efefef;
      &:nth-of-type(even) {
        background-color: #f5f5f5;
      }
      &:nth-of-type(odd) {
        background-color: $color-white;
      }
      .checkbox,
      .companyName,
      .time {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .initial {
      border-bottom: 1px solid #efefef;
      &.no-border {
        border-bottom: none;
      }
    }
    .initial,
    .instant {
      line-height: 30px;
    }
    .red {
      color: #e1243b;
    }
    .green {
      color: #00a54f;
    }
    .has-border {
      border-right: 1px solid #efefef;
    }
  }
}
</style>
