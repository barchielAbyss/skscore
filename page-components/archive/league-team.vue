<template>
  <div class="archive-detail__recommend card-style">
    <p class="title">经典联赛推荐</p>
    <div class="hot-team-list">
      <NuxtLink
        v-for="item of hotEventList"
        :key="item.event_id"
        :to="{
          name:
            category === 1
              ? 'archive-football-id-basic'
              : 'archive-basketball-id-basic',
          params: {
            id: item.event_id,
          },
          query:
            String(item.event_id) === String($route.params.id)
              ? $route.query
              : '',
        }"
        class="item-team"
      >
        <div class="team-icon-wrap">
          <img v-lazy="{ src: item.icon }" class="team-icon" />
        </div>
        <p class="icon-name">{{ item.name }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  props: {
    category: { type: Number, default: 1 },
  },
  data() {
    return {
      hotEventList: [],
    }
  },
  watch: {
    category: {
      immediate: true,
      handler: function(val) {
        this.fetchRecommendTeam(val)
      },
    },
  },
  methods: {
    // 获取推荐球队
    fetchRecommendTeam(category) {
      this.$axios
        .get(api.get.common.fetchHotEventList, { params: { category } })
        .then(({ code, data }) => {
          if (code !== 0 || !data) {
            throw new Error('经典联赛推荐数据为空')
          }
          this.hotEventList = data.list
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.card-style {
  background-color: $color-white;
  box-shadow: 0 0 4px 0 rgba(51, 51, 51, 0.05);
  border-radius: 8px;
}

/* 联赛经典推荐 */
.archive-detail__recommend {
  .title {
    padding: 13px 0 0 18px;
    color: $font-title-color;
    font-size: $font-size-middle;
    font-weight: bold;
    line-height: $font-size-middle;
  }

  .item-team {
    width: 56px;
    height: 56px;
    padding: 12px;
    @include transition-all;
    cursor: pointer;
    &:hover {
      height: 80px;
      box-shadow: 0 2px 6px 0 #dedede;
      border-radius: 8px;
      .icon-name {
        color: $color-active;
        opacity: 1;
      }
    }
  }

  .hot-team-list {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 18px 0;
    height: 86px;

    .team-icon-wrap {
      width: 56px;
      height: 56px;
      position: relative;
    }

    .team-icon {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      margin: auto;
      max-width: 100%;
      max-height: 100%;
    }

    .icon-name {
      opacity: 0;
      font-size: $font-size-small;
      color: $font-title-color;
      font-family: $font-family-no-number;
      margin: 12px 0;
      text-align: center;
      @include transition-all;
    }
  }
}
</style>
