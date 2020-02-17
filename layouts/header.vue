<template>
  <div class="top-header">
    <slot name="logo">
      <NuxtLink class="logo" to="/">
        <img class="logo-img" src="~@/assets/logo.svg" />
        <div class="logo-describe">
          <h1>实况体育</h1>
          <h2>让数据赢得价值</h2>
        </div>
      </NuxtLink>
    </slot>

    <slot />
  </div>
</template>

<style lang="scss">
.top-header {
  display: flex;
  align-items: center;

  // 控制 a 标签触发 active 效果
  .nuxt-link-exact-active,
  .nuxt-link-active {
    color: #333;
  }

  .logo {
    display: flex;
    align-items: center;
    margin-right: 40px;

    .logo-img {
      margin-right: 12px;
    }
    .logo-describe {
      h1 {
        font-size: 20px;
      }
      h2 {
        font-size: 13px;
      }
    }
  }
}
</style>
