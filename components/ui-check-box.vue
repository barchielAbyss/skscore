<template>
  <div class="ui-check-box">
    <div class="icon-style">
      <VIcon
        :class="['icon-checkbox', { active: status }]"
        :name="status ? 'icon_tick_selected' : 'icon_tick_normal'"
      />
    </div>

    <div class="check-icon-wrap">
      <input
        class="check-icon"
        type="checkbox"
        :checked="status"
        @change="handleChange"
      />
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
import VIcon from '@/components/icon'
export default {
  name: 'UiCheckBox',
  components: { VIcon },
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    checked: { type: [Boolean, Number], default: false },
  },
  data() {
    return {
      status: this.checked,
    }
  },
  watch: {
    checked(value) {
      this.status = value
    },
  },
  methods: {
    handleChange() {
      this.status = event.target.checked
      this.$emit('update:checked', event.target.checked)
      this.$emit('change', event.target.checked)
    },
  },
}
</script>

<style scoped lang="scss">
.ui-check-box {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .check-icon-wrap {
    margin-right: 6px;
  }

  .check-icon {
    cursor: pointer;
    opacity: 0;
  }

  .icon-style {
    position: absolute;
    top: 0;
    left: 0;

    .active {
      color: $color-active;
    }
  }

  .icon-checkbox {
    font-size: 14px;
    color: #ccc;
  }
}
</style>
