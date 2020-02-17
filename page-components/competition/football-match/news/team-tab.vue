<template>
  <div class="team-tab-wrap">
    <!--   表头：队徽 + 队名   -->
    <div
      :class="[
        'default-style-cell',
        team.type === 1 ? 'header-background-home' : 'header-background-guest',
      ]"
    >
      <img v-lazy="team.icon" class="team-title-icon" />
      {{ team.name }}
    </div>

    <!--   tab - head   -->
    <div :class="['tab-row-head']">
      <div
        v-for="item of dataRow"
        :key="item"
        :class="[
          'tab-row-head-cell',
          { setBorderLeft: item !== '赛事' },
          { widthMin: item === '比分' || item === '输赢' || item === '盘路' },
          { widthMiddle: item === '时间' },
          { widthLarge: item === '胜/平/负' || item === '初盘' },
        ]"
      >
        {{ item }}
      </div>
    </div>

    <!--   tab - body   -->
    <div>
      <div
        v-for="(item, index) of list"
        :key="index"
        :class="['tab-col', { 'row-background': index % 2 === 1 }]"
      >
        <div :class="['tab-col-cell', 'borderLeftNone']">
          {{ item.eventName }}
        </div>
        <div :class="['tab-col-cell', 'widthMiddle']">
          {{ item.eventTime }}
        </div>
        <div
          :class="[
            'tab-col-cell',
            {
              'font-red':
                item.raceResult === '1' && team.name === item.homeName,
            },
            {
              'font-gray':
                item.raceResult === '2' && team.name === item.homeName,
            },
            {
              'font-green':
                item.raceResult === '3' && team.name === item.homeName,
            },
          ]"
        >
          {{ item.homeName }}
        </div>
        <div :class="['tab-col-cell', 'widthLarge']">
          {{ item.odd[0] }}/{{ item.odd[1] }}/{{ item.odd[2] }}
        </div>
        <div
          :class="[
            'tab-col-cell',
            {
              'font-red':
                item.raceResult === '1' && team.name === item.guestName,
            },
            {
              'font-gray':
                item.raceResult === '2' && team.name === item.guestName,
            },
            {
              'font-green':
                item.raceResult === '3' && team.name === item.guestName,
            },
          ]"
        >
          {{ item.guestName }}
        </div>
        <div :class="['tab-col-cell', 'widthMin']">
          {{ item.teamScore }}
        </div>
        <div
          :class="[
            'tab-col-cell',
            'widthMin',
            { 'font-red': item.raceResult === '1' },
            { 'font-gray': item.raceResult === '2' },
            { 'font-green': item.raceResult === '3' },
          ]"
        >
          {{ item.raceResult | showResult }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    showResult(val) {
      if (val === '1') {
        return '赢'
      } else if (val === '2') {
        return '平'
      } else if (val === '3') {
        return '输'
      }
    },
  },
  props: {
    msg: { type: Object, default: () => ({}) },
    active: { type: Number, required: true },
    list: { type: Array, default: () => [] },
  },
  data() {
    return {
      dataRow: ['赛事', '时间', '主队', '胜/平/负', '客队', '比分', '输赢'],

      team: {
        type: 1,
        name: '',
        icon: '',
      },
    }
  },
  watch: {
    msg: {
      immediate: true,
      handler: function(val) {
        this.team.type = val.type
        this.team.name = val.name
        this.team.icon = val.icon
      },
    },

    active: {
      immediate: true,
      handler: function(val) {
        if (val === 1) {
          this.dataRow = [
            '赛事',
            '时间',
            '主队',
            '胜/平/负',
            '客队',
            '比分',
            '输赢',
          ]
        } else {
          this.dataRow = [
            '赛事',
            '时间',
            '上盘',
            '初盘',
            '下盘',
            '比分',
            '盘路',
          ]
        }
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

.team-tab-wrap {
  width: 479px;
  border: 1px $tab-border-color solid;
  box-sizing: border-box;

  .team-title-icon {
    max-width: 20px;
    max-height: 20px;
    vertical-align: middle;
    margin-right: 3px;
  }

  .default-style-cell {
    height: 36px;
    line-height: 36px;
    padding: 0 14px;
    font-size: $font-size-middle;
    font-family: $font-family-no-number;
    font-weight: bold;
  }

  .tab-row-head {
    background-color: $tab-background-2;
    display: flex;

    justify-content: flex-start;
    .tab-row-head-cell {
      padding: 14.8px 0;
    }

    .setBorderLeft {
      border-left: 1px $tab-border-color solid;
    }
  }

  .tab-col {
    display: flex;
    justify-content: flex-start;

    .tab-col-cell {
      padding: 8.5px 0;
      border: 1px $tab-border-color solid;
      border-bottom: none;
      border-right: none;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .borderLeftNone {
      border-left: none;
    }
  }

  .tab-col div.tab-col-cell,
  .tab-row-head div.tab-row-head-cell {
    box-sizing: border-box;
    text-align: center;
    width: 84px;

    &.widthMiddle {
      width: 62px;
    }

    &.widthLarge {
      width: 85px;
    }

    &.widthMin {
      width: 40px;
    }
  }

  .borderLeftNone {
    border-left: none;
  }

  .header-background-home {
    background-color: $tab-background-3;
    color: $color-active;
  }

  .header-background-guest {
    background-color: $tab-background-1;
    color: $color-away;
  }

  .row-background {
    background-color: $tab-background-4;
  }

  .font-green {
    color: $nav-color-green;
  }

  .font-red {
    color: $nav-color-red;
  }

  .font-gray {
    color: #666;
  }
}
</style>
