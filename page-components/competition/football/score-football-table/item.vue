<template>
  <li :class="['football-score-item']">
    <!-- checkbox -->
    <div
      :class="['table-item', 'checked']"
      :style="{
        width: `${columns.checked.width}px`,
      }"
    >
      <UiCheckBox
        :checked="checkedList.includes(row.id)"
        @change="handelCheck"
      />
    </div>

    <!-- event -->
    <div
      :title="
        setting.lang === 'zh'
          ? row.event.name
          : row.event.name_e || row.event.name
      "
      :class="['table-item', 'event']"
      :style="{
        width: `${columns.event.width}px`,
      }"
    >
      <i
        class="match-color"
        :style="{
          backgroundColor: '#' + row.event.color,
        }"
      />

      <NuxtLink
        v-if="row.event.is_wiki"
        :to="{
          name: 'archive-football-id-basic',
          params: { id: row.event.id },
        }"
        class="title"
        v-text="
          setting.lang === 'zh'
            ? row.event.name
            : row.event.name_e || row.event.name
        "
      />
      <span
        v-if="!row.event.is_wiki"
        class="title label"
        v-text="
          setting.lang === 'zh'
            ? row.event.name
            : row.event.name_e || row.event.name
        "
      />
    </div>

    <!-- time -->
    <div
      :class="['table-item', 'time']"
      :style="{
        width: `${columns.time.width}px`,
      }"
    >
      <span class="time-value">{{ row.time }}</span>
      <a
        v-if="row.hasTv"
        :href="
          $router.resolve({
            name: 'competition-football-match-id-video',
            params: {
              id: row.id,
            },
          }).href
        "
        target="_blank"
        class="video-icon-link"
      >
        <VIcon class="video-icon" name="icon_video" />
      </a>
    </div>

    <!-- status -->
    <div
      :class="[
        'table-item',
        'table-border',
        'status',
        {
          'has-sec': Boolean(Number(statusType)),
        },
      ]"
      :style="{
        width: `${columns.status.width}px`,
        color: !row.isStart ? '#999' : '#e1243b',
      }"
    >
      {{ statusType }}
    </div>

    <!-- homeTeam -->
    <div
      ref="homeTeam"
      :title="setting.lang === 'zh' ? row.home.name : row.home.name_e"
      :class="['table-item', 'home']"
      :style="{
        width: `${columns.home.width}px`,
      }"
    >
      <Team :row="row" key-id="home" />
    </div>

    <!-- score -->
    <div
      :class="['table-item', 'score']"
      :style="{
        width: `${columns.score.width}px`,
      }"
    >
      <p><Score :row="row" :status-type="statusType" /></p>
    </div>

    <!-- guest -->
    <div
      ref="guestTeam"
      :title="setting.lang === 'zh' ? row.guest.name : row.guest.name_e"
      :class="['table-item', 'guest']"
      :style="{
        width: `${columns.guest.width}px`,
      }"
    >
      <Team :row="row" key-id="guest" />
    </div>

    <!-- corner -->
    <div
      :class="['table-item', 'table-border', 'corner']"
      :style="{
        width: `${columns.corner.width}px`,
      }"
    >
      <Corner :corner="row.corner" :half-score="row.ht_score" />
    </div>

    <!-- exponential -->
    <div
      :class="['table-item', 'exponential']"
      :style="{
        width: `${columns.exponential.width}px`,
      }"
    >
      <Exponential :row="row" />
    </div>

    <!-- dataCenter -->
    <div
      :class="['table-item', 'dataCenter']"
      :style="{
        width: `${columns.dataCenter.width}px`,
      }"
    >
      <NuxtLink
        :to="{
          name: 'competition-football-match-id-basic',
          params: {
            id: row.id,
          },
        }"
        style="color: #e1243b;"
        v-text="'析'"
      />
      <NuxtLink
        :to="{
          name: 'competition-football-match-id-odds',
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
          name: 'competition-football-match-id-odds',
          params: {
            id: row.id,
          },
          query: {
            tab: 'hda',
          },
        }"
        v-text="'欧'"
      />
      <NuxtLink
        :to="{
          name: 'competition-football-match-id-odds',
          params: {
            id: row.id,
          },
          query: {
            tab: 'ou',
          },
        }"
        v-text="'大'"
      />
    </div>

    <!-- pinned -->
    <div
      :class="[
        'table-item',
        'pinned',
        {
          active: pinnedList.includes(row.id),
        },
      ]"
      :style="{
        width: `${columns.pinned.width}px`,
      }"
    >
      <span @click="handleFunction('favor')">
        <VIcon
          :class="['icon-style', { 'icon-active': favorList.includes(row.id) }]"
          name="icon_favorite"
        />
      </span>
      <span @click="handleFunction('pinned')">
        <VIcon
          :class="[
            'icon-style',
            { 'icon-active': pinnedList.includes(row.id) },
          ]"
          name="icon_sticky"
        />
      </span>
    </div>
  </li>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { fetchFootballMatchTime } from '@/utils/status'
import VIcon from '@/components/icon'
import UiCheckBox from '@/components/ui-check-box'
import Corner from './components/team/corner'
import Team from './components/team'
import Score from './components/score'
import Exponential from './components/exponential'

const GOLD_SHOW_TIME = 30 * 1000

export default {
  components: {
    VIcon,
    Team,
    Score,
    Corner,
    Exponential,
    UiCheckBox,
  },
  props: {
    columns: {
      type: Object,
      default: () => [],
    },
    row: {
      type: Object,
      required: true,
    },
    nowTime: null,
  },
  computed: {
    ...mapState('competition-football', [
      'setting',
      'pinnedList',
      'checkedList',
      'favorList',
      'height',
    ]),
    statusType() {
      const { status } = this.row

      return fetchFootballMatchTime(status.value, status.time, this.serverTime)
    },
  },
  watch: {
    'row.score.home'(newV, oldV) {
      if (Number(newV) !== Number(oldV)) {
        this.addGoldClass(this.$refs.homeTeam)
      }
    },
    'row.score.guest'(newV, oldV) {
      if (Number(newV) !== Number(oldV)) {
        this.addGoldClass(this.$refs.guestTeam)
      }
    },
  },
  methods: {
    ...mapActions('competition-football', [
      'SetCheckedList',
      'SetFunctionList',
    ]),
    handelCheck(value) {
      const id = this.row.id
      let list = this.checkedList
      if (value) {
        list = [...list, id]
      } else {
        list = list.filter(item => item !== id)
      }

      this.SetCheckedList(list)
    },
    handleFunction(type) {
      const id = this.row.id
      let list = []

      if (type === 'favor') {
        list = this.favorList
      } else if (type === 'pinned') {
        list = this.pinnedList
      }

      const hasFavor = list.find(item => item === id)
      if (!hasFavor) {
        list = [...list, id]
      } else {
        list = list.filter(item => item !== id)
      }

      this.SetFunctionList({ list, str: type })
    },
    addGoldClass($el) {
      if (!$el) {
        return
      }

      $el.classList.add('gold')
      setTimeout(() => {
        if ($el) {
          $el.classList.remove('gold')
        }
      }, GOLD_SHOW_TIME)
    },
  },
}
</script>

<style lang="scss" scoped>
.football-score-item {
  font-size: $font-size-small;
  border-bottom: 1px #efefef solid;
  min-height: 54px;
  .icon-style {
    font-size: 14px;
    margin: 0 4px;
    color: #ccc;
    @include transition-all;
    cursor: pointer;
  }

  .icon-active {
    color: $color-active;
  }

  .table-border {
    border-right: 1px solid #efefef;
  }
  .event {
    position: relative;
    .match-color {
      display: block;
      position: absolute;
      left: 0;
      top: 56%;
      width: 12px;
      height: 4px;
      border-radius: 2px;
    }
  }
  .title {
    max-width: 7em;
    display: inline-block;
    vertical-align: top;
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
  }
  .score p {
    width: 46px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    background-color: #f3f4f7;
    font-size: $font-size-middle;
    border: none;
    border-radius: 2px;
  }
  .gold {
    background-color: #e5f1ff;
    /deep/ .title {
      color: $color-active;
    }
  }
  .time {
    text-align: left;
    display: flex;
    align-items: center;
    .time-value {
      width: 34px;
    }
    .video-icon-link {
      margin-left: 6px;
      width: 13px;
      height: 15px;
    }
    .video-icon {
      vertical-align: top;
      padding-top: 1px;
      width: 13px;
      color: #aab4bd;
    }
  }
}
</style>
