<template>
  <div class="score-calc-item">
    <div class="top-part">
      <p :class="[{ 'font-weight': dataHome > dataGuest }]">{{ dataHome }}</p>
      <p :class="[{ 'font-weight': dataHome < dataGuest }]">{{ dataGuest }}</p>
    </div>

    <div class="bottom-part">
      <Bar :value="dataHome" :total="dataHome + dataGuest" />

      <div class="label" v-text="label" />

      <Bar name="guest" :value="dataGuest" :total="dataHome + dataGuest" />
    </div>
  </div>
</template>

<script>
import Bar from './score-bar'
export default {
  components: { Bar },
  props: {
    label: { type: String, required: true },
    home: { type: [String, Number], default: 0 },
    guest: { type: [String, Number], default: 0 },
  },
  computed: {
    dataHome() {
      let dataHome = this.home
      if (!this.home) {
        dataHome = 0
      }
      return Number(dataHome)
    },

    dataGuest() {
      let dataGuest = this.guest
      if (!this.guest) {
        dataGuest = 0
      }
      return Number(dataGuest)
    },
  },
}
</script>

<style lang="scss" scoped>
.score-calc-item {
  color: #333;
  font-weight: normal;
  font-size: $font-size-small;
  font-family: $font-family-no-number;

  .font-weight {
    font-weight: bold;
  }

  .top-part {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: $font-size-small;
    line-height: $font-size-small;
  }

  .bottom-part {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .label {
    width: 62px;
    text-align: center;
  }
}
</style>
