<template>
  <div class="article-list">
    <div v-if="list.length">
      <p class="list-title">热点新闻推送</p>

      <ul class="items-wrap">
        <li
          v-for="(item, index) of list"
          :key="index"
          :class="[
            'list-item',
            { 'item-active': $route.params.id === item.id },
          ]"
        >
          <NuxtLink
            class="set-ctx"
            :to="{
              name: 'intelligence-news-detail-id',
              params: {
                id: item.id,
              },
            }"
          >
            [{{ item.tag }}] {{ item.title | dataFormat }} &nbsp;
            {{ item.content | dataFormat }}
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div v-else>
      <p class="list-title">暂无新闻</p>
    </div>
  </div>
</template>

<script>
// 接接口时用 xss
import xss from 'xss'
const NUM_NEWS = 7

export default {
  name: 'ArticleList',
  filters: {
    dataFormat(value) {
      return xss(value)
    },
  },
  props: {
    articleListData: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      list: [],
    }
  },
  watch: {
    articleListData: {
      immediate: true,
      handler(value) {
        this.list = value.list.slice(0, NUM_NEWS)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.article-list {
  font-size: $font-size-small;
  font-family: $font-family-no-number;
  color: #333;

  .list-title {
    font-size: $font-size-middle;
    font-weight: bold;
  }

  .items-wrap {
    min-height: 300px;
    overflow: auto;
  }

  .list-item {
    padding-bottom: 12px;
    border-bottom: 1px #efefef solid;
    margin-top: 20px;

    &:last-of-type {
      border-bottom: none;
    }

    &:hover {
      cursor: pointer;
      color: $color-active;
    }

    &.item-active {
      color: $color-active;
    }
  }

  .set-ctx {
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
