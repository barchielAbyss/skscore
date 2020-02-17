<template>
  <div class="red-bar">
    <p class="label-p value">{{ value }}%</p>
    <p class="label-p name">{{ name }}</p>
  </div>
</template>

<script>
export default {
  props: {
    name: { type: String, default: '命中率' },
    value: { type: [String, Number], required: true },
  },
}
</script>

<style lang="scss" scoped>
.red-bar {
  background: rgba(225, 36, 59, 0.7);
  border-radius: 100px 0 0 100px;
  font-family: $font-family-no-number;
  font-size: $font-size-small;
  color: $color-white;
  width: 53px;
  position: relative;
  height: 40px;
  .label-p {
    position: absolute;
    left: 0;
    text-align: center;
    width: 100%;
    text-indent: 8px;
  }

  .name {
    bottom: 3px;
    font-size: 12px;
  }

  .value {
    top: 3px;
  }
}
</style>
