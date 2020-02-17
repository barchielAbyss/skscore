<template>
  <p class="team-radio-item">
    <span class="label" v-text="`${title}：`" />
    <span
      v-if="team"
      class="team"
      :title="lang === 'zh' ? team.name : team.name_e"
    >
      {{ lang === 'zh' ? team.name : team.name_e }}
    </span>
    <span>
      <i class="win">{{ dataInfo.results.win }}胜</i>
    </span>
    <span>
      <i class="draw">{{ dataInfo.results.draw }}平</i>
    </span>
    <span style="padding-right: 18px;">
      <i class="lost">{{ dataInfo.results.lost }}败</i>
    </span>

    <span class="item">
      胜率:
      <i
        :class="[
          'default-style-label',
          {
            'high-color': Number(dataInfo.results.winRadio.split('%')[0]) > 60,
          },
          { 'low-color': Number(dataInfo.results.winRadio.split('%')[0]) < 60 },
        ]"
      >
        {{ dataInfo.results.winRadio }}</i
      >
    </span>
    <span class="item">
      赢盘率:
      <i
        :class="[
          'default-style-label',
          { 'high-color': Number(dataInfo.winPlate.split('%')[0]) > 60 },
          { 'low-color': Number(dataInfo.winPlate.split('%')[0]) < 60 },
        ]"
      >
        {{ dataInfo.winPlate }}</i
      >
    </span>
    <span class="item">
      大球:<i class="big-plate"> {{ dataInfo.bigPlate }}</i>
    </span>
    <span class="item">
      单:<i class="singular"> {{ dataInfo.singular }}</i>
    </span>
  </p>
</template>

<script>
export default {
  props: {
    title: String,
    lang: String,
    team: Object,
    dataInfo: Object,
  },
}
</script>

<style lang="scss">
.team-radio-item {
  font-size: 12px;
  .team {
    max-width: 6em;
    overflow: hidden;
    white-space: nowrap;
    display: inline-block;
    vertical-align: top;
    margin-right: 8px;
    text-overflow: ellipsis;
  }
  i {
    font-style: normal;
    font-weight: bold;
  }
  .win {
    color: $color-red;
  }
  .draw {
    color: $color-active;
  }
  .lost {
    color: #00a54f;
  }

  i.high-color {
    background-color: $color-red;
    color: $color-white;
  }

  i.low-color {
    background-color: #00a54f;
    color: $color-white;
  }

  .default-style-label {
    padding: 0 2px;
    background-color: transparent;
    color: $color-active;
    border-radius: 2px;
  }

  .win-plate {
    color: #e1243b;
  }
  .big-plate {
    color: #333;
  }
  .singular {
    color: #333;
  }
  .item {
    padding: 0 4px;
  }
}
</style>
