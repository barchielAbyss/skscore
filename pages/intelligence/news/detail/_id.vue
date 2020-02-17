<template>
  <div class="intelligence-news-detail">
    <Bbreadcrumb :page-title="detailNews.post.title" />
    <div class="detail">
      <div class="detail-main card">
        <div class="detail-header">
          <h1 class="detail-title" v-text="detailNews.post.title" />
          <p class="detail-msg">
            <span>作者：{{ detailNews.user.nickname }}</span>
            <span>{{ detailNews.post.create_time | timeFormat }}</span>
          </p>
        </div>

        <div class="detail-content" v-html="detailNews.post.content" />
      </div>

      <ArticleList class="article card" :article-list-data="articleListData" />
    </div>
  </div>
</template>

<script>
import xss from 'xss'
import dayjs from 'dayjs'
import Bbreadcrumb from '@/page-components/intelligence/news/breadcrumb'
import ArticleList from '@/page-components/intelligence/news/article-list'
import api from '@/api'

export default {
  filters: {
    timeFormat(value) {
      const timeObj = dayjs.unix(Number(value))
      return `${timeObj.format('YYYY-MM-DD')}`
    },
  },
  components: {
    Bbreadcrumb,
    ArticleList,
  },
  async asyncData({ app, params }) {
    const articleListData = await Promise.resolve(
      app.$axios
        .get(api.get.news.fetchNewsList, { params: { is_hot: -1 } })
        .then(({ data }) => {
          return data
        })
    )

    const detailNews = await Promise.resolve(
      app.$axios
        .get(api.get.news.fetchPostNews, { params: { id: params.id } })
        .then(({ data }) => {
          data.post.title = xss(data.post.title)
          data.post.content = xss(data.post.content)

          return data
        })
    )

    const metaDescription = xss(detailNews.post.content, {
      whiteList: [], // 白名单为空，表示过滤所有标签
      stripIgnoreTag: true, // 过滤所有非白名单标签的HTML
      stripIgnoreTagBody: ['script'], // script标签较特殊，需要过滤标签中间的内容
    })

    return { articleListData, detailNews, metaDescription }
  },
  data() {
    return {
      newsDetail: {},
      userInfo: {},
    }
  },
  head() {
    return {
      title: this.detailNews.post.title,
      meta: [
        {
          hid: 'keywords',
          name: 'keyword',
          content: this.metaDescription,
        },
        {
          hid: 'description',
          name: 'description',
          content: this.metaDescription,
        },
      ],
    }
  },
  watchQuery: ['newsId'],
}
</script>

<style lang="scss" scoped>
.intelligence-news-detail {
  padding-bottom: 12px;
  .card {
    background: #fff;
    box-shadow: 0 0 4px 0 rgba(51, 51, 51, 0.05);
    border-radius: 8px;
    box-sizing: border-box;
  }

  .detail {
    display: flex;
    justify-content: space-between;

    .detail-main {
      width: 751px;
      min-height: calc(100vh - 210px);
      padding: 20px 20px 12px;
      .detail-header {
        padding-bottom: 12px;
        line-height: 32px;
        border-bottom: 1px solid #efefef;
        .detail-msg {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
      .detail-content {
        font-size: 14px;
        color: #666666;
        padding-top: 20px;
        padding-bottom: 12px;
        line-height: 20px;
        text-align: justify;
        /deep/ img {
          margin-bottom: 14px;
        }
      }
    }
  }
  .article {
    width: 237px;
    padding: 14px;
  }
}
</style>
