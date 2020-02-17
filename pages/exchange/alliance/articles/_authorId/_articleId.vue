<template>
  <div>
    <ExpertDetail :article-msg="articleData" />
  </div>
</template>

<script>
import xss from 'xss'
import dayjs from 'dayjs'
import api from '@/api'
import ExpertDetail from '@/page-components/exchange/articles/expert-detail'

export default {
  components: {
    ExpertDetail,
  },
  async asyncData({ params, app }) {
    let urlCountOfRead = api.get.article.fetchPredictionVList
    urlCountOfRead = urlCountOfRead.replace(/\{(.+?)\}/g, params.articleId)
    await Promise.resolve(app.$axios.get(urlCountOfRead))

    let urlArticleMsg = api.get.article.fetchPrediction
    urlArticleMsg = urlArticleMsg.replace(/\{(.+?)\}/g, params.articleId)

    const articleData = await Promise.resolve(
      app.$axios.get(urlArticleMsg).then(({ data }) => {
        const ctx = xss(data.content, {
          onIgnoreTag(tag, html) {
            if (['svg', 'path'].includes(tag)) {
              return html
            }
          },
        })
        const timeObj = dayjs(new Date(data.postTime).getTime())
        const postTime = `${timeObj.format('YYYY-MM-DD')}`
        const title = xss(data.title)

        return { match: data.match, title, postTime, ctx }
      })
    )

    return { articleData }
  },
  head() {
    return {
      title: this.articleData.title,
      meta: [
        {
          hid: 'keywords',
          name: 'keyword',
          content: `${this.articleData.match.homeTeam.name},${this.articleData.match.awayTeam.name}`,
        },
        {
          hid: 'description',
          name: 'description',
          content: `${this.articleData.title}实况比分网为广大球迷提供最专业的热门足球赛事推介、预测分析，囊括每日最新竞彩足球推荐,专家预测和赛事分析。`,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.card {
  background-color: $color-white;
  border-radius: 8px;
  box-shadow: 0 0 4px 0 rgba(51, 51, 51, 0.05);
  min-height: calc(100vh - 172px);
}
</style>
