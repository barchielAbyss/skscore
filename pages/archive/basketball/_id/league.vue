<template>
  <div v-loading="loading" class="basketball-detail-league">
    <template v-if="infoData">
      <div class="league-info">
        <h2 class="title info-title"><span>联赛简介</span></h2>
        <div class="content info-main">
          <div class="league-icon">
            <img
              v-lazy="{
                src: infoData.icon,
                loading: '/icon/basketball-event.png',
                error: '/icon/basketball-event.png',
              }"
            />
          </div>
          <p
            :class="[
              'league-text-into',
              {
                'is-empty': !infoData.intro,
              },
            ]"
            v-html="infoData.intro || '暂无简介'"
          />
        </div>
      </div>

      <div class="league-time">
        <h2 class="title time-title"><span>赛季时长</span></h2>
        <EventProgress
          class="content time-main"
          :start="infoData.start_date"
          :end="infoData.end_date"
        />
      </div>
    </template>
  </div>
</template>

<script>
import xss from 'xss'

import api from '@/api'
import EventProgress from '@/page-components/archive/event-progress'

export default {
  components: {
    EventProgress,
  },
  props: {
    yearId: [String, Number],
    eventId: [String, Number],
  },
  data() {
    return {
      loading: false,
      infoData: null,
    }
  },
  watch: {
    eventId: {
      immediate: true,
      handler(value, oldValue) {
        if (value && value !== oldValue) {
          this.fetchEventInfo(value)
        }
      },
    },
  },
  methods: {
    fetchEventInfo(id) {
      this.loading = true
      this.$axios
        .get(api.get.basketball.fetchEventInfo, {
          params: { id },
        })
        .then(({ code, data, msg }) => {
          if (code !== 0 || !data) {
            throw new Error(msg)
          }

          const { intro } = data.info || {}

          const intor = intro
            ? intro.trim().replace(/[\n\r\u3000/]/g, '<br>')
            : ''

          this.infoData = {
            ...data.info,
            intro: xss(intor),
          }
        })
        .catch(() => {
          this.infoData = {}
        })
        .finally(() => {
          this.loading = false
        })
    },
    fetchPercent(value, total) {
      if (!value || !total) {
        return '0%'
      }
      return `${Math.ceil((value / total) * 100)}%`
    },
  },
}
</script>

<style lang="scss" scoped>
.basketball-detail-league {
  /deep/ .title {
    font-weight: bold;
    border-bottom: 1px solid #efefef;
    margin-bottom: 20px;
    > span {
      display: inline-block;
      padding: 10px 0;
      border-bottom: 1px solid $color-active;
      margin-bottom: -1px;
    }
  }
  /deep/ .content {
    margin-bottom: 30px;
  }
  .league-info {
    .content {
      display: flex;
      align-items: flex-start;
    }
    .league-icon {
      width: 70px;
      height: 70px;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #f2f2f2;
      margin-right: 15px;

      img {
        max-height: 100%;
      }
    }
    .league-text-into {
      flex: 1;
      text-align: justify;
      font-size: 12px;
      &.is-empty {
        color: #ccc;
      }
    }
  }
}
</style>
