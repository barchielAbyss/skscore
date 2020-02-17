<template>
  <div :class="['ui-button', { 'disabled-style': disabled }]">
    <button
      :class="[
        { 'button-size-default': size === 'normal' },
        { 'button-size-small': size === 'small' },
        { 'button-size-big': size === 'big' },
        { 'color-primary': type === 'primary' },
        { 'color-away': type === 'away' },
        { 'text-style': type === 'text' },
      ]"
      @click="!disabled && handleClick"
    >
      <slot />
    </button>
  </div>
</template>

<script>
export default {
  name: 'UiButton',
  props: {
    type: { type: String, default: 'primary' },
    size: { type: String, default: 'normal' },
    disabled: { type: [Boolean, Number], default: false },
  },
  methods: {
    handleClick() {
      this.$emit('click')
    },
  },
}
</script>

<style scoped lang="scss">
.ui-button {
  display: inline-block;
  margin-right: 10px;

  button {
    cursor: pointer;
    font-size: 14px;
    outline: none;
    border: none;
    border-radius: 4px;
    color: $color-white;
    font-family: $font-family-no-number;
    @include transition-all;
  }

  .text-style {
    color: #333;
    background-color: $color-white;

    &:hover {
      color: $color-active;
    }
  }

  .color-primary {
    background-color: $color-active;

    &:hover {
      opacity: 0.7;
    }
  }

  .color-away {
    background-color: $color-away;

    &:hover {
      opacity: 0.7;
    }
  }

  .button-size-default {
    width: 56px;
    height: 32px;
    line-height: 32px;
  }

  .button-size-small {
    width: 40px;
    height: 24px;
    line-height: 24px;
  }

  .button-size-big {
    width: 80px;
    height: 40px;
    line-height: 40px;
  }

  &.disabled-style {
    opacity: 0.3;
    button {
      cursor: default;
    }

    button.text-style {
      color: #999;
    }
  }
}
</style>
