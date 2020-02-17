<template>
  <ClientOnly>
    <ElPopover
      ref="select"
      :visible-arrow="false"
      :width="width"
      :placement="placement"
      :class="['v-popover-select', { active: isVisible }]"
      :popper-class="style"
      @show="handleShowPopover"
      @hide="isVisible = false"
    >
      <span slot="reference" :class="['title']">
        {{ curValue.label || curValue.value }} <i class="el-icon-arrow-down" />
      </span>

      <ul ref="options" class="options">
        <li
          v-for="item of options"
          :key="item.value"
          :class="[
            { active: item.value === value },
            { 'hover-small': size === 'small' },
          ]"
          @click="handleChangeValue(item.value)"
          v-text="item.label || item.value"
        />
      </ul>
    </ElPopover>
  </ClientOnly>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    placement: {
      type: String,
      default: 'bottom',
    },

    size: {
      type: String,
      default: '',
    },

    value: {
      type: [Number, String],
      default: '',
    },

    width: {
      type: [Number, String],
      default: '',
    },

    options: {
      type: Array,
      default: () => [],
    },

    onChange: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      isVisible: false,
    }
  },
  computed: {
    curValue() {
      return this.options.find(item => item.value === this.value) || {}
    },

    style() {
      return this.size === 'small'
        ? 'v-popover-select-options style-small'
        : 'v-popover-select-options style-default'
    },
  },
  methods: {
    handleChangeValue(value) {
      this.$emit('update:value', value)
      this.$emit('change', value)
      this.onChange && this.onChange(value)
      this.$refs.select.doClose()
    },
    handleShowPopover() {
      this.isVisible = true
      this.$nextTick(() => {
        const offsetTop =
          this.options.findIndex(item => item.value === this.value) * 26
        const offsetHeight = this.$refs.options.offsetHeight - 26
        this.$refs.options.scrollTop = offsetHeight < offsetTop ? offsetTop : 0
      })
    },
  },
}
</script>

<style lang="scss">
.v-popover-select {
  cursor: pointer;
  &.active {
    color: $color-active !important;
    border-color: $color-active !important;
  }
}

// 全局样式：小
.style-small {
  box-shadow: 0 2px 6px 0 rgba(30, 38, 71, 0.2);
  border-radius: 4px;
  padding: 0;
  font-size: $font-size-small;
}

// size = '' 时，默认的全局样式（ 未增加 size 属性前，v-popover-select-options 下的样式 ）
.style-default {
  padding: 4px 0;
  font-size: $font-size-middle;
}

.v-popover-select-options {
  font-family: $font-family-no-number;
  text-align: center;
  overflow: hidden;

  &.el-popper {
    margin: 4px;
  }
  .options {
    max-height: 300px;
    overflow: auto;
    line-height: 32px;
    cursor: pointer;
    color: $font-title-color;

    li {
      padding: 0 12px;
      &:hover {
        background: $color-active;
        color: $color-white;
      }
    }

    /* size = small 时的 hover 效果 */
    li.hover-small {
      height: 26px;
      line-height: 26px;
      padding: 0;
      &:hover {
        background: #e5f1ff;
        color: $color-active;
      }
    }

    .active {
      background-color: $color-white;
      color: $color-active;
    }
  }
}
</style>
