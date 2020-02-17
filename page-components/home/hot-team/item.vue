<template>
  <NuxtLink
    class="hot-team-item"
    :to="{
      name: 'archive-team-detail',
      query: {
        eventId: event.event_id,
        eventName: event.name,
        sportType: 'football',
        teamId: info.team_id,
      },
    }"
  >
    <div class="hot-team-item__icon">
      <img v-lazy="info.icon" />
    </div>
    <div class="hot-team-item__into">
      <p class="into-title">
        <span class="into-name" :title="info.name">{{ info.name }}</span>
        <span v-if="event && info.rank" class="into-league" :title="event.name">
          <img
            v-lazy="{
              src: event.icon,
              loading: '/icon/football-event.png',
              error: '/icon/football-event.png',
            }"
            class="into-league__icon"
          />
          <span class="into-league__level"> NO.{{ info.rank }} </span>
        </span>
      </p>
      <p class="into-results">
        <span>最近走势：</span>
        <span
          v-for="(item, index) of info.results"
          :key="index"
          :style="{
            color: item === 1 ? '#e1243b' : '#808290',
          }"
          v-text="fetchTeamTrend(item)"
        />
      </p>
    </div>
  </NuxtLink>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
    event: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    fetchTeamTrend(type) {
      return (
        {
          '1': '胜',
          '2': '平',
          '3': '负',
        }[type] || '断'
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.hot-team-item {
  padding: 12px 4px;
  display: flex;
  border-radius: 8px;
  &:hover {
    color: #000;
  }
  .hot-team-item__icon {
    width: 32px;
    height: 32px;
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon-default-team {
      font-size: 32px;
      color: #999;
    }
    > img {
      max-height: 100%;
    }
  }
  .hot-team-item__into {
    .into-title {
      display: flex;
      align-items: center;
      font-weight: bold;
    }
    .into-name {
      font-size: 14px;
      padding-right: 10px;
      max-width: 60%;
      white-space: nowrap;
    }
    .into-league {
      background-color: #eaeaea;
      color: #333;
      padding: 1px 2px 0;
      line-height: 1;
      border-radius: 10px;
      display: flex;
      .into-league__icon {
        width: 10px;
        height: 10px;
        margin-right: 4px;
        background-color: $color-white;
        border-radius: 50%;
      }
      .into-league__level {
        display: inline-block;
        font-size: 12px;
        transform: scale(0.8);
      }
    }
    .into-results {
      font-size: 12px;
    }
  }
}
</style>
