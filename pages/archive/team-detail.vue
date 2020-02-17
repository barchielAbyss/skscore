<template>
  <div class="team-detail">
    <div class="breadcrumb">
      <span>当前位置：</span>
      <NuxtLink class="breadcrumb-item" :to="{ name: 'home' }">
        首页
        <i class="breadcrumb-item-icon el-icon-arrow-right" />
      </NuxtLink>

      <NuxtLink
        class="breadcrumb-item"
        :to="{ name: 'archive-previous-type', params: { type: sportType } }"
      >
        {{ sportType === 'football' ? '足球资料库' : '篮球资料库' }}
        <i class="breadcrumb-item-icon el-icon-arrow-right" />
      </NuxtLink>

      <NuxtLink
        class="breadcrumb-item"
        :to="{
          name:
            sportType === 'football'
              ? 'archive-football-id-team'
              : 'archive-basketball-id-team',
          params: { id: eventId },
        }"
      >
        {{ eventName }}
        <i class="breadcrumb-item-icon el-icon-arrow-right" />
      </NuxtLink>

      <span class="breadcrumb-item active" v-text="teamInfo.name_j" />
    </div>

    <TeamHeader class="card" :team-info="teamInfo" />
    <TeamSquad class="card" :team-lineup="teamLineup" />
  </div>
</template>

<script>
import api from '@/api'

import TeamHeader from '@/page-components/archive/team-detail/team-header'
import TeamSquad from '@/page-components/archive/team-detail/team-squad'

export default {
  components: {
    TeamHeader,
    TeamSquad,
  },
  async asyncData({ $axios, query }) {
    const teamInfo = await Promise.resolve(
      $axios
        .get(api.get[query.sportType].fetchTeamInfo, {
          params: {
            id: query.teamId,
          },
        })
        .then(({ data }) => {
          return data
        })
    )

    const teamLineup = await $axios
      .get(api.get[query.sportType].fetchTeamLineup, {
        params: {
          id: query.teamId,
        },
      })
      .then(({ code, data, msg }) => {
        const { coach = {}, players = [] } = data

        let playerList = [
          {
            ...(coach || {}),
            position: '教练',
            number: '',
          },
        ]

        ;(players || []).forEach(item => {
          playerList = [...playerList, ...(item.list || [])]
        })

        return playerList
          .sort((a, b) => Number(a.number) - Number(b.number))
          .map(item => {
            if (item.birthday) {
              item.birthday = item.birthday.replace(/-/g, '/')
            }
            return item
          })
      })

    return {
      teamInfo,
      teamLineup,
    }
  },
  computed: {
    eventId() {
      return this.$route.query.eventId
    },
    eventName() {
      return this.$route.query.eventName
    },
    sportType() {
      return this.$route.query.sportType
    },
  },
  head() {
    return {
      title: `${this.eventName}/${this.teamInfo.name_j}_阵容简介_球队简介`,
      meta: [
        {
          hid: 'keywords',
          name: 'keyword',
          content: `${this.eventName}/${this.teamInfo.name_j},${this.eventName}/${this.teamInfo.name_j}简介,${this.eventName}/${this.teamInfo.name_j}成员`,
        },
        {
          hid: 'description',
          name: 'description',
          content: `实况比分为您提供最新最快的${this.eventName}/${this.teamInfo.name_j}积分榜、射手榜、联赛直播、赛事比分数据统计和分析`,
        },
      ],
    }
  },
}
</script>

<style lang="scss">
.team-detail {
  .card {
    @include card;
  }
  .breadcrumb {
    display: flex;
    align-items: center;
    .breadcrumb-item {
      padding-right: 4px;
      &.active {
        color: $color-active;
      }
    }
    .breadcrumb-item-icon {
      color: #ccc;
    }
  }
}
</style>
