<template>
  <div class="archive-basketball-detail">
    <League :category="2" />
    <div class="archive-basketball-detail__mian">
      <div class="main-search-tree card">
        <ClientOnly>
          <SearchTree
            ref="articleLeft"
            :country-list="countryEventList"
            :expanded-keys="eventInfo.path"
          />
        </ClientOnly>
      </div>

      <DetailTags
        :event-info="eventInfo"
        :year-options="yearOptions"
        :event-id="eventId"
        :year-id="yearId"
        class="detail-content"
      />
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { CancelToken } from 'axios'

import api from '@/api'

import League from '@/page-components/archive/league-team'
import SearchTree from '@/page-components/archive/search-tree'

import DetailTags from '@/page-components/archive/basketball/detail-tags'

export default {
  components: {
    SearchTree,
    League,
    DetailTags,
  },
  async asyncData({ store, $axios, query }) {
    const countryEventList = await store.dispatch(
      'basketball/FetchCountryEventList'
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
      countryEventList,
      flatedList,
    }
  },
  data() {
    return {
      selectOpt: {},
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
    fetchYearList(id) {
      this.sourceToken && this.sourceToken.cancel()
      this.sourceToken = CancelToken.source()

      return this.$axios
        .get(api.get.basketball.fetchSeasonList, {
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
      title: `${this.eventInfo.name_s}_基础数据_赛程_联赛简介_球队简介`,
      meta: [
        {
          hid: 'keywords',
          name: 'keyword',
          content: `${this.eventInfo.name_s},${this.eventInfo.name_s}积分榜,${this.eventInfo.name_s}赛程`,
        },
        {
          hid: 'description',
          name: 'description',
          content: `实况比分为您提供最新最快的${this.eventInfo.name_s}积分榜、射手榜、联赛直播、赛事比分数据统计和分析`,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.archive-basketball-detail {
  /deep/ .card {
    @include card;
  }

  .archive-basketball-detail__mian {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
  }
  .main-search-tree {
    width: 158px;
    min-height: 518px;
  }
  .detail-content {
    width: 806px;
  }
}
</style>
