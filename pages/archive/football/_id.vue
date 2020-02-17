<template>
  <div class="archive-detail">
    <League />
    <div class="archive-detail__mian">
      <div class="main-search-tree card">
        <ClientOnly>
          <SearchTree
            ref="articleLeft"
            :country-list="countryEventList"
            :expanded-keys="eventInfo.path"
            @change="handleChangeEvent"
          />
        </ClientOnly>
      </div>

      <div class="main-content-section">
        <div class="tag-title card">
          <div class="tag-title-top">
            <div class="top-ctx">
              <img
                v-lazy="{
                  src: eventInfo.icon,
                  loading: '/icon/football-event.png',
                  error: '/icon/football-event.png',
                }"
                :alt="`${eventInfo.name_js || eventInfo.name} ${curTag.title}`"
                class="competition-icon"
              />
              <span
                class="competition-text"
                v-text="
                  `${eventInfo.name_js || eventInfo.name} ${curTag.title}`
                "
              />
            </div>

            <VSelect
              :value="Number(yearId)"
              :width="100"
              :options="yearOptions"
              class="select-wrap"
              size="small"
              @change="handleChangeYear"
            />
          </div>

          <div class="tag-title-nav">
            <NuxtLink
              v-for="item of tagNav"
              :key="item.name"
              :to="{
                name: item.name,
                params: $route.params,
                query: $route.query,
              }"
              v-text="item.title"
            />
          </div>
        </div>

        <NuxtChild
          class="card card-height"
          :event-id="eventId"
          :year-id="yearId"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { CancelToken } from 'axios'

import api from '@/api'
import VSelect from '@/components/popover-select'
import League from '@/page-components/archive/league-team'
import SearchTree from '@/page-components/archive/search-tree'

const TAG_LIST = [
  { name: 'archive-football-id-basic', title: '基础数据' },
  { name: 'archive-football-id-competition', title: '赛程' },
  { name: 'archive-football-id-integral', title: '积分榜' },
  { name: 'archive-football-id-shooter', title: '射手榜' },
  { name: 'archive-football-id-league', title: '联赛简介' },
  { name: 'archive-football-id-team', title: '球队简介' },
]

export default {
  components: {
    VSelect,
    SearchTree,
    League,
  },
  async asyncData({ store, $axios }) {
    const countryEventList = await store.dispatch(
      'football/FetchCountryEventList'
    )

    const hotEventList = await Promise.resolve(
      $axios
        .get(api.get.common.fetchHotEventList, {
          params: { category: 1 },
        })
        .then(({ data }) => {
          return data.list
        })
    )

    const flatedList = Object.freeze(
      (countryEventList || []).reduce((prev, item) => {
        item.country.forEach(country => {
          country.events.forEach(event => {
            prev.push({
              ...event,
              path: [item.id, country.id, event.id],
            })
          })
        })

        return prev
      }, [])
    )

    return {
      hotEventList,
      countryEventList,
      flatedList,
    }
  },
  data() {
    return {
      yearOptions: [],
      sourceToken: null,
    }
  },
  computed: {
    yearId() {
      return Number(this.$route.query.yearId)
    },
    eventId() {
      return Number(this.$route.params.id)
    },
    tagNav() {
      return TAG_LIST
    },
    curTag() {
      return TAG_LIST.find(item => item.name === this.$route.name)
    },
    eventInfo() {
      return this.flatedList.find(
        item => Number(item.id) === Number(this.eventId)
      )
    },
  },
  watch: {
    eventId() {
      this.handleChangeEvent()
    },
  },
  mounted() {
    this.handleChangeEvent({
      yearId: this.yearId,
    })
  },
  methods: {
    handleChangeEvent: debounce(function(data = {}) {
      if (data.id === this.eventInfo.id) {
        return
      }
      if (!data.id) {
        data = {
          ...this.eventInfo,
          ...data,
        }
      }

      this.fetchYearList(data.id).then(() => {
        this.$router.replace({
          params: {
            id: data.id,
          },
          query: {
            yearId: data.yearId || this.yearOptions[0].value,
          },
        })
      })
    }, 500),
    handleChangeYear(value) {
      this.$router.replace({
        query: {
          yearId: value,
        },
      })
    },
    fetchYearList(id) {
      this.sourceToken && this.sourceToken.cancel()

      this.sourceToken = CancelToken.source()
      return this.$axios
        .get(api.get.football.fetchSeasonList, {
          params: {
            event_id: id,
          },
          cancelToken: this.sourceToken.token,
        })
        .then(({ code, data, msg }) => {
          if (code !== 0) {
            throw new Error(msg)
          }
          this.yearOptions = data.list.map(item => ({
            label: item.title,
            value: item.id,
          }))
        })
        .catch(() => {
          this.yearOptions = []
        })
    },
  },
  head() {
    return {
      title: `${this.eventInfo.name_js}_基础数据_赛程_积分榜_射手榜_联赛`,
      meta: [
        {
          hid: 'keywords',
          name: 'keyword',
          content: `${this.eventInfo.name_js},${this.eventInfo.name_js}积分榜,${this.eventInfo.name_js}赛程`,
        },
        {
          hid: 'description',
          name: 'description',
          content: `实况比分为您提供最新最快的${this.eventInfo.name_js}积分榜、射手榜、联赛直播、赛事比分数据统计和分析`,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.archive-detail {
  .card {
    background-color: $color-white;
    box-shadow: 0 0 4px 0 rgba(51, 51, 51, 0.05);
    border-radius: 8px;
  }

  .card-height {
    min-height: calc(100vh - 479px);
  }

  .archive-detail__mian {
    margin: 12px 0;
    display: flex;
    justify-content: space-between;
  }

  .main-search-tree {
    width: 150px;
    padding: 24px 16px;
    min-height: calc(100vh - 381px);
  }

  .main-content-section {
    width: 806px;
    /* 右部二级导航 */
    .tag-title {
      margin-bottom: 12px;

      .tag-title-top {
        height: 60px;
        padding: 0 14px;
        justify-content: space-between;
        align-items: center;
        display: flex;

        div.top-ctx {
          display: flex;
          align-items: center;
        }

        span.competition-text {
          white-space: pre;
          color: $font-title-color;
          font-size: $font-size-large;
          font-family: $font-family-no-number;
        }

        .competition-icon {
          height: 40px;
          margin-right: 14px;
        }
      }

      .tag-title-nav {
        border-top: 1px #efefef solid;
        padding: 11px 8px;

        a {
          position: relative;
          margin: 0 20px;
          color: $font-title-color;
          font-family: $font-family-no-number;
          font-size: $font-size-middle;
        }

        .nuxt-link-active {
          font-weight: bold;
          color: $color-active;

          &:after {
            content: '';
            width: 26px;
            height: 1px;
            background-color: $color-active;
            position: absolute;
            bottom: -12px;
            left: 50%;
            transform: translate(-50%);
          }
        }
      }
    }
  }
}
</style>
