<template>
  <transition name="socket-fade" mode="out-in">
    <div
      v-if="visible"
      class="socket-dialog"
      :class="placement"
      :style="width ? `width: ${width}px` : ''"
    >
      <div class="socket-dialog__content">
        <slot />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  model: {
    prop: 'visible',
    event: 'change',
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    width: Number,
    title: String,
    duration: {
      type: Number,
      default: 30000,
    },
    onClose: {
      type: Function,
      default: () => {},
    },
    placement: {
      type: String,
      default: 'top',
      validator(value) {
        return ['top', 'center', 'bottom'].includes(value)
      },
    },
  },
  data() {
    return {
      timeout: null,
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(value) {
        if (value) {
          if (this.timeout) {
            clearTimeout(this.timeout)
          }
          this.timeout = setTimeout(() => {
            this.handleClose()
            this.timeout = null
          }, this.duration)
        }
      },
    },
  },
  methods: {
    handleClose() {
      this.onClose()
      this.$emit('change', false)
    },
  },
}
</script>

<style lang="scss" scoped>
.socket-dialog {
  box-shadow: 0 0 6px 2px rgba(0, 55, 175, 0.27);
  position: fixed;
  transform: translateX(-50%);
  left: 50%;
  border-radius: 4px;
  background-color: transparent;
  z-index: 2;
  &.socket-fade-enter-active,
  &.socket-fade-leave-active {
    @include transition-all;
  }
  &.socket-fade-enter,
  &.socket-fade-leave-to {
    transform: translate(-100%, -100%);
    opacity: 0;
  }
  &.top {
    top: 150px;
  }
  &.center {
    top: 50%;
    transform: translate(0, -50%);
  }
  &.bottom {
    bottom: 150px;
  }
}
</style>
