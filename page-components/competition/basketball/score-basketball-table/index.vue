<template>
  <div class="score-basketball-table">
    <ul
      v-if="pinnedMap && pinnedMap.length"
      class="score-basketball-table__list score-basketball-table__pinned "
    >
      <template v-for="item of pinnedMap">
        <Item :key="item.id" :row="item" class="pinned-row table-row" />
      </template>
      <li class="pinned-into">已置顶赛事</li>
    </ul>

    <ul
      v-body-infinite-scroll="{
        load: onLazyTable,
        disabled: noMore,
        distance: 1000,
      }"
      class="score-basketball-table__list"
    >
      <template v-for="item of filterList">
        <Item :key="item.id" :row="item" class="filter-row table-row" />
      </template>
    </ul>

    <p v-if="!scoreList.length" class="no-more">暂无</p>
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
  data() {
    return {
      limiltLen: LIMILT_LEN,
    }
  },
  computed: {
    ...mapState('competition-basketball', [
      'scoreList',
      'pinnedList',
      'hiddenList',
      'onlyHot',
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
      return this.scoreList
        .filter(item => {
          const pinned = this.pinnedList.includes(item.id)
          const isHide = this.hiddenList.includes(item.id)
          const showHot = this.onlyHot ? item.is_hot : true
          return !pinned && !isHide && showHot
        })
        .filter((item, index) => {
          return index < this.limiltLen
        })
    },
  },
  watch: {
    onlyHot() {
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
.score-basketball-table {
  font-size: 12px;
  &__pinned {
    background-color: #f3f4f7;
    .pinned-into {
      text-align: center;
      padding: 4px 0;
      font-size: 14px;
      color: #1e2647;
      background-color: $color-white;
      border-top: 1px solid #efefef;
      font-weight: bold;
    }
    /deep/ .scroe-title .match-tools {
      color: $color-active;
      .icon-top {
        color: $color-active;
        display: inline-block;
        transform: rotate(180deg);
      }
    }
  }
  .no-more {
    text-align: center;
    color: #888;
    line-height: 72px;
  }
}
</style>
