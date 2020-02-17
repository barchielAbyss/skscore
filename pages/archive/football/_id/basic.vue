<template>
  <div class="basic-data-wrap">
    <div class="btn-group">
      <button
        v-for="item of arr"
        :key="item.name"
        :class="[
          'btn-default',
          { 'btn-active': item.name === activeComponentName },
        ]"
        @click="handleClick(item)"
      >
        {{ item.name }}
      </button>
    </div>

    <keep-alive>
      <component :is="activeComponent" :event-id="eventId" :year-id="yearId" />
    </keep-alive>
  </div>
</template>

<script>
import Score from '@/page-components/archive/football/basic/score-distribution'
import Result from '@/page-components/archive/football/basic/result-distribution'
import Special from '@/page-components/archive/football/basic/special-data'
import Season from '@/page-components/archive/football/basic/season-goal'

export default {
  components: {
    Score,
    Season,
    Result,
    Special,
  },
  props: {
    yearId: [String, Number],
    eventId: [String, Number],
  },
  data() {
    return {
      activeComponent: 'Score',
      activeComponentName: '比分分布',
      arr: [
        { name: '比分分布', value: 'Score' },
        { name: '胜平负分布', value: 'Result' },
        { name: '赛季场均进球', value: 'Season' },
        { name: '特殊数据', value: 'Special' },
      ],
    }
  },
  methods: {
    handleClick(item) {
      this.activeComponentName = item.name
      this.activeComponent = item.value
    },
  },
}
</script>

<style lang="scss" scoped>
.basic-data-wrap {
  padding: 20px 14px 10px 14px;
  .btn-default {
    margin-right: 10px;
    outline: none;
    border: none;
    background: #f3f4fb;
    border-radius: 2px;
    padding: 7px 16px;
    cursor: pointer;
    color: $font-title-color;
    font-size: $font-size-middle;
    font-family: $font-family-no-number;
    font-weight: normal;
  }

  .btn-group {
    margin-bottom: 24px;

    .btn-active {
      font-weight: bold;
      color: $color-active;
      background: #e5f1ff;
    }
  }
}
</style>
