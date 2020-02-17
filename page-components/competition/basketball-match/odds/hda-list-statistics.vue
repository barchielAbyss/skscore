<template>
  <div class="hda-list-statistics">
    <div ref="fixedBox" class="card">
      <div class="statistics-header">
        <label>
          <input
            v-model="localIsFixed"
            class="m-checkbox"
            type="checkbox"
            @change="handleChangeFixed"
          />
          头尾浮动
        </label>
      </div>

      <div class="statistics-table">
        <ul class="table-header">
          <li
            v-for="column of columns"
            :key="column.key"
            :class="['column', { 'has-border': column.border }]"
            :style="{ width: `${column.width}px` }"
            v-text="column.title"
          />
        </ul>

        <ul class="table-body">
          <li v-for="(item, index) of tableData" :key="index" class="row">
            <div
              v-for="column of columns"
              :key="column.key"
              :class="['column', column.key, { 'has-border': column.border }]"
              :style="{ width: `${column.width}px` }"
            >
              <template v-if="['title'].includes(column.key)">
                <span :class="item.className">
                  {{ item[column.key] }}
                  <VIcon class="title-icon" :name="item.icon" />
                </span>
              </template>
              <template v-else-if="['type'].includes(column.key)">
                <div
                  v-if="[0, 1].includes(oddType)"
                  :class="['initial', { 'no-border': oddType === 1 }]"
                >
                  初盘
                </div>
                <div v-if="[0, 2].includes(oddType)" class="instant">
                  即时
                </div>
              </template>
              <template v-else-if="['kelly'].includes(column.key)">
                <!-- <div
                  v-if="[0, 1].includes(oddType)"
                  :class="[
                    'initial',
                    'kelly-box',
                    { 'no-border': oddType === 1 },
                  ]"
                >
                  <span>{{ item.initial.hKelly }}</span>
                  <span>{{ item.initial.gKelly }}</span>
                </div>
                <div v-if="[0, 2].includes(oddType)" class="instant kelly-box">
                  <span>{{ item.instant.hKelly }}</span>
                  <span>{{ item.instant.gKelly }}</span>
                </div> -->

                <div
                  v-if="[0, 1].includes(oddType)"
                  :class="['initial', { 'no-border': oddType === 1 }]"
                >
                  -
                </div>

                <div v-if="[0, 2].includes(oddType)" class="instant">
                  -
                </div>
              </template>
              <template v-else>
                <div
                  v-if="[0, 1].includes(oddType)"
                  :class="['initial', { 'no-border': oddType === 1 }]"
                >
                  {{
                    ['returnRate', 'hRate', 'gRate'].includes(column.key)
                      ? `${item.initial[column.key]}%`
                      : item.initial[column.key]
                  }}
                </div>
                <div
                  v-if="[0, 2].includes(oddType)"
                  :class="[
                    'instant',
                    ['returnRate', 'hRate', 'gRate'].includes(column.key)
                      ? ''
                      : fetchClassType(
                          item.initial[column.key],
                          item.instant[column.key]
                        ),
                  ]"
                >
                  {{
                    ['returnRate', 'hRate', 'gRate'].includes(column.key)
                      ? `${item.instant[column.key]}%`
                      : item.instant[column.key]
                  }}
                </div>
              </template>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import lodash from 'lodash'

import VIcon from '@/components/icon'

const COLUMNS_LIST = [
  { title: '', width: 94, key: 'title', border: true },
  { title: '', width: 57, key: 'type', border: true },
  { title: '主胜', width: 120, key: 'h' },
  { title: '客胜', width: 120, key: 'g' },
  { title: '返还率', width: 120, key: 'returnRate', border: true },
  { title: '主胜率', width: 110, key: 'hRate' },
  { title: '客胜率', width: 110, key: 'gRate', border: true },
  { title: '凯利指数', width: 237, key: 'kelly' },
]

const TITLE_LIST = [
  {
    title: '最高值',
    id: 'max',
    className: 'up',
    icon: 'rose-arrow',
  },
  { title: '最低值', id: 'min', className: 'down', icon: 'rose-arrow' },
  { title: '平均值', id: 'mean', className: 'mean', icon: 'mean' },
]

const KELLY_KEYS = ['hKelly', 'gKelly']

export default {
  components: {
    VIcon,
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
    isFixed: {
      type: Boolean,
      default: false,
    },
    onChangeFixed: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      tableData: [],
      localIsFixed: this.isFixed,
    }
  },
  computed: {
    columns: () => COLUMNS_LIST,
    hdaFormat() {
      return this.hadList || []
    },
  },
  watch: {
    isFixed(value) {
      if (value) {
        this.addScrollListen()
      } else {
        this.removeScrollListen()
      }
    },
  },
  mounted() {
    this.tableData = TITLE_LIST.map(item => ({
      ...item,
      ...this.fetchItemData(item.id),
    }))

    if (this.isFixed) {
      setTimeout(() => {
        this.addScrollListen()
      }, 500)
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
      this.$refs.fixedBox.classList.remove('fixed')
      document.removeEventListener('scroll', this.listenTop)
    },
    listenTop() {
      const offsetTop =
        this.$el.offsetTop + this.$el.offsetHeight / 2 - window.innerHeight

      if (window.scrollY - offsetTop <= 0) {
        this.$refs.fixedBox.classList.add('fixed')
      } else {
        this.$refs.fixedBox.classList.remove('fixed')
      }
    },
    handleChangeFixed() {
      this.$nextTick(() => {
        this.onChangeFixed(this.localIsFixed)
      })
    },
    fetchItemData(typeId) {
      const item = {
        initial: {},
        instant: {},
      }
      this.columns.forEach(({ key }) => {
        if (['kelly'].includes(key)) {
          KELLY_KEYS.forEach(kellyKey => {
            const initialData = this.hdaFormat.map(item =>
              Number(item.initial[kellyKey])
            )
            const instantData = this.hdaFormat.map(item =>
              Number(item.instant[kellyKey])
            )

            item.initial[kellyKey] = (lodash[typeId](initialData) || 0).toFixed(
              2
            )
            item.instant[kellyKey] = (lodash[typeId](instantData) || 0).toFixed(
              2
            )
          })
        } else if (!['title', 'type'].includes(key)) {
          const initialData = this.hdaFormat.map(item =>
            Number(item.initial[key])
          )
          const instantData = this.hdaFormat.map(item =>
            Number(item.instant[key])
          )
          item.initial[key] = (lodash[typeId](initialData) || 0).toFixed(2)
          item.instant[key] = (lodash[typeId](instantData) || 0).toFixed(2)
        }
      })

      return item
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
.hda-list-statistics {
  min-height: 274px;
  .fixed {
    width: 972px;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    z-index: 2;
    margin-bottom: 0;
    border-top: 1px solid #ccc;
  }
  .statistics-header {
    padding-top: 4px;
    padding-bottom: 18px;
  }
  .statistics-table {
    text-align: center;
    .table-header {
      line-height: 45px;
      color: #666666;
      background-color: #f5f5f5;
      display: flex;
      .has-border {
        border-right: 1px solid #fff;
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
      }
      .title {
        display: flex;
        align-items: center;
        justify-content: center;
        .title-icon {
          width: 8px;
        }
        .up {
          color: #e1243b;
          .title-icon {
            transform: rotate(-180deg);
          }
        }
        .down {
          color: #00a54f;
        }
        .mean {
          .iconfont {
            color: #dadada;
          }
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
      .kelly {
        flex: 1;
        .kelly-box {
          display: flex;
          > span {
            flex: 1;
          }
        }
      }
      .has-border {
        border-right: 1px solid #efefef;
      }
    }
  }
}
</style>
