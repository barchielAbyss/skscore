<template>
  <div class="home-page">
    <Events class="banner" />

    <div class="home-page-box">
      <div class="home-page-left">
        <Quick class="home-card" />

        <EventsAll
          class="home-card"
          :football-country-event-list="footballCountryEventList"
          :basketball-country-event-list="basketballCountryEventList"
        />
      </div>
      <div class="home-page-main">
        <News class="home-card" :news="news" />
        <League class="home-card" :league="league" />
        <Experts :article-daily-info="articleDailyInfo" />
      </div>
      <div class="home-page-right">
        <HotTeam class="home-card" :hot-teams="hotTeams" />
        <Scoreboard class="home-card" />
        <AppDownload class="home-card" />
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import Quick from '@/page-components/home/quick'
import Events from '@/page-components/home/events'
import News from '@/page-components/home/news'
import League from '@/page-components/home/league'
import Experts from '@/page-components/home/experts'
import EventsAll from '@/page-components/home/events-all'
import HotTeam from '@/page-components/home/hot-team'
import Scoreboard from '@/page-components/home/scoreboard'
import AppDownload from '@/page-components/home/app-download'

export default {
  components: {
    Quick,
    Events,
    News,
    League,
    Experts,
    EventsAll,
    HotTeam,
    Scoreboard,
    AppDownload,
  },
  async asyncData({ store, $axios }) {
    const footballCountryEventList = await store.dispatch(
      'football/FetchCountryEventList'
    )
    const basketballCountryEventList = await store.dispatch(
      'basketball/FetchCountryEventList'
    )
    const articleDailyInfo = await Promise.resolve(
      $axios
        .get(api.get.article.fetchArticleDailyInfo, { params: { limit: 5 } })
        .then(({ code, data }) => {
          return data.data
        })
    )

    const hotTeams = await Promise.resolve(
      $axios.get(api.get.football.fetchHotTeamList).then(({ data }) => {
        return data
      })
    )

    const news = await Promise.resolve(
      $axios
        .get(api.get.news.fetchImgNewsList, {
          params: {
            size: 5,
          },
        })
        .then(({ data }) => {
          return data.list
        })
    )

    const league = await Promise.resolve(
      $axios
        .get(api.get.common.fetchHotEventList, { params: { category: 1 } })
        .then(({ data }) => {
          return data.list
        })
    )
    return {
      footballCountryEventList,
      basketballCountryEventList,
      articleDailyInfo,
      hotTeams,
      news,
      league,
    }
  },
}
</script>

<style lang="scss">
.home-page {
  .banner {
    margin: 8px 0 10px;
  }
  .home-card {
    margin-bottom: 12px;
    box-shadow: 0 0 4px 0 rgba(51, 51, 51, 0.05);
  }
  .home-page-box {
    display: flex;
    justify-content: space-between;
    .home-page-left {
      position: relative;
      width: 182px;
    }
    .home-page-main {
      width: 578px;
    }
    .home-page-right {
      width: 216px;
    }
  }
}
</style>
