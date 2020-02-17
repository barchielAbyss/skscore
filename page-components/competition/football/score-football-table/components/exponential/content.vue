<template>
  <div class="football-yield-list">
    <div v-if="hasAh" class="football-yield-item ah-list">
      <div class="box ah-home" title="亚盘主赔">
        <p>
          <ValueChange
            :disabled="isDisabledWatch"
            :value="dataInfo.ah.h"
            class-name="side-box"
          />
        </p>
      </div>
      <div class="box ah-yield" title="亚盘让球">
        <p>
          <ValueChange
            :disabled="isDisabledWatch"
            :value="dataInfo.ah.l"
            :format="formatAhYield"
            class-name="mid-box"
          />
        </p>
      </div>
      <div class="box ah-guest" title="亚盘客赔">
        <p>
          <ValueChange
            :disabled="isDisabledWatch"
            :value="dataInfo.ah.g"
            class-name="side-box"
          />
        </p>
      </div>
    </div>

    <div v-if="hasHda" class="football-yield-item hda-list">
      <div class="box hda-home" title="欧盘主胜">
        <p>
          <ValueChange
            :disabled="isDisabledWatch"
            :value="dataInfo.hda.w"
            class-name="side-box"
          />
        </p>
      </div>
      <div class="box hda-yield" title="欧盘平">
        <p>
          <ValueChange
            :disabled="isDisabledWatch"
            :value="dataInfo.hda.d"
            class-name="mid-box"
          />
        </p>
      </div>
      <div class="box hda-guest" title="欧盘客胜">
        <p>
          <ValueChange
            :disabled="isDisabledWatch"
            :value="dataInfo.hda.l"
            class-name="side-box"
          />
        </p>
      </div>
    </div>

    <div v-if="hasOu" class="football-yield-item ou-list">
      <div class="box ou-home" title="大球">
        <p>
          <ValueChange
            :disabled="isDisabledWatch"
            :value="dataInfo.ou.b"
            class-name="side-box"
          />
        </p>
      </div>
      <div class="box ou-guest" title="总分">
        <p>
          <ValueChange
            :disabled="isDisabledWatch"
            :value="dataInfo.ou.t"
            :format="formatOuYield"
            class-name="mid-box"
          />
        </p>
      </div>
      <div class="box ou-yield" title="小球">
        <p>
          <ValueChange
            :disabled="isDisabledWatch"
            :value="dataInfo.ou.s"
            class-name="side-box"
          />
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { footballAhYield, footballOuYield } from '@/utils/status'

import ValueChange from '@/components/value-change'

export default {
  components: {
    ValueChange,
  },
  props: {
    row: Object,
  },
  computed: {
    ...mapState('competition-football', ['setting']),
    dataInfo() {
      return this.row.exponential
    },
    hasAh() {
      return this.setting.exponents.includes('ah')
    },
    hasHda() {
      return this.setting.exponents.includes('hda')
    },
    hasOu() {
      return this.setting.exponents.includes('ou')
    },
    isDisabledWatch() {
      return this.$route.query.timeType !== 'now'
    },
  },
  methods: {
    formatAhYield(value) {
      const yieldName = footballAhYield(value)
      return yieldName === '-' ? '' : yieldName
    },
    formatOuYield(value) {
      const yieldName = footballOuYield(value)
      return yieldName === '-' ? '' : yieldName
    },
  },
}
</script>

<style lang="scss" scoped>
.football-yield-list {
  display: flex;
  padding: 5px 26px;
  flex-direction: column;
  font-size: 12px;
  height: 100%;
  &:hover {
    .football-yield-item {
      color: $color-active;
    }
  }
  .football-yield-item {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
  }
  .football-yield-item:last-of-type {
    margin-bottom: 0;
  }
}
</style>
