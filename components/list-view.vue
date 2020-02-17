<template>
  <div class="list-view" @scroll="handleScroll($event)">
    <div
      class="list-view-phantom"
      :style="{ height: data.length * itemHeight + 'px' }"
    />
    <div ref="content" class="list-view-content">
      <div
        v-for="(item, index) in visibleData"
        :key="index"
        class="list-view-item"
      >
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
    },
    itemHeight: {
      type: Number,
      default: 30,
    },
  },
  data() {
    return {
      start: 0,
      end: null,
      visibleCount: null,
      visibleData: [],
      scrollTop: 0,
    }
  },
  mounted() {
    this.visibleCount = Math.ceil(this.$el.clientHeight / this.itemHeight)
    this.start = 0
    this.end = this.start + this.visibleCount
    this.visibleData = this.data.slice(this.start, this.end)
  },
  methods: {
    handleScroll() {
      const scrollTop = this.$el.scrollTop
      const fixedScrollTop = scrollTop - (scrollTop % this.itemHeight)
      this.$refs.content.style.webkitTransform = `translate3d(0, ${fixedScrollTop}px, 0)`
      this.start = Math.floor(scrollTop / this.itemHeight)
      this.end = this.start + this.visibleCount
      this.visibleData = this.data.slice(this.start, this.end)
    },
  },
}
</script>

<style>
.list-view {
  height: 400px;
  overflow: auto;
  position: relative;
  border: 1px solid #666;
}
.list-view-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}
.list-view-content {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
}
.list-view-item {
  padding: 5px;
  color: #666;
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
}
</style>
