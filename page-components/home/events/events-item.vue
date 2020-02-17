<template>
  <a :href="matchInfoUrl" target="_blank" class="home-events-item">
    <div class="home-events-item__title" :title="eventInfo.event">
      <p
        class="font-style"
        :title="statusType"
        :class="{
          'has-sec': Boolean(Number(statusType)),
        }"
      >
        {{ statusType === '未' ? dateShow : statusType }}
      </p>
      <span class="font-style">{{ eventInfo.event }}</span>
    </div>

    <div class="home-events-item__event">
      <div
        :class="[
          'team-group',
          { 'add-weight': eventInfo.goal.guest < eventInfo.goal.home },
        ]"
      >
        <div class="team-name-group">
          <p class="team-icon">
            <img v-lazy="eventInfo.homeTeam.icon" />
          </p>
          <p v-text="eventInfo.homeTeam.name" />
        </div>
        <p class="team-score">
          {{ statusType !== '未' ? eventInfo.goal.home : '-' }}
        </p>
      </div>

      <div
        :class="[
          'team-group',
          { 'add-weight': eventInfo.goal.guest > eventInfo.goal.home },
        ]"
      >
        <div class="team-name-group">
          <p class="team-icon">
            <img v-lazy="eventInfo.guestTeam.icon" />
          </p>
          <p v-text="eventInfo.guestTeam.name" />
        </div>
        <p class="team-score">
          {{ statusType !== '未' ? eventInfo.goal.guest : '-' }}
        </p>
      </div>
    </div>

    <div
      v-show="eventInfo.goal.guest < eventInfo.goal.home"
      class="home-pointer default-style-pointer"
    />
    <div
      v-show="eventInfo.goal.guest > eventInfo.goal.home"
      class="guest-pointer default-style-pointer"
    />
  </a>
</template>

<script>
import dayjs from 'dayjs'
import { mapState } from 'vuex'

import {
  basketballMatchId2Status,
  fetchFootballMatchTime,
} from '@/utils/status'

export default {
  props: {
    eventInfo: {
      type: Object,
      default: () => {},
    },
    eventType: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    ...mapState('user', ['serverTime']),
    statusType() {
      const { status } = this.eventInfo

      if (this.eventType === 1) {
        return fetchFootballMatchTime(
          status.value,
          status.time,
          this.serverTime
        )
      } else {
        return basketballMatchId2Status(status.value, 'short')
      }
    },
    dateShow() {
      const timeObj = dayjs(this.eventInfo.startTime)
      return `${timeObj.format('MM/DD HH:mm')}`
    },
    matchInfoUrl() {
      return this.eventType === 1
        ? this.$router.resolve({
            name: 'competition-football-match-id-basic',
            params: {
              id: this.eventInfo.id,
            },
          }).href
        : this.$router.resolve({
            name: 'competition-basketball-match-id-basic',
            params: {
              id: this.eventInfo.id,
            },
          }).href
    },
  },
}
</script>

<style lang="scss" scoped>
.home-events-item {
  position: relative;
  display: block;
  margin: 0 4px;
  padding: 12px;
  background-color: $color-white;
  border-radius: 8px;
  cursor: pointer;
  color: #333;
  @include transition-all;
  box-shadow: 0 0 4px 0 rgba(51, 51, 51, 0.05);
  &:hover {
    box-shadow: 0 0 8px 0 rgba(51, 51, 51, 0.2);
    transform: translateY(-2px);
  }
  &:active {
    opacity: 0.5;
  }
  .home-events-item__title {
    display: flex;
    justify-content: space-between;
    .font-style {
      color: #333;
      font-size: $font-size-small;
      font-family: $font-family-no-number;
    }
  }
  .home-events-item__event {
    .team-group {
      margin-top: 14px;
      color: #333;
      font-size: $font-size-middle;
      font-family: $font-family-no-number;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .team-name-group {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .team-icon {
      margin: 0 5px;
      border: 2px solid #efefef;
      background-color: #f9f9f9;
      width: 18px;
      height: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      overflow: hidden;
    }
  }

  .default-style-pointer {
    position: absolute;
    right: 0;
    border: 7px transparent solid;
    border-right-color: #333;
  }

  .guest-pointer {
    bottom: 15px;
  }

  .home-pointer {
    bottom: 51px;
  }

  .add-weight {
    font-weight: bold;
  }
}
</style>
