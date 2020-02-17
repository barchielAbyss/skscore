<template>
  <div class="team-wrap">
    <div class="title">
      <img v-lazy="msg.icon" class="team-title-icon" />
      {{ msg.name }}
    </div>

    <SliderBlock :details="good" />
    <SliderBlock :details="worst" />
    <SliderBlock :details="normal" />
  </div>
</template>

<script>
import SliderBlock from './slider-block'

export default {
  components: { SliderBlock },
  props: {
    msg: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      good: [],
      worst: [],
      normal: [],
    }
  },
  watch: {
    msg: {
      immediate: true,
      handler: function(value) {
        this.good = value.arrGood
        this.worst = value.arrWorst
        this.normal = value.arrNormal
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.team-wrap {
  width: 464px;
  border-radius: 4px;
  background-color: $color-white;
  padding: 22px 15px 0 15px;

  .title {
    font-weight: bold;
    margin-bottom: 24px;
    font-size: $font-size-middle;
    font-family: $font-family-no-number;
    color: $font-title-color;
  }
}

.team-title-icon {
  max-width: 20px;
  max-height: 20px;
  vertical-align: middle;
  margin-right: 3px;
}
</style>
