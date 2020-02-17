<template>
  <div class="archive-previous card">
    <div class="archive-previous__title">
      <ul class="title-tools">
        <li
          v-for="country of countryTypes"
          :key="country.id"
          :class="[
            'title-item',
            {
              active: country.id === curContinentId,
            },
          ]"
          @click="handleChangeContinentId(country.id)"
          v-text="country.name"
        />
      </ul>

      <ClientOnly>
        <VSelect
          :value="sportType"
          :options="sportTypeOptions"
          @change="handleChangeSportType"
        />
      </ClientOnly>
    </div>

    <div ref="mainList" v-loading="loading" class="archive-previous__main">
      <CountryItem
        v-for="item of countryList"
        :key="item.id"
        :data-info="item"
        :sport-type="sportType"
        class="archive-previous__main-item"
      />
    </div>
  </div>
</template>

<script>
import CountryItem from '@/page-components/archive/previous/country-item'
import VSelect from '@/components/popover-select'

const SPORT_TYPES = [
  { value: 'football', label: '足球' },
  { value: 'basketball', label: '篮球' },
]

const CONTINENT_EVENT_IDS = {
  football: [
    { id: 0, name: '全部赛事' },
    { id: 1101, name: '欧洲赛事' },
    { id: 1102, name: '美洲赛事' },
    { id: 1103, name: '亚洲赛事' },
    { id: 1104, name: '大洋洲/非洲' },
    { id: 1105, name: '其他赛事' },
  ],
  basketball: [
    { id: 0, name: '全部赛事' },
    { id: 1103, name: '美洲赛事' },
    { id: 1104, name: '亚洲赛事' },
    { id: 1105, name: '欧洲赛事' },
    { id: 1106, name: '澳洲赛事' },
    { id: 1107, name: '非洲赛事' },
    { id: 1102, name: '其他赛事' },
  ],
}

export default {
  components: {
    VSelect,
    CountryItem,
  },
  async asyncData({ store }) {
    const footballCountryEventList = await store.dispatch(
      'football/FetchCountryEventList'
    )
    const basketballCountryEventList = await store.dispatch(
      'basketball/FetchCountryEventList'
    )

    const allList = Object.freeze({
      football: (footballCountryEventList || []).reduce((prev, item) => {
        if (item.country) {
          prev.push(...item.country)
        }

        return prev
      }, []),
      basketball: (basketballCountryEventList || []).reduce((prev, item) => {
        if (item.country) {
          prev.push(...item.country)
        }

        return prev
      }, []),
    })

    return { allList, footballCountryEventList, basketballCountryEventList }
  },
  data() {
    return {
      curContinentId: 0,
      countryList: [],
      loading: false,
    }
  },
  computed: {
    sportType() {
      return this.$route.params.type
    },
    sportTypeOptions: () => SPORT_TYPES,
    countryTypes() {
      return CONTINENT_EVENT_IDS[this.sportType]
    },
  },
  watch: {
    sportType() {
      this.setCountryList()
    },
  },
  mounted() {
    this.setCountryList()
  },
  methods: {
    setCountryList() {
      this.loading = true
      this.fetchCountryList().then(list => {
        this.countryList = list
        this.loading = false
      })
    },
    handleChangeSportType(value) {
      this.curContinentId = 0

      this.$router.push({
        params: {
          type: value || this.sportType,
        },
      })
    },
    fetchCountryList() {
      const curEventList =
        this.sportType === 'football'
          ? this.footballCountryEventList
          : this.basketballCountryEventList

      if (!this.curContinentId) {
        return Promise.resolve(this.allList[this.sportType])
      } else {
        const curItem = curEventList.find(
          item => Number(item.id) === Number(this.curContinentId)
        )

        return Promise.resolve(curItem ? curItem.country : [])
      }
    },
    handleChangeContinentId(id) {
      this.curContinentId = id
      this.setCountryList()
    },
  },
}
</script>

<style lang="scss" scoped>
.archive-previous {
  &.card {
    background-color: $color-white;
    padding-bottom: 1px;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.03);
    border-radius: 4px;
  }

  .archive-previous__title {
    display: flex;
    padding: 14px 14px 14px 0;
    justify-content: space-between;
    border-bottom: 1px solid #efefef;
    .title-tools {
      display: flex;
    }
    .title-item {
      cursor: pointer;
      width: 96px;
      text-align: center;
      border-right: 1px solid #efefef;
      &:last-of-type {
        border-right: none;
      }
      &.active {
        color: $color-active;
        font-weight: bold;
      }
    }
  }
  .archive-previous__main {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    margin: 20px 3px 20px -6px;
    height: calc(100vh - 260px);
    overflow: auto;
    @include scrollbar;
  }
  .archive-previous__main-item {
    width: 100px;
    margin-left: 23px;
    .popover {
      line-height: 26px;
    }
  }
}
</style>

<style lang="scss">
.archive-previous-select-popover.el-popper {
  margin: 0;
  padding: 0;
  min-width: 100px;
  box-shadow: 0 2px 6px 0 rgba(30, 38, 71, 0.2);
  .archive-previous-event-list {
    max-height: 320px;
    overflow: auto;
    @include tiny-scrollbar;
  }
}
</style>
