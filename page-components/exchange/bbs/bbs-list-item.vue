<template>
  <div class="bbs-list-item" :style="styles">
    <Info :msg="list" />
    <Item :list="list" :flag="flag" class="mt-10" />
    <Bar :value="list['shoot'] || '0'" class="bar" :style="styleBar" />
  </div>
</template>

<script>
import Item from '../components/list-item'
import Info from './person-info'
import Bar from './red-bar'

export default {
  components: {
    Item,
    Info,
    Bar,
  },
  props: {
    list: { type: Object, default: () => ({}) },
    styles: { type: Object, default: () => ({}) },
    styleBar: { type: Object, default: () => ({}) },
    flag: { type: Boolean, default: false },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.bbs-list-item {
  background: $color-white;
  box-shadow: 0 0 4px 0 rgba(51, 51, 51, 0.05);
  border-radius: 8px;
  width: 302px;
  padding: 12px;
  position: relative;

  .mt-10 {
    margin-top: 10px;
  }

  .bar {
    position: absolute;
    right: 0;
    top: 12px;
  }
}
</style>
