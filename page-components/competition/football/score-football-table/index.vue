<template>
  <div class="score-football-table">
    <div class="score-football-table__header">
      <span
        v-for="(row, key) of tableColumns"
        :key="key"
        :class="['table-item', key]"
        :style="{
          width: `${row.width}px`,
        }"
        v-text="row.name"
      />
    </div>

    <ul
      v-if="pinnedMap && pinnedMap.length"
      class="score-football-table__list score-football-table__pinned "
    >
      <template v-for="item of pinnedMap">
        <Item
          :key="item.id"
          :row="item"
          :columns="tableColumns"
          class="pinned-row table-row"
        />
      </template>
      <li class="pinned-into">已置顶赛事</li>
    </ul>

    <ul
      v-body-infinite-scroll="{
        load: onLazyTable,
        disabled: noMore,
        distance: 1000,
      }"
      class="score-football-table__list"
    >
      <template v-for="item of filterList">
        <div :key="item.id" class="table-row-wrap">
          <Item
            :row="item"
            :columns="tableColumns"
            class="filter-row table-row"
          />
          <div v-if="item.n" class="neutrality-football">
            <div class="neutrality-pointer" />
            <div class="neutrality-ctx">中立场</div>
          </div>
        </div>
      </template>
    </ul>

    <p v-if="!filterList.length && !pinnedList.length" class="no-more">暂无</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Item from './item'

const LIMILT_LEN = 40

export default {
  components: {
    Item,
  },
  props: {
    tableColumns: {
      type: [Array, Object],
      default: () => [],
    },
  },
  data() {
    return {
      limiltLen: LIMILT_LEN,
    }
  },
  computed: {
    ...mapState('competition-football', [
      'scoreList',
      'pinnedList',
      'hiddenList',
      'favorList',
      'headerTypes',
    ]),
    noMore() {
      return this.limiltLen >= this.scoreList.length
    },
    pinnedMap() {
      return this.scoreList.filter(item => {
        const isHide = this.hiddenList.includes(item.id)
        const pinned = this.pinnedList.includes(item.id)

        return pinned && !isHide
      })
    },
    filterList() {
      return Object.freeze(
        this.scoreList
          .filter(item => {
            const pinned = this.pinnedList.includes(item.id)
            const isHide = this.hiddenList.includes(item.id)

            let types = true

            switch (this.headerTypes) {
              case 1:
                types = item.is_hot
                break
              case 2:
                types = this.favorList.includes(item.id)
                break
              case 3:
                types = item.is_lottery
                break
              case 4:
                types = item.is_beidan
                break
              default:
                types = true
                break
            }

            return !pinned && !isHide && types
          })
          .filter((item, index) => {
            return index < this.limiltLen
          })
      )
    },
  },
  watch: {
    headerTypes() {
      this.limiltLen = LIMILT_LEN
    },
    'scoreList.length'() {
      this.limiltLen = LIMILT_LEN
    },
  },
  methods: {
    onLazyTable() {
      this.limiltLen = this.limiltLen + LIMILT_LEN
    },
  },
}
</script>
<style lang="scss" scoped>
.score-football-table {
  border-radius: 4px;
  font-size: 12px;
  .neutrality-football {
    width: 1278px;
    margin-left: 1px;
    position: relative;
    border-top: none;
    height: 22px;
    background-color: $color-white;
    box-shadow: 0 0 6px 2px rgba(0, 55, 175, 0.27);

    .neutrality-pointer {
      box-shadow: 0 0 6px 2px rgba(0, 55, 175, 0.27);
      position: absolute;
      z-index: 49;
      width: 10px;
      height: 10px;
      background-color: $color-white;
      transform: rotateZ(45deg);
      top: -5px;
      left: 544px;
    }

    .neutrality-ctx {
      z-index: 50;
      text-align: center;
      position: absolute;
      background-color: $color-white;
      left: 527px;
      height: 100%;
      line-height: 22px;
      width: 46px;
      font-size: $font-size-small;
      color: $color-active;
      font-family: $font-family-no-number;
    }
  }
  .table-row {
    display: flex;
    text-align: center;
    background-color: $color-white;
  }
  .table-row-wrap:last-of-type .table-row {
    border-radius: 0 0 4px 4px;
  }
  .score-football-table__header {
    display: flex;
    text-align: center;
    background-color: $color-white;
    color: #999;
    margin-top: 12px;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    border-bottom: 1px $color-tab-border solid;
  }
  &__pinned {
    padding-bottom: 12px;
    background-color: #f3f4f7;
    .pinned-into {
      text-align: center;
      padding: 4px 72px 4px 0;
      font-size: 14px;
      color: #1e2647;
      background-color: $color-white;
      border: 1px #efefef solid;
      border-top: none;
    }
  }
  .no-more {
    text-align: center;
    color: #888;
    line-height: 72px;
  }
}
</style>
