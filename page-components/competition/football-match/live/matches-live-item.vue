<template>
  <a
    :class="[
      'match-video-list-item',
      { active: Number($route.params.id) === Number(dataInfo.id) },
    ]"
    :href="
      $router.resolve({
        name: 'competition-football-match-id-video',
        params: {
          id: dataInfo.id,
        },
      }).href
    "
  >
    <span
      :title="dataInfo.event.name"
      class="event"
      v-text="dataInfo.event.name"
    />
    <span
      :title="dataInfo.home.name"
      class="home-team"
      v-text="dataInfo.home.name"
    />
    <div class="vs">
      <p
        class="time"
        :class="{ 'has-sec': Boolean(Number(matchStatus)) }"
        v-text="matchStatus"
      />
      <p class="score">
        {{ dataInfo.home_goal_all }}-{{ dataInfo.guest_goal_all }}
      </p>
    </div>
    <span
      :title="dataInfo.guest.name"
      class="guest-team"
      v-text="dataInfo.guest.name"
    />
  </a>
</template>

<script>
import { mapState } from 'vuex'
import { fetchFootballMatchTime } from '@/utils/status'

export default {
  props: {
    dataInfo: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState('user', ['serverTime']),
    matchStatus() {
      const { status = 0, t_start_time: tStartTime } = this.dataInfo
      return fetchFootballMatchTime(status, tStartTime, this.serverTime)
    },
  },
}
</script>

<style lang="scss" scoped>
.match-video-list-item {
  cursor: pointer;
  padding: 18px 6px 11px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  border-top: 1px solid #efefef;
  color: #666;
  text-align: center;
  white-space: nowrap;
  &.active {
    color: $color-active;
  }

  &:hover {
    color: $color-active;
  }

  .event {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 4em;
    text-align: left;
  }
  .vs {
    position: relative;
    width: 46px;
    .score {
      color: #00a54f;
    }
    .time {
      position: absolute;
      top: -20px;
      left: 0;
      width: 100%;
      font-size: 20px;
      transform: scale(0.5);
      color: #e1243b;
    }
  }
  .home-team,
  .guest-team {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 84px;
  }

  .home-team {
    text-align: right;
  }
  .guest-team {
    text-align: left;
  }
}
</style>
