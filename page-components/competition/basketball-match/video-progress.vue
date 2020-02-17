<template>
  <div class="video-progress-wrap">
    <div
      :style="style"
      :class="[
        'son-progress',
        types === 'home' ? 'color-home right' : 'color-guest left',
      ]"
    />
  </div>
</template>

<script>
export default {
  props: {
    types: {
      type: String,
      default: 'home',
    },

    max: {
      type: Number,
      default: 100,
    },

    value: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      style: {},
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function(val) {
        this.style = { width: Math.round(100 * (val / this.max)) + '%' }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.video-progress-wrap {
  width: 220px;
  height: 6px;
  border-radius: 5px;
  background-color: #efefef;
  position: relative;

  .son-progress {
    border-radius: 5px;
    height: 100%;
    position: absolute;
    top: 0;
  }

  .left {
    left: 0;
  }

  .right {
    right: 0;
  }

  .color-home {
    background-color: $color-active;
  }

  .color-guest {
    background-color: $color-away;
  }
}
</style>
