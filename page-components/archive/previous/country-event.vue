<template>
  <div
    class="country-event"
    @mouseenter="handleMouseenterItem"
    @mouseleave="handleMouseleaveItem"
  >
    <div v-show="showPopover" ref="popover" class="country-events-year">
      <ul
        v-loading="!!!yearList"
        element-loading-spinner="el-icon-loading"
        element-loading-custom-class="year-loading"
        class="country-events-year-list"
      >
        <li v-for="year of yearList" :key="year.id" class="year-item">
          <NuxtLink
            :to="{
              name:
                sportType === 'football'
                  ? 'archive-football-id-basic'
                  : 'archive-basketball-id-basic',
              params: { id: event.id },
              query: {
                yearId: year.id,
              },
            }"
            class="year-item__link"
            v-text="year.title"
          />
        </li>
      </ul>
    </div>

    <div ref="title" :class="['country-event-title', { active: showPopover }]">
      <span
        v-text="event.name_js || event.name_j || event.name_s || event.name"
      />
      <VIcon name="arrow" />
    </div>
  </div>
</template>

<script>
import api from '@/api'
import VIcon from '@/components/icon'

export default {
  components: {
    VIcon,
  },
  props: {
    event: {
      type: Object,
      default: () => ({}),
    },
    sportType: {
      type: String,
      default: 'football',
    },
  },
  data() {
    return {
      showPopover: false,
      yearList: null,
    }
  },
  methods: {
    handleMouseenterItem() {
      this.showPopover = true
      this.fetchYearList()
    },
    handleMouseleaveItem() {
      this.showPopover = false
    },
    resetPosition() {
      const $archiveEventList = this.$parent.$parent.$refs.archiveEventList
      const $popoverEl = this.$refs.popover
      if (!$archiveEventList) {
        return
      }

      const titleElTop = this.$refs.title.offsetTop
      const parentScrollTop = $archiveEventList.scrollTop
      $popoverEl.style.top = `${titleElTop - parentScrollTop}px`

      const elOffsetTop = titleElTop - parentScrollTop
      const wHeight = window.innerHeight
      const elHeight = $popoverEl.offsetHeight
      const elTop = $popoverEl.getBoundingClientRect().top
      const res = elHeight + elTop - wHeight + 88

      if (res > 0) {
        $popoverEl.style.top = `${elOffsetTop - res}px`
      }
    },
    fetchYearList() {
      this.$nextTick(() => {
        this.resetPosition()
      })
      if (this.yearList) {
        return
      }
      this.$axios
        .get(api.get.football.fetchSeasonList, {
          params: {
            event_id: this.event.id,
          },
        })
        .then(({ code, data, msg }) => {
          if (code !== 0) {
            throw new Error(msg)
          }
          this.yearList = data.list

          this.$nextTick(() => {
            this.resetPosition()
          })
        })
        .catch(() => {
          if (this.yearList) {
            this.yearList = null
          }
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.country-event {
  .country-event-title {
    cursor: pointer;
    padding: 0 7px 0 14px;
    line-height: 26px;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @include transition-all;
    &.active {
      background-color: #e7f1fe;
      color: $color-active;
    }
  }

  .country-events-year {
    position: absolute;
    left: 94%;
    width: 100px;
    font-size: 12px;
    text-align: center;
    padding-left: 10px;
    /deep/ .year-loading {
      margin-top: 26px;
    }
    &-list {
      overflow: hidden;
      min-height: 26px;
      background-color: $color-white;
      box-shadow: 0 2px 6px 0 rgba(30, 38, 71, 0.2);
    }

    .year-item {
      padding: 0 14px;
      line-height: 26px;
      .year-item__link {
        display: block;
      }
      &:hover {
        background-color: #e7f1fe;
        .year-item__link {
          color: $color-active;
        }
      }
    }
  }
}
</style>
