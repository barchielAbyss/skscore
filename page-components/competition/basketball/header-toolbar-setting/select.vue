<template>
  <ElPopover
    ref="toolSelect"
    :visible-arrow="false"
    :trigger="trigger"
    :offset="1"
    placement="bottom"
    popper-class="tool-basketball-select__options"
    class="tool-basketball-select"
  >
    <ul>
      <li
        v-for="(item, key) of options"
        :key="key"
        :class="[
          'tool-basketball-select__options-item',
          { active: item.value === value },
        ]"
        @click="handleChangeValue(item.value)"
        v-text="item.lable || item.value"
      />
    </ul>

    <p slot="reference" class="tool-basketball-select__selected">
      {{ curOption.lable || curOption.value }}
      <i class="el-icon-arrow-down" />
    </p>
  </ElPopover>
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
          !value ||
          !value.length ||
          value.every(item => Object.keys(item).includes('value'))
        )
      },
    },
  },
  computed: {
    curOption() {
      return this.options.find(item => item.value === this.value) || {}
    },
  },
  methods: {
    handleChangeValue(value) {
      this.$refs.toolSelect.doClose()
      this.$emit('change', value)
      this.$emit('update:value', value)
    },
  },
}
</script>

<style lang="scss">
.tool-basketball-select {
  display: inline-block;
  font-size: 12px;
  text-align: center;
  position: relative;
  cursor: pointer;

  &__selected {
    margin: 0 2px;
    padding: 0 4px;
    line-height: 20px;
    background: #efefef;
    border-radius: 2px;
    color: #666666;
  }
}
.tool-basketball-select__options {
  max-width: 72px;
  min-width: 40px;
  padding: 0;
  margin-top: 0 !important;
  font-size: 12px;
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
