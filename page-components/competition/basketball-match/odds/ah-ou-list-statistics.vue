<template>
  <div class="ah-ou-list-statistics">
    <ul class="statistics-list">
      <li v-for="(title, key) of statisticsKeys" :key="key" class="list-item">
        <span :class="['item', `${key}-title`]">
          {{ title }}
          <VIcon class="title-icon" name="rose-arrow" />
        </span>

        <span
          v-for="keyId of keyMap"
          :key="keyId"
          :class="['item', keyId, fetchState(key, keyId)]"
        >
          <ValueChange class="value" :value="statistical[key][keyId]" />
        </span>

        <span class="item toolbar">
          <a
            :class="{ active: showTag[key] }"
            @click="onChangeShowTag(key, true)"
          >
            标记
          </a>
          <a @click="onChangeShowTag(key, false)"> 取消 </a>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import VIcon from '@/components/icon'
import ValueChange from '@/components/value-change'

export default {
  components: {
    VIcon,
    ValueChange,
  },
  props: {
    showTag: Object,
    keyMap: {
      type: Array,
    },
    statistical: {
      type: Object,
      validator(value) {
        return ['max', 'min'].every(key =>
          Object.prototype.hasOwnProperty.call(value, key)
        )
      },
    },
    onChangeShowTag: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    statisticsKeys() {
      return {
        max: '最大值',
        min: '最小值',
      }
    },
  },
  methods: {
    fetchState(key, keyId) {
      const state = this.statistical[`${key}ValueState`]
      return state ? state[keyId] || '' : ''
    },
  },
}
</script>

<style lang="scss" scoped>
.ah-ou-list-statistics {
  font-size: 12px;
  .title-icon {
    width: 8px;
  }
  .max-title {
    color: #e1243b;
    .title-icon {
      transform: rotate(-180deg);
    }
  }
  .min-title {
    color: #00a54f;
  }
  .statistics-list {
    line-height: 36px;
    border-top: 1px solid #efefef;
    border-left: 1px solid #efefef;
  }
  .list-item {
    display: flex;
    border-bottom: 1px solid #efefef;
    .item {
      width: 120px;
      text-align: center;
      border-right: 1px solid #efefef;
      &.red {
        color: #e1243b;
      }
      &.green {
        color: #00a54f;
      }
    }
    .toolbar {
      a {
        padding: 0 4px;
        margin-right: 4px;
      }
    }
  }
}
</style>
