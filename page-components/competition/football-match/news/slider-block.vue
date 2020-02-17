<template>
  <div class="slider-box-wrap">
    <div class="slider-box-header">
      <span
        :class="[
          { 'set-border-red': type === 1 },
          { 'set-border-gray': type === 2 },
          { 'set-border-green': type === 3 },
        ]"
        >{{ details.type | setTitle }}</span
      >
    </div>

    <div class="section">
      <div
        v-for="(item, index) of defaultData"
        :key="index"
        :class="['text-items']"
      >
        <div class="ctx-wrap">
          <p>{{ item }}</p>
        </div>

        <VIcon
          name="point"
          :class="[
            'style-icon',
            { 'color-good': type === 1 },
            { 'color-so-so': type === 2 },
            { 'color-worst': type === 3 },
          ]"
        />
      </div>

      <VueSlideUpDown :active="flag" :duration="1000">
        <div>
          <div
            v-for="(item, index) of lastData"
            :key="index"
            :class="['text-items']"
          >
            <div class="ctx-wrap">
              <p>{{ item }}</p>
            </div>

            <VIcon
              name="point"
              :class="[
                'style-icon',
                { 'color-good': type === 1 },
                { 'color-so-so': type === 2 },
                { 'color-worst': type === 3 },
              ]"
            />
          </div>
        </div>
      </VueSlideUpDown>

      <div
        :class="['slider-group', { visibility: !(lastCount > 4) }]"
        @click="flag = !flag"
      >
        共 {{ lastCount }} 条
        <VIcon
          name="arrow"
          :class="['icon-slider', flag ? 'slider-up' : 'slider-down']"
        />
      </div>
      <div style="clear: both;" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import VueSlideUpDown from 'vue-slide-up-down'
import VIcon from '@/components/icon/'
Vue.component('vue-slide-up-down', VueSlideUpDown)
export default {
  components: { VIcon, VueSlideUpDown },
  filters: {
    setTitle(val) {
      if (val === 1) {
        return '有利情报'
      } else if (val === 2) {
        return '中利情报'
      } else {
        return '不利情报'
      }
    },
  },
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      flag: false,
      type: 1,
    }
  },
  computed: {
    lastCount() {
      return this.details.mockData.length
    },

    defaultData() {
      if (this.details.mockData.length > 4) {
        return this.details.mockData.slice(0, 4)
      } else {
        return this.details.mockData
      }
    },

    lastData() {
      if (this.details.mockData.length > 4) {
        return this.details.mockData.slice(4, this.details.mockData.length)
      } else {
        return ''
      }
    },
  },
  watch: {
    details: {
      immediate: true,
      handler: function(val) {
        this.type = val.type
      },
    },
  },
}
</script>

<style lang="scss" scoped>
$nav-color-red: #e1243b !default;
$nav-color-green: #00a54f !default;
$nav-color-gray: #aab4bd !default;

$tab-background-1: #fef3ee !default;
$tab-background-2: #f3f4f7 !default;
$tab-background-3: rgba(0, 122, 255, 0.1) !default;
$tab-background-4: #f5f5f5 !default;
$tab-border-color: #efefef !default;
$btn-background: #f3f4fb !default;

.slider-box-wrap {
  .slider-box-header {
    padding-bottom: 9px;
    border-bottom: 1px #f3f3f3 solid;
    span {
      padding-bottom: 9px;
      font-weight: bold;
      font-size: $font-size-middle;
      font-family: $font-family-no-number;
      color: $font-title-color;
    }
  }

  .section {
    padding-top: 15px;
    div.text-items {
      position: relative;
    }

    .ctx-wrap {
      min-height: 53px;
      width: calc(100% - 24px);
      margin-left: 6px;
      border-left: 1px #f3f3f3 solid;
      padding-left: 18px;
      font-size: $font-size-small;
      font-family: $font-family-no-number;
      color: $font-title-color;
    }

    .style-icon {
      font-size: $font-size-small;
      position: absolute;
      top: 0;
      left: 0;
      background-color: #fff;
      padding: 5px 0;
    }

    .visibility {
      visibility: hidden;
    }

    div.slider-group {
      float: right;
      font-size: 10px;
      font-family: $font-family-no-number;
      color: #666;
      cursor: pointer;
      .icon-slider {
        max-width: 12px;
        max-height: 12px;
      }

      .slider-down {
        transform: rotateZ(90deg);
      }

      .slider-up {
        transform: rotateZ(-90deg);
      }
    }
  }

  .color-good {
    color: $nav-color-red;
  }

  .color-worst {
    color: $nav-color-green;
  }

  .color-so-so {
    color: $nav-color-gray;
  }
}

.set-border-red {
  border-bottom: 2px $nav-color-red solid;
}

.set-border-green {
  border-bottom: 2px $nav-color-green solid;
}

.set-border-gray {
  border-bottom: 2px $nav-color-gray solid;
}
</style>
