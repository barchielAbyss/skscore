<template>
  <div class="hot-analysis">
    <p class="title">热门分析</p>

    <ul>
      <li v-for="(item, index) of list" :key="index" :class="['list-item']">
        <NuxtLink
          :to="{
            name: 'exchange-alliance-articles-authorId-articleId',
            params: { articleId: item.articleId, authorId: item.uid },
          }"
        >
          <p class="ctx">{{ item.title | trimFilter }}</p>
          <p class="font-small">{{ item.postTime }}</p>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  filters: {
    trimFilter(value) {
      const original = value.match(/\((.+?)\)/g)
      const temp = value.split('(')[0].replace(/\s/g, '')
      return temp + original
    },
  },
  props: {
    list: { type: Array, default: () => [] },
  },
}
</script>

<style lang="scss" scoped>
.hot-analysis {
  padding: 14px;
  color: #333;
  font-family: $font-family-no-number;
  font-size: $font-size-middle;
  box-shadow: 0 0 4px 0 rgba(51, 51, 51, 0.05);
  background-color: $color-white;
  border-radius: 8px;
  margin-bottom: 12px;

  .title {
    font-weight: bold;
    margin-bottom: 14px;
  }

  .font-small {
    color: #666;
    font-size: $font-size-small;
    margin-top: 7px;
    line-height: $font-size-small;
  }

  .list-item {
    border-top: 1px #efefef solid;
    padding: 12px 0;
  }

  .ctx {
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 20px;
    cursor: pointer;

    &:hover {
      color: $color-active;
    }
  }
}
</style>
