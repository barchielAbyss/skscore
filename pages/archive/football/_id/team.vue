<template>
  <div class="archive-team">
    <a
      v-for="team of teams"
      :key="team.id"
      :href="
        $router.resolve({
          name: 'archive-team-detail',
          query: {
            eventId: $route.params.id,
            eventName: $parent.eventInfo.name_js,
            sportType: 'football',
            teamId: team.id,
          },
        }).href
      "
      class="team-item"
    >
      <div class="team-item__image">
        <img v-lazy="team.icon" />
      </div>
      <p class="team-item__name" v-text="team.name_j" />
    </a>

    <div v-if="!teams.length" class="empty">
      暂无数据
    </div>
  </div>
</template>

<script>
import api from '@/api'

export default {
  asyncData({ $axios, params, query }) {
    return $axios
      .get(api.get.common.fetchEventTeams, {
        params: {
          event_id: params.id,
          season_id: query.yearId,
          category: 1,
        },
      })
      .then(({ code, data, msg }) => {
        return {
          teams: data || [],
        }
      })
  },
  data() {
    return {
      teams: [],
      sourceToken: null,
    }
  },
  watchQuery: ['yearId'],
}
</script>

<style lang="scss" scoped>
.archive-team {
  padding: 30px 10px 0 10px;
  .empty {
    width: 100%;
    line-height: 200px;
    text-align: center;
  }
  .team-item {
    display: inline-block;
    width: 16.66%;
    margin-bottom: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
    border-radius: 4px;
  }
  .team-item__image {
    width: 76px;
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
    > img {
      max-height: 100%;
    }
  }
}
</style>
