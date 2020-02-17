<template>
  <div class="table-item-wrap">
    <!--  表格第一行：队名 + 队徽  -->
    <div
      :class="[
        'default-style-cell',
        { fontStyleHome: receivedData.type === 1 },
        { fontStyleAway: receivedData.type === 0 },
        { backgroundColorHome: receivedData.type === 1 },
        { backgroundColorAway: receivedData.type === 0 },
      ]"
    >
      <img v-lazy="logo" class="team-title-icon" />
      {{ receivedData.name }}
    </div>

    <!-- 表格第二行：时间线  -->
    <div class="default-style-row backgroundColorRow">
      <div
        v-for="(item, index) of receivedData.data[3]"
        :key="index"
        :class="[
          'default-style-col',
          { borderRight: index === receivedData.data[3].length - 1 },
        ]"
      >
        {{ item }}
      </div>
    </div>

    <div class="default-style-row">
      <div
        v-for="(item, index) of receivedData.data[0]"
        :key="index"
        :class="[
          'default-style-col',
          { borderRight: index === receivedData.data[3].length - 1 },
          { highLight: maxNum.total == item },
        ]"
      >
        {{ item }}
      </div>
    </div>

    <div class="default-style-row backgroundColorRow">
      <div
        v-for="(item, index) of receivedData.data[1]"
        :key="index"
        :class="[
          'default-style-col',
          { borderRight: index === receivedData.data[3].length - 1 },
        ]"
      >
        {{ item }}
      </div>
    </div>

    <div class="default-style-row">
      <div
        v-for="(item, index) of receivedData.data[2]"
        :key="index"
        :class="[
          'default-style-col',
          { borderRight: index === receivedData.data[3].length - 1 },
        ]"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    teamMsg: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      receivedData: {},
      logo: '',
      maxNum: { total: '' },
    }
  },
  watch: {
    teamMsg: {
      deep: true,
      immediate: true,
      handler: function(newVal) {
        this.receivedData = {}
        this.receivedData = newVal
        this.logo = this.receivedData.logo

        if (this.receivedData.data[3][0] !== '时间') {
          this.receivedData.data[3].unshift('时间')
        }

        if (this.receivedData.data[0][0] !== '总') {
          this.maxNum.total = Math.max(...this.receivedData.data[0])
          this.receivedData.data[0].unshift('总')
        }

        if (this.receivedData.data[1][0] !== '主') {
          this.receivedData.data[1].unshift('主')
        }

        if (this.receivedData.data[2][0] !== '客') {
          this.receivedData.data[2].unshift('客')
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.table-item-wrap {
  border-bottom: 1px #efefef solid;
}

.default-style-cell {
  height: 36px;
  line-height: 36px;
  padding: 0 14px;
}

.default-style-row {
  display: flex;
}

.default-style-col {
  height: 36px;
  line-height: 36px;
  padding: 0 14px;
  text-align: center;
  flex: 1;
  border-left: 1px #efefef solid;
  box-sizing: border-box;
  font-family: $font-family-no-number;
  font-size: $font-size-small;
  color: $font-title-color;
}

.backgroundColorHome {
  background-color: rgb(225, 239, 255);
}

.backgroundColorAway {
  background-color: #fef3ee;
}

.backgroundColorRow {
  background-color: #f5f5f5;
}

.team-title-icon {
  max-width: 20px;
  max-height: 20px;
  vertical-align: middle;
  margin-right: 3px;
}

.fontStyleHome {
  font-family: $font-family-no-number;
  font-size: $font-size-middle;
  color: $color-active;
  font-weight: bold;
}

.fontStyleAway {
  font-family: $font-family-no-number;
  font-size: $font-size-middle;
  color: $color-away;
  font-weight: bold;
}

.borderRight {
  border-right: 1px #efefef solid;
}

.highLight {
  color: #e1243b;
  font-size: 14px;
}
</style>
