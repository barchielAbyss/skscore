<template>
  <div class="pops-title">
    <span
      class="team text-ellipsis home"
      :title="home.name"
      v-text="setting.lang === 'zh' ? home.name : home.name_e"
    />
    <span class="vs">vs</span>
    <span
      class="team text-ellipsis guest"
      :title="guest.name"
      v-text="setting.lang === 'zh' ? guest.name : guest.name_e"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    home: Object,
    guest: Object,
  },
  computed: {
    ...mapState('competition-football', ['setting']),
  },
}
</script>

<style lang="scss" scoped>
.pops-title {
  font-weight: bold;
  background-color: $color-white;
  font-size: $font-size-small;
  line-height: $font-size-small;
  color: $color-active;
  display: flex;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  padding: 12px 0 11px 0;
  justify-content: center;
  .vs {
    width: 53px;
    text-align: center;
  }
  .home {
    text-align: right;
  }
}
</style>
