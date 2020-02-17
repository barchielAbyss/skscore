<template>
  <li class="basketball-score-item">
    <div class="scroe-title">
      <div class="column-item match-tool">
        <i
          class="match-color"
          :style="{
            backgroundColor: fetchMatchColor(row.id),
          }"
        />
        <input
          type="checkbox"
          class="m-checkbox"
          :value="row.id"
          :checked="checkedList.includes(row.id)"
          @change="handelCheck($event)"
        />
        <NuxtLink
          :to="{
            name: 'archive-basketball-id-basic',
            params: {
              id: row.event.id,
            },
          }"
          class="event"
        >
          <span class="event-logo">
            <VImage
              :src="row.event.icon"
              error-src="/icon/basketball-event.png"
            />
          </span>
          <span
            class="event-name"
            :title="
              setting.lang === 'zh'
                ? row.event.name_js || row.event.name
                : row.event.name_e || row.event.name_js || row.event.name
            "
            v-text="
              setting.lang === 'zh'
                ? row.event.name_js || row.event.name
                : row.event.name_e || row.event.name_js || row.event.name
            "
          />
        </NuxtLink>
        <span class="start-time" v-text="fetchStartTime(row.startTime)" />

        <a
          v-if="row.hasTv"
          :href="
            $router.resolve({
              name: 'competition-basketball-match-id-video',
              params: {
                id: row.id,
              },
            }).href
          "
          target="_blank"
        >
          <VIcon class="video-icon" name="animation" />
        </a>
      </div>

      <div class="column-item match-phase">
        <span
          v-for="title of ['一', '二', '三', '四']"
          :key="title"
          class="phase-title"
          v-text="`${title}节`"
        />
      </div>

      <div class="column-item match-half">
        半场
      </div>

      <div class="column-item match-full">
        全场
      </div>

      <div class="column-item match-gap">
        分差
      </div>

      <div class="column-item match-total">
        总分
      </div>

      <div class="column-item match-hda">
        欧指
      </div>

      <div class="column-item match-ah">
        让分
      </div>

      <div class="column-item match-ou">
        总分
      </div>

      <div class="column-item match-tools" @click="handlePin">
        <i class="iconfont icon-top" />
        置顶
      </div>
    </div>

    <div class="score-values">
      <!-- 比赛状态 -->
      <div
        :class="[
          'column-item',
          'match-status',
          { ongoing: row.ongoing || row.isEnd },
        ]"
      >
        <template v-if="row.ongoing">
          <p v-if="row.time.runTime">{{ row.time.runTime }}'</p>
          <p>{{ matchStatus }}</p>
        </template>
        <template v-else>
          <p class="race-start-yet">{{ matchStatus.slice(0, 1) }}</p>
        </template>
      </div>
      <!-- 比赛球队 -->
      <div class="column-item match-team">
        <NuxtLink
          ref="homeTeam"
          :to="{
            name: 'archive-team-detail',
            query: {
              eventId: row.event.id,
              eventName: row.event.name_js,
              sportType: 'basketball',
              teamId: row.host.id,
            },
          }"
          :title="
            setting.lang === 'zh'
              ? row.host.name
              : row.host.name_e || row.host.name
          "
          class="match-team-info host"
        >
          <span class="icon">
            <VImage :src="row.host.icon" error-src="/icon/team.png" />
          </span>
          <span
            class="name"
            v-text="
              setting.lang === 'zh'
                ? row.host.name
                : row.host.name_e || row.host.name
            "
          />
          <span
            v-show="Number(row.rank.home)"
            class="rank"
            v-text="`[${row.rank.home}]`"
          />
        </NuxtLink>
        <NuxtLink
          ref="guestTeam"
          :to="{
            name: 'archive-team-detail',
            query: {
              eventId: row.event.id,
              eventName: row.event.name_js,
              sportType: 'basketball',
              teamId: row.guest.id,
            },
          }"
          :title="
            setting.lang === 'zh'
              ? row.guest.name
              : row.guest.name_e || row.guest.name
          "
          class="match-team-info guest"
        >
          <span class="icon">
            <VImage :src="row.guest.icon" error-src="/icon/team.png" />
          </span>
          <span
            class="name"
            v-text="
              setting.lang === 'zh'
                ? row.guest.name
                : row.guest.name_e || row.guest.name
            "
          />
          <span
            v-show="Number(row.rank.guest)"
            class="rank"
            v-text="`[${row.rank.guest}]`"
          />
        </NuxtLink>
      </div>
      <!-- 比赛阶段得分 -->
      <div class="column-item match-phase">
        <p class="match-phase-info host">
          <span v-text="row.score.home.first || (row.isEnd ? 0 : '-')" />
          <span v-text="row.score.home.second || (row.isEnd ? 0 : '-')" />
          <span v-text="row.score.home.third || (row.isEnd ? 0 : '-')" />
          <span v-text="row.score.home.fourth || (row.isEnd ? 0 : '-')" />
        </p>
        <p class="match-phase-info guest">
          <span v-text="row.score.guest.first || (row.isEnd ? 0 : '-')" />
          <span v-text="row.score.guest.second || (row.isEnd ? 0 : '-')" />
          <span v-text="row.score.guest.third || (row.isEnd ? 0 : '-')" />
          <span v-text="row.score.guest.fourth || (row.isEnd ? 0 : '-')" />
        </p>
      </div>
      <!-- 比赛半场得分 -->
      <div class="column-item match-half">
        <p class="match-half-info host">
          {{ row.score.home.half || '-' }}/{{
            row.score.home.total - row.score.home.half || '-'
          }}
        </p>
        <p class="match-half-info guest">
          {{ row.score.guest.half || '-' }}/{{
            row.score.guest.total - row.score.guest.half || '-'
          }}
        </p>
      </div>
      <!-- 比赛全场得分 -->
      <div
        :class="[
          'column-item',
          'match-full',
          { ongoing: row.ongoing || row.isEnd },
        ]"
      >
        <p class="match-full-info host">{{ row.score.home.total || '-' }}</p>
        <p class="match-full-info guest">{{ row.score.guest.total || '-' }}</p>
      </div>
      <!-- 比赛分差 -->
      <div class="column-item match-gap">
        <p class="match-gap-info host">
          半:
          {{
            Number(row.score.home.half) - Number(row.score.guest.half) || '-'
          }}
        </p>
        <p class="match-gap-info guest">
          全:
          {{
            Number(row.score.home.total) - Number(row.score.guest.total) || '-'
          }}
        </p>
      </div>
      <!-- 比赛总分 -->
      <div class="column-item match-total">
        <p class="match-total-info host">
          半:
          {{
            Number(row.score.home.half) + Number(row.score.guest.half) || '-'
          }}
        </p>
        <p class="match-total-info guest">
          全:
          {{
            Number(row.score.home.total) + Number(row.score.guest.total) || '-'
          }}
        </p>
      </div>
      <!-- 比赛欧指 -->
      <div class="column-item match-hda">
        <p class="match-hda-info host">
          {{ row.exponential.hda.h }}
        </p>
        <p class="match-hda-info guest">
          {{ row.exponential.hda.g }}
        </p>
      </div>
      <!-- 比赛亚指 -->
      <div class="column-item match-ah">
        <p class="host">
          <span v-if="Number(row.exponential.ah.l) >= 0" class="orange">
            {{ row.exponential.ah.l }}
          </span>
          <ValueChange class="match-ah-info" :value="row.exponential.ah.h" />
        </p>
        <p class="guest">
          <span v-if="Number(row.exponential.ah.l) < 0" class="orange">
            {{ -+row.exponential.ah.l }}
          </span>
          <ValueChange class="match-ah-info" :value="row.exponential.ah.g" />
        </p>
      </div>
      <!-- 比赛大小球 -->
      <div class="column-item match-ou">
        <p class="host">
          <span
            v-show="row.exponential.ou.t || row.exponential.ou.b"
            class="orange"
            v-text="'大'"
          />
          <span class="orange" v-text="row.exponential.ou.t" />
          <ValueChange class="match-ou-info" :value="row.exponential.ou.b" />
        </p>
        <p class="match-ou-info guest">
          <span
            v-show="row.exponential.ou.t || row.exponential.ou.s"
            class="orange"
            v-text="'小'"
          />
          <span class="orange" v-text="row.exponential.ou.t" />

          <ValueChange class="match-ou-info" :value="row.exponential.ou.s" />
        </p>
      </div>
      <!-- 比赛详情链接 -->
      <div class="column-item match-tools">
        <NuxtLink
          :to="{
            name: 'competition-basketball-match-id-basic',
            params: {
              id: row.id,
            },
          }"
          v-text="'析'"
        />
        <NuxtLink
          :to="{
            name: 'competition-basketball-match-id-odds',
            params: {
              id: row.id,
            },
            query: {
              tab: 'ah',
            },
          }"
          v-text="'亚'"
        />
        <NuxtLink
          :to="{
            name: 'competition-basketball-match-id-odds',
            params: {
              id: row.id,
            },
            query: {
              tab: 'hda',
            },
          }"
          v-text="'欧'"
        />
      </div>
    </div>

    <div v-if="Number(row.n)" class="score-neutral">
      中立场
    </div>
  </li>
</template>

<script>
import dayjs from 'dayjs'
import { mapState, mapActions } from 'vuex'

import { basketballMatchId2Status } from '@/utils/status'

import ValueChange from '@/components/value-change'
import VIcon from '@/components/icon'
import VImage from '@/components/image'

const GOLD_SHOW_TIME = 30000

export default {
  components: {
    ValueChange,
    VIcon,
    VImage,
  },
  props: {
    row: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('competition-basketball', [
      'setting',
      'pinnedList',
      'checkedList',
    ]),
    matchStatus() {
      return basketballMatchId2Status(this.row.time.status)
    },
  },
  watch: {
    'row.score.home.total'(newV, oldV) {
      if (Number(newV) !== Number(oldV)) {
        this.addGoldClass(this.$refs.homeTeam)
      }
    },
    'row.score.guest.total'(newV, oldV) {
      if (Number(newV) !== Number(oldV)) {
        this.addGoldClass(this.$refs.guestTeam)
      }
    },
  },
  methods: {
    ...mapActions('competition-basketball', [
      'SetCheckedList',
      'SetPinnedList',
    ]),
    addGoldClass(el) {
      if (!el || !el.$el) {
        return
      }

      el.$el.classList.add('gold')
      setTimeout(() => {
        if (el.$el) {
          el.$el.classList.remove('gold')
        }
      }, GOLD_SHOW_TIME)
    },
    fetchStartTime(time) {
      return dayjs(Number(time)).format('MM/DD HH:mm')
    },
    fetchMatchColor(id) {
      const randomIndex = Number(id) % 4
      return ['#e1243b', '#f95d22', '#ffbe52', '#aab4bd'][randomIndex]
    },
    handelCheck(e) {
      const value = e.target.checked
      const id = this.row.id
      let list = this.checkedList
      if (value) {
        list = [...list, id]
      } else {
        list = list.filter(item => item !== id)
      }

      this.SetCheckedList(list)
    },
    handlePin() {
      const id = this.row.id
      let list = this.pinnedList
      const hasTop = list.find(item => item === id)

      if (!hasTop) {
        list = [...list, id]
      } else {
        list = list.filter(item => item !== id)
      }
      this.SetPinnedList(list)
    },
  },
}
</script>

<style lang="scss" scoped>
.basketball-score-item {
  .match-phase {
    width: 170px;
  }
  .match-half,
  .match-full,
  .match-total {
    width: 60px;
  }

  .match-gap,
  .match-hda {
    width: 50px;
  }
  .match-ah {
    width: 80px;
  }
  .match-ou {
    width: 112px;
  }
  .match-tools {
    width: 78px;
  }

  .scroe-title,
  .score-values {
    display: flex;
    align-items: center;
    text-align: center;
  }

  .race-start-yet {
    color: #999;
  }

  .scroe-title {
    line-height: 45px;
    background-color: #f5f5f5;
    .column-item {
      border-left: 1px solid transparent;
    }
    .match-tool {
      width: 271px;
      display: flex;
      align-items: center;
      position: relative;
      text-align: left;
      .match-color {
        display: block;
        position: absolute;
        top: 11px;
        left: 0px;
        width: 3px;
        height: 20px;
        border-radius: 2px;
      }
      .m-checkbox {
        margin-left: 12px;
      }
      .video-icon {
        margin-left: 6px;
        color: #00a54f;
        width: 13px;
      }
      .event {
        display: flex;
        align-items: center;
        .event-logo {
          width: 18px;
          height: 18px;
          padding: 0 8px 0 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          > img {
            height: 100%;
          }
        }
        .event-name {
          width: 8em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-right: 8px;
        }
      }
    }
    .match-phase {
      display: flex;
      .phase-title {
        flex: 1;
      }
    }
    .match-tools {
      cursor: pointer;
      .icon-top {
        font-size: 14px;
        color: #ccc;
      }
      &:hover {
        color: $color-active;
        .icon-top {
          color: $color-active;
        }
      }
    }
  }

  .score-values {
    background: $color-white;
    line-height: 36px;
    .column-item {
      border-left: 1px solid #efefef;
    }
    .host {
      border-bottom: 1px solid #efefef;
    }
    .host,
    .guest {
      height: 36px;
      padding: 0 4px;
    }
    .gold {
      background-color: #e5f1ff;
    }
    .match-status {
      width: 60px;
      height: 52px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      line-height: 12px;
      border-left: none;
      /deep/ p {
        width: 100%;
      }
      &.ongoing {
        color: #e1243b;
        .race-start-yet {
          color: #e1243b;
        }
      }
    }
    .match-team {
      width: 210px;
      .match-team-info {
        padding: 0 10px;
        display: flex;
        align-items: center;
        .name {
          font-weight: bold;
          white-space: nowrap;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .icon {
          height: 18px;
          width: 18px;
          padding-right: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          > img {
            max-height: 100%;
          }
        }
      }
    }
    .match-full {
      &.ongoing {
        color: #e1243b;
      }
      .match-full-info {
        font-weight: bold;
      }
    }
    .match-phase {
      text-align: center;
      .match-phase-info {
        display: flex;
        padding: 0;
        > span {
          flex: 1;
        }
      }
    }
    .match-ah {
      text-align: right;
      .host,
      .guest {
        display: flex;
        > span {
          flex: 1;
        }
      }
    }
    .match-ou {
      text-align: left;
      .host,
      .guest {
        padding: 0 2px 0 12px;
        white-space: nowrap;
      }
    }

    .orange {
      color: #f95d22;
      margin-right: 8px;
    }

    .match-tools {
      padding: 0 8px;
      box-sizing: border-box;
      line-height: 72px;
      display: flex;
      justify-content: space-evenly;
    }
  }

  .score-neutral {
    background-color: #e5f1ff;
    color: $color-active;
    font-weight: bold;
    text-align: center;
    line-height: 26px;
  }
}
</style>
