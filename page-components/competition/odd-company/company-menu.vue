<template>
  <ul class="company-menu">
    <li
      v-for="item of navList"
      :key="item.value"
      :class="[
        'company-menu-item',
        { active: Number(item.value) === Number(curNav) },
      ]"
    >
      <NuxtLink
        :to="{ query: { ...$route.query, companyId: item.value } }"
        class="link"
        v-text="item.label"
      />
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    navList: Array,
    curNav: [Number, String],
  },
}
</script>

<style lang="scss" scoped>
.company-menu {
  border: 1px solid #f3f4f7;
  .company-menu-item {
    font-size: 12px;
    text-align: center;
    line-height: 36px;
    background-color: #f3f4f7;
    border-bottom: 1px solid $color-white;
    border-left: 4px solid transparent;
    &:last-of-type {
      border-bottom: none;
    }
    &.active {
      background-color: $color-white;
      color: $color-active;
      border-left-color: $color-active;
    }
    .link {
      display: block;
    }
  }
}
</style>
