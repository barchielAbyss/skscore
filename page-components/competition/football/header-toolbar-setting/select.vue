<template>
  <div class="tool-select" @mouseleave="showOptions = false">
    <p
      slot="reference"
      class="tool-select__selected"
      @mouseenter="showOptions = true"
    >
      {{ curOption.lable || curOption.value }}
      <i class="iconfont icon-icon_dropdown_selected color-icon-drop" />
    </p>

    <transition name="options">
      <ul v-show="showOptions" class="tool-select__options">
        <li
          v-for="(item, key) of options"
          :key="key"
          :class="[
            'tool-select__options-item',
            { active: item.value === value },
          ]"
          @click="handleChangeValue(item.value)"
          v-text="item.lable || item.value"
        />
      </ul>
    </transition>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    trigger: {
      type: String,
      default: 'click',
    },
    value: {
      type: [Number, String],
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
      validator(value) {
        return (
          !value.length ||
          value.every(item => Object.keys(item).includes('value'))
        )
      },
    },
  },
  data() {
    return {
      showOptions: false,
    }
  },
  computed: {
    curOption() {
      return this.options.find(item => item.value === this.value) || {}
    },
  },
  methods: {
    handleChangeValue(value) {
      this.showOptions = false
      this.$emit('change', value)
      this.$emit('update:value', value)
    },
  },
}
</script>

<style lang="scss" scoped>
.tool-select {
  display: inline-block;
  font-size: 12px;
  text-align: center;
  position: relative;
  cursor: pointer;

  &__selected {
    width: 56px;
    line-height: 20px;
    background: #efefef;
    border-radius: 2px;
    color: #666666;
  }
}

.options-enter-active,
.options-leave-active {
  transition: opacity 0.5s;
}
.color-icon-drop {
  color: $color-active;
}
.options-enter,
.options-leave-to {
  opacity: 0;
}

.tool-select__options {
  position: absolute;
  width: 100%;
  top: 100%;
  background-color: $color-white;
  max-width: 56px;
  min-width: 40px;
  font-size: 12px;
  z-index: 5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  word-break: break-all;
  &-item {
    cursor: pointer;
    user-select: none;
    padding: 5px 10px;
    text-align: center;
    &.active {
      background-color: $color-active;
      color: $color-white;
      &:hover {
        background-color: $color-active;
        color: $color-white;
      }
    }
    &:hover {
      color: $color-active;
    }
  }
}
</style>
