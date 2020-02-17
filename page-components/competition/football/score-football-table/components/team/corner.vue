<template>
  <div class="team-corner">
    <p class="color-corner">{{ corner ? corner : '-' }}</p>
    <p class="color-half">{{ halfScore ? halfScore : '-' }}</p>
  </div>
</template>

<script>
export default {
  props: {
    halfScore: { type: String },
    corner: { type: String },
  },
}
</script>

<style lang="scss" scoped>
.team-corner {
  font-size: $font-size-small;
  color: $color-font-base;

  .color-corner {
    color: $color-active;
  }

  .color-half {
    color: #999;
  }
}
</style>
