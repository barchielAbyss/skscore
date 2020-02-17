<template>
  <div class="popover-team" @click.prevent.stop>
    <div class="popover-team-title">
      <div class="popover-team-title__select-type">
        <span
          v-for="(name, type) of typeMap"
          :key="type"
          :class="[
            'options',
            { 'active-choose': type === localRecentOpt.list_type },
          ]"
          @click="changeCurType(type)"
        >
          <span class="content" v-text="name" />
        </span>
      </div>

      <div class="popover-team-title__select-size">
        <span
          v-for="(name, size) of sizeMap"
          :key="size"
          :class="[
            'options',
            { 'active-choose': Number(size) === Number(localRecentOpt.size) },
          ]"
          @click="changeLimitSize(size)"
        >
          <span class="content" v-text="name" />
        </span>
      </div>
    </div>

    <div v-if="curTeam" v-loading="loading" class="popover-team-main">
      <template v-if="dataInfo">
        <TeamMatches
          v-if="dataInfo.matches"
          class="popover-team-main__matches"
          :team="curTeam"
          :matches="dataInfo.matches"
          :lang="setting.lang"
        />

        <div
          v-if="dataInfo.ratio && dataInfo.matches.length"
          class="popover-team-main__radio"
        >
          <TeamRadioItem
            class="radio-item"
            :data-info="dataInfo.ratio.event"
            :team="curTeam"
            :title="`同赛事近 ${localRecentOpt.size} 场`"
            :lang="setting.lang"
          />

          <TeamRadioItem
            class="radio-item"
            :data-info="dataInfo.ratio.home"
            :team="curTeam"
            :title="`同赛事同主场近 ${localRecentOpt.size} 场`"
            :lang="setting.lang"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import TeamMatches from './matches'
import TeamRadioItem from './radio-item'

const DEAFULT_RECENT_OPTIONS = () => {
  return {
    category: 1,
    team_id: '',
    list_type: '0',
    other_team_id: '',
    event_id: '',
    size: 6,
  }
}

const TYPE_MAP = {
  0: '全部',
  1: '同主客',
  2: '同赛事',
}
const SIZE_MAP = {
  6: '近6场',
  10: '近10场',
}

export default {
  components: {
    TeamMatches,
    TeamRadioItem,
  },
  props: {
    row: Object,
    keyId: String,
    curTeam: Object,
    recentOpt: Object,
    fetchTeamInfo: Function,
    fetchRecentInfo: Function,
  },
  data() {
    return {
      localRecentOpt: {
        ...DEAFULT_RECENT_OPTIONS(),
        ...this.recentOpt,
        team_id: this.curTeam.id,
        is_host: Number(this.keyId === 'home'),
      },
      loading: false,
      dataInfo: null,
    }
  },
  computed: {
    ...mapState('competition-football', ['setting']),
    typeMap: () => TYPE_MAP,
    sizeMap: () => SIZE_MAP,
  },
  methods: {
    handleMatchTeamInfo() {
      this.loading = true
      this.fetchTeamInfo(this.localRecentOpt).then(resData => {
        this.loading = false
        this.dataInfo = resData
        this.$nextTick(() => {
          this.$parent.updatePopper()
        })
      })
    },
    changeLimitSize(size) {
      this.loading = true

      this.localRecentOpt.team_id = this.curTeam.id
      this.localRecentOpt.size = size

      this.fetchTeamInfo(this.localRecentOpt).then(resData => {
        this.loading = false
        this.dataInfo = resData

        this.$nextTick(() => {
          this.$parent.updatePopper()
        })
      })
    },
    changeCurType(type) {
      this.loading = true

      this.localRecentOpt.team_id = this.curTeam.id
      this.localRecentOpt.list_type = type

      switch (type) {
        case '0':
          this.localRecentOpt = {
            ...DEAFULT_RECENT_OPTIONS(),
            size: this.localRecentOpt.size,
            team_id: this.curTeam.id,
            is_host: Number(this.keyId === 'home'),
          }
          break
        case '1':
          this.localRecentOpt.is_host = Number(this.keyId === 'home')
          this.localRecentOpt.other_team_id =
            this.keyId === 'home' ? this.row.guest.id : this.row.home.id
          break
        case '2':
          this.localRecentOpt.event_id = this.row.event.id
          break
        default:
          break
      }

      this.fetchRecentInfo(this.localRecentOpt).then(resData => {
        this.loading = false

        this.dataInfo.matches = resData
        this.$nextTick(() => {
          this.$parent.updatePopper()
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.popover-team {
  cursor: default;
  padding: 14px 0 6px;

  &-title {
    font-family: $font-family-no-number;
    margin-bottom: 15px;
    color: $color-active;
    display: flex;
    justify-content: space-between;
    line-height: $font-size-small;

    .options {
      width: 42px;
      border-radius: 2px;
      padding: 2px 10px;
      background-color: #f9f9f9;
      font-size: $font-size-small;
    }

    .active-choose {
      box-shadow: 0 0 4px 0 rgba(0, 55, 175, 0.4);
      background-color: $color-active;
      color: $color-white;
    }
  }

  &-main {
    &__radio {
      font-family: $font-family-no-number;
      text-align: left;
      color: $color-font-base;
      font-size: $font-size-small;
      margin-top: 15px;
      .radio-item {
        padding-bottom: 8px;
      }
    }
  }
}
</style>
