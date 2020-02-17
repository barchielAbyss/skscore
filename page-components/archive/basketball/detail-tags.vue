<template>
  <div class="detail-tag">
    <div class="detail-tag-header card">
      <div class="header-title">
        <div class="title">
          <VImage
            :src="eventInfo.icon"
            error-img="~/assets/icon/basketball-event.png"
            class="icon"
          />
          <p class="name">
            {{ curYear.label }}赛季{{ eventInfo.name_s }}
            {{ $route.meta.title }}
          </p>
        </div>

        <VSelect
          :value="Number(yearId)"
          :options="yearOptions"
          :width="100"
          class="select-wrap"
          size="small"
          @change="handleChangeYearId"
        />
      </div>
      <div class="tab-select">
        <NuxtLink
          v-for="tab of tabs"
          :key="tab.name"
          :to="{ name: tab.name, params: $route.params, query: $route.query }"
          class="tab-item"
          v-text="tab.title"
        />
      </div>
    </div>

    <NuxtChild
      class="card height-style"
      :event-id="eventId"
      :year-id="yearId"
    />
  </div>
</template>

<script>
import VSelect from '@/components/popover-select'
import VImage from '@/components/image'

const TABS = [
  { name: 'archive-basketball-id-basic', title: '基础数据' },
  { name: 'archive-basketball-id-competition', title: '赛程' },
  { name: 'archive-basketball-id-league', title: '联赛简介' },
  { name: 'archive-basketball-id-team', title: '球队简介' },
]

export default {
  components: {
    VSelect,
    VImage,
  },
  props: {
    eventInfo: {
      type: Object,
      default: () => ({}),
    },
    yearOptions: {
      type: Array,
      default: () => [],
    },
    yearId: [String, Number],
    eventId: [String, Number],
  },
  computed: {
    tabs: () => TABS,
    curYear() {
      return (
        (this.yearOptions || []).find(
          item => Number(item.value) === Number(this.yearId)
        ) || {}
      )
    },
  },
  methods: {
    handleChangeYearId(value) {
      this.$router.replace({
        query: {
          yearId: value,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.detail-tag {
  .height-style {
    min-height: calc(100vh - 477px);
    /*height: calc(100% - 154px);*/
  }
  .detail-tag-header {
    &.card {
      padding-bottom: 10px;
    }
    .header-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1px solid #efefef;
      .title {
        display: flex;
        align-items: center;
      }
      .icon {
        max-width: 40px;
        max-height: 40px;
      }
      .name {
        font-size: 18px;
        padding-left: 8px;
        font-weight: bold;
      }
    }
    .year-select {
      /deep/ .title {
        border: 1px solid #efefef;
        font-size: 12px;
        padding: 4px 8px;
      }
    }
  }
  .tab-select {
    display: flex;
    text-align: center;
    padding-top: 12px;
    .tab-item {
      position: relative;
      width: 5em;
      margin-right: 1em;
      display: block;
      &.nuxt-link-active {
        color: $color-active;
        &::before {
          content: '';
          display: block;
          position: absolute;
          width: 26px;
          height: 1px;
          background: $color-active;
          transform: translateX(-50%);
          bottom: -10px;
          left: 50%;
        }
      }
    }
  }
}
</style>
