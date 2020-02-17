<template>
  <div class="country-item">
    <div class="icon">
      <VImage
        :src="dataInfo.icon"
        :error-src="
          sportType === 'football'
            ? '/icon/football-event.png'
            : '/icon/basketball-event.png'
        "
      />
    </div>

    <ClientOnly>
      <div class="select-box">
        <ElPopover
          ref="selectbox"
          :visible-arrow="false"
          :open-delay="300"
          :popper-options="{
            boundariesElement: $parent.$refs.mainList,
          }"
          trigger="hover"
          placement="bottom"
          popper-class="archive-previous-select-popover"
          @after-enter="onOpenPopover"
          @hide="visiblePopover = false"
        >
          <div
            v-show="dataInfo.events && visiblePopover"
            ref="archiveEventList"
            class="archive-previous-event-list"
          >
            <CountryEvent
              v-for="event of dataInfo.events"
              :key="event.id"
              :event="event"
              :sport-type="sportType"
              class="popover"
            />
          </div>

          <div slot="reference" :class="['title', { active: visiblePopover }]">
            <span v-text="dataInfo.name" />
            <i class="iconfont icon-arrow arrow-down" />
          </div>
        </ElPopover>
      </div>
    </ClientOnly>
  </div>
</template>

<script>
import VImage from '@/components/image'
import CountryEvent from './country-event'

export default {
  components: {
    CountryEvent,
    VImage,
  },
  props: {
    dataInfo: {
      type: Object,
      default: () => {},
    },
    sportType: {
      type: String,
      default: 'football',
    },
  },
  data() {
    return {
      visiblePopover: false,
      mouseHeight: 0,
    }
  },
  methods: {
    onOpenPopover() {
      this.visiblePopover = true
      this.$nextTick(() => {
        if (this.$refs.selectbox) {
          this.$refs.selectbox.updatePopper()
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.country-item {
  .icon {
    display: flex;
    width: 78px;
    height: 84px;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border: 1px solid #efefef;
    border-radius: 4px;
  }

  .icon /deep/ img {
    max-height: 100%;
    max-width: 100%;
  }

  .select-box /deep/ .title {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    line-height: 17px;
    border: 1px solid #efefef;
    border-radius: 4px;
    margin: 6px 0 20px;
    padding: 4px 6px;
    color: #666;

    @include transition-all;
    .iconfont {
      font-size: 12px;
    }
    &.active,
    &:hover {
      color: $color-active;
      border-color: $color-active;
    }
  }
}
</style>
