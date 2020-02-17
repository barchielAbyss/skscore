<template>
  <div class="show-score-box">
    <p :class="['ctx-small', { 'font-weight': count === max }]">
      {{ score | formatScore }}
    </p>
    <p :class="['ctx-mini', { 'color-red': count === max }]">{{ count }} 次</p>
  </div>
</template>

<script>
export default {
  filters: {
    // 返回格式可能为 1 : 1，要替换冒号和去除空格
    formatScore(value) {
      value = value.replace(/\s*/g, '')
      if (value.indexOf(':') === -1) {
        return value
      } else {
        value = value.replace(/[:]/g, '-')
        return value
      }
    },
  },
  props: {
    count: { type: [String, Number], default: '无' },
    score: { type: String, default: '无' },
    max: { type: [String, Number], required: true },
  },
}
</script>

<style lang="scss" scoped>
.show-score-box {
  width: 252px;
  height: 40px;
  background: #f9f9f9;
  margin-top: 6px;
  text-align: center;
  font-family: $font-family-no-number;
  position: relative;

  .ctx-small {
    font-size: 13px;
    position: absolute;
    left: 50%;
    top: 3px;
    transform: translate(-50%);
    color: $font-title-color;
  }

  p.font-weight {
    font-weight: bold;
    color: #e1243b;
  }

  p.color-red {
    color: #e1243b;
  }

  .ctx-mini {
    font-size: 10px;
    color: #999;
    position: absolute;
    left: 50%;
    bottom: 3px;
    transform: translate(-50%);
  }
}
</style>
