<template>
  <div class="news-detail-breadcrumb">
    <span>当前位置：</span>
    <span v-for="(item, index) of matched" :key="index">
      <NuxtLink :to="item" v-text="item.title" />
      <i class="breadcrumb-item-icon el-icon-arrow-right" />
    </span>
    <span class="now" v-text="pageTitle" />
  </div>
</template>

<script>
export default {
  props: {
    pageTitle: {
      type: String,
      default() {
        return this.$route.meta.title
      },
    },
  },
  computed: {
    matched() {
      return [
        {
          name: 'intelligence-news-main-id',
          title: '情报中心',
          params: { id: 1 },
        },
        {
          name: 'intelligence-news-main-id',
          title: '时事新闻',
          params: { id: 1 },
        },
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
.news-detail-breadcrumb {
  padding: 4px 0 16px;
  font-size: 12px;
  .breadcrumb-item-icon {
    padding: 0 4px;
  }
  .now {
    color: $color-active;
  }
}
</style>
