<template>
  <div class="card-info-wrap">
    <p class="title">{{ title }}</p>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.card-info-wrap {
  padding-top: 20px;

  .title {
    padding: 10px 0;
    position: relative;
    margin-bottom: 20px;
    border-bottom: 1px #efefef solid;
    font-weight: bold;
    color: $font-title-color;
    font-family: $font-family-no-number;
    font-size: $font-size-middle;
  }

  .title:after {
    content: ' ';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 56px;
    height: 1px;
    background-color: $color-active;
  }
}
</style>
