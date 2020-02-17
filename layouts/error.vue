<template>
  <div class="no-data">
    <img src="/incompatible/nodata.png" />
    <p class="error-msg">
      {{ errorMsg }}
    </p>
    <p class="back-home">
      <NuxtLink :to="{ name: '/' }">返回首页</NuxtLink>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    errorMsg: {
      type: String,
      default: '页面不存在',
    },
  },
}
</script>

<style lang="scss" scoped>
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
  min-height: calc(100vh - 180px);

  .error-msg {
    padding: 60px 0 12px;
    font-size: 24px;
    padding-top: 24px;
    color: $color-font-gray;
  }
  .back-home {
    font-size: 14px;
    color: $color-active;
  }
}
</style>
