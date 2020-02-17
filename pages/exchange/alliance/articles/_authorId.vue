<template>
  <div class="articles-wrap">
    <ExpertInfo class="articles-wrap-info card" :author-data="authorData" />
    <NuxtChild class="articles-wrap-detail card" />
  </div>
</template>

<script>
import ExpertInfo from '@/page-components/exchange/articles/expert-info'
import api from '@/api'

export default {
  components: {
    ExpertInfo,
  },
  async asyncData({ app, params }) {
    let urlProfessorMsg = api.get.article.fetchPredictionsUserHot
    urlProfessorMsg = urlProfessorMsg.replace(/\{(.+?)\}/g, params.authorId)

    const authorData = await Promise.resolve(
      app.$axios.get(urlProfessorMsg).then(res => {
        return res.data
      })
    )

    return { authorData }
  },
}
</script>

<style lang="scss" scoped>
.articles-wrap {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  align-content: flex-start;

  .card {
    background-color: $color-white;
    border-radius: 8px;
    box-shadow: 0 0 4px 0 rgba(51, 51, 51, 0.05);
    min-height: calc(100vh - 172px);
  }
  &-info {
    width: 242px;
    margin-right: 12px;
  }
  &-detail {
    flex: 1;
  }
}
</style>
