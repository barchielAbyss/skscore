<template>
  <div
    :class="[
      'score-bar',
      { 'radius-home': name === 'home' },
      { 'radius-guest': name === 'guest' },
    ]"
  >
    <div
      :style="setStyle"
      :class="[
        { 'home-bar': name === 'home' },
        { 'guest-bar': name === 'guest' },
      ]"
    />
  </div>
</template>

<script>
export default {
  props: {
    name: { type: String, default: 'home' },
    total: { type: Number, default: 100 },
    value: { type: Number, default: 50 },
  },
  computed: {
    setStyle() {
      return { width: (this.value / this.total) * 160 + 'px' }
    },
  },
}
</script>

<style lang="scss" scoped>
.score-bar {
  width: 160px;
  height: 6px;
  background-color: $color-tab-border;
  position: relative;

  &.radius-home {
    border-radius: 4px 0 0 4px;
  }

  &.radius-guest {
    border-radius: 0 4px 4px 0;
  }

  .home-bar {
    position: absolute;
    top: 0;
    right: 0;
    height: 6px;
    background-color: $color-active;
    border-radius: 4px 0 0 4px;
  }

  .guest-bar {
    position: absolute;
    top: 0;
    left: 0;
    height: 6px;
    background-color: #f2603c;
    border-radius: 0 4px 4px 0;
  }
}
</style>
