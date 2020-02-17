<template>
  <div class="intelligence-news">
    <MainSection class="section card" :news-list="newsList" />
    <ArticleList class="article card" :article-list-data="articleListData" />
  </div>
</template>

<script>
import MainSection from '@/page-components/intelligence/news/main-section'
import ArticleList from '@/page-components/intelligence/news/article-list'

export default {
  components: {
    MainSection,
    ArticleList,
  },
  async asyncData({ app, store, params }) {
    const articleListData = await store.dispatch(
      'intelligence-news/fetchNewsList',
      { params: { is_hot: -1 } }
    )

    const newsList = await store.dispatch('intelligence-news/fetchNewsList', {
      params: {
        is_hot: -1,
        page: params.id,
        size: 5,
      },
    })

    return { articleListData, newsList }
  },
  data() {
    return {
      detailTitle: '',
    }
  },
}
</script>

<style lang="scss" scoped>
.intelligence-news {
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;

  .card {
    background: $color-white;
    box-shadow: 0 0 4px 0 rgba(51, 51, 51, 0.05);
    border-radius: 8px;
    box-sizing: border-box;
    min-height: calc(100vh - 172px);
  }

  .section {
    width: 751px;
    padding: 20px;
  }

  .article {
    width: 237px;
    padding: 14px;
  }
}
</style>
