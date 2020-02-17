<template>
  <div
    :class="[
      'value-change',
      { 'margin-distance': initValue },
      className,
      {
        red:
          (initValue && initValue < value ? 1 : 0) || (colorRed && !initValue),
      },
      {
        green:
          (initValue && initValue > value ? 1 : 0) ||
          (colorGreen && !initValue),
      },
      { gray: colorGray && value && !initValue },
    ]"
  >
    <i :class="['value-show']" v-html="format(value)" />
  </div>
</template>

<script>
const REMOVE_TYPE_TIME = 7000

export default {
  props: {
    className: [Array, String],
    value: [String, Number],
    initValue: [String, Number],
    disabled: Boolean,
    format: {
      type: Function,
      default: value => {
        return value ? Number(value).toFixed(2) : ''
      },
    },
  },
  data() {
    return {
      valueType: '',
      colorRed: false,
      colorGreen: false,
      colorGray: true,
      timer: null,
    }
  },
  watch: {
    value(value, old) {
      this.onChangeValue(value, old)
    },
    valueType(value) {
      if (value) {
        setTimeout(() => {
          this.valueType = ''
        }, REMOVE_TYPE_TIME)
      }
    },
  },
  methods: {
    onChangeValue(value, old) {
      if (this.disabled) {
        return
      }

      this.valueType = this.fetchValueType(value, old)
    },

    fetchValueType(value, old) {
      const newValue = Number(value)
      const oldValue = Number(old)

      if (this.timer) {
        clearTimeout(this.timer)
      }

      if (
        ['[object Undefined]', '[object Null]'].includes(
          Object.prototype.toString.call(old)
        ) ||
        old === ''
      ) {
      } else if (newValue > oldValue) {
        this.colorRed = true
        this.colorGreen = false
      } else if (newValue < oldValue) {
        this.colorRed = false
        this.colorGreen = true
      } else {
      }

      this.timer = setTimeout(() => {
        this.colorGreen = false
        this.colorRed = false
        clearTimeout(this.timer)
      }, 5000)
    },
  },
}
</script>

<style lang="scss" scoped>
.value-change {
  background-position: right center;
  background-repeat: no-repeat;
  background-size: 10px;
  width: 100%;
  height: 20px;
  line-height: 20px;
  border-radius: 2px;

  &.margin-distance {
    margin: 0 1px;
  }

  &.mid-box {
    width: 72px;
    margin: 0 4px;
  }

  &.side-box {
    width: 46px;
  }

  &.red {
    .value-show {
      color: #e1243b;
    }
    background-color: #fce9eb;
  }

  &.green {
    .value-show {
      color: #00a54f;
    }
    background-color: #e5f6ed;
  }

  &.gray {
    .value-show {
      color: #333;
    }
    background-color: #f3f4f7;
  }

  .value-show {
    font-style: normal;
  }
}
</style>
