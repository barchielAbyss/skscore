<template>
  <div class="search">
    <i class="iconfont icon-search" :title="'搜索'" @click="handleSearch" />
    <GlobalSearch :visible.sync="shwoSearch" @submit="onSubmit" />
  </div>
</template>

<script>
import GlobalSearch from '@/page-components/header/global-search'

export default {
  components: {
    GlobalSearch,
  },
  data() {
    return {
      shwoSearch: false,
    }
  },
  methods: {
    handleSearch() {
      this.shwoSearch = true
    },
    onSubmit(value) {
      this.$emit('submit', value)
    },
  },
}
</script>

<style lang="scss" scoped>
.search {
  padding: 0 16px;
  height: 60px;
  line-height: 60px;
  cursor: pointer;
  &:hover {
    background-color: rgb(24, 30, 57);
  }
}
</style>
