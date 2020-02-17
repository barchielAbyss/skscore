<template>
  <div class="ui-radio">
    <VIcon
      :class="[
        radio === value ? 'color-active' : 'color-default',
        'icon-radio',
      ]"
      :name="radio === value ? 'icon_tick_selected' : 'icon_tick_normal'"
    />
    <input
      class="radio-style"
      type="radio"
      :value="value"
      :checked="radio === value"
      @change="handleChange"
    />
    <slot />
  </div>
</template>

<script>
import VIcon from '@/components/icon'
export default {
  components: { VIcon },
  model: {
    prop: 'radio',
    event: 'change',
  },
  props: {
    value: { type: [String, Number], default: '' },
    radio: { type: [String, Number], default: '' },
  },
  methods: {
    handleChange() {
      this.$emit('update:radio', this.value)
      this.$emit('change', this.value)
    },
  },
}
</script>

<style scoped lang="scss">
.ui-radio {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .radio-style {
    opacity: 0;
    margin-right: 6px;
  }

  .icon-radio {
    font-size: 14px;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .color-default {
    color: #ccc;
  }

  .color-active {
    color: $color-active;
  }
}
</style>
