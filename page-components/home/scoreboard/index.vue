<template>
  <div v-loading="loading" class="home-scoreboard">
    <h3 class="home-scoreboard__title">
      足球积分榜
    </h3>
    <div class="home-scoreboard__leagues">
      <div @click="!lock_prev && handleClickLeague(0)">
        <VIcon
          name="arrow"
          :class="[
            'icon-pointer',
            'pointer-left',
            lock_prev ? 'pointer-lock' : 'pointer-active',
          ]"
        />
      </div>

      <span
        v-for="item of leagues"
        :key="item.id"
        :class="['leagues-item', { active: curLeagueId === item.id }]"
        @click="handleChangeCurLeagueId(item.id)"
      >
        {{ item.label }}
      </span>

      <div @click="!lock_next && handleClickLeague(1)">
        <VIcon
          name="arrow"
          :class="[
            'icon-pointer',
            'pointer-right',
            lock_next ? 'pointer-lock' : 'pointer-active',
          ]"
        />
      </div>
    </div>

    <div v-if="listData.length" class="home-scoreboard__list">
      <div class="list-title list-item">
        <span
          v-for="(name, key) of listKeys"
          :key="key"
          :class="key"
          v-text="name"
        />
      </div>

      <ul class="list-main">
        <li v-for="item of listData" :key="item.rank" class="list-item">
          <div v-for="(_, key) of listKeys" :key="key" :class="key">
            <p
              class="value"
              :style="fetchItemStyle(key, item)"
              v-text="item[key]"
            />
          </div>
        </li>
      </ul>
    </div>
    <p v-if="!listData.length" class="text-empty" v-text="'暂无'" />

    <div class="home-scoreboard__rordmap">
      <p v-for="(item, index) of rordList" :key="index" class="rord-item">
        <i
          class="rord-color-block"
          :style="{
            backgroundColor: item.color,
          }"
        />
        <span class="rord-name" v-text="item.desc" />
      </p>
    </div>
  </div>
</template>

<script>
import api from '@/api'
import VIcon from '@/components/icon'
const LEAGUE_LIST = [
  {
    id: 1,
    label: '英超',
  },
  {
    id: 29,
    label: '意甲',
  },
  {
    id: 64,
    label: '西甲',
  },
  {
    id: 77,
    label: '法甲',
  },
]
const LIST_KEY_MAP = {
  rank: '排名',
  team: '球队',
  flat: '胜负平',
  integral: '积分',
}

export default {
  components: { VIcon },
  data() {
    return {
      curLeagueId: 1, // 初始化时记得设置它
      listData: [],
      loading: false,
      lock_prev: true, // 初始化时根据 curLeagueId 进行设置
      lock_next: false, // 初始化时根据 curLeagueId 进行设置
    }
  },
  computed: {
    leagues: () => LEAGUE_LIST,
    listKeys: () => LIST_KEY_MAP,
    rordList() {
      const rords = (this.listData || [])
        .filter(({ rord_info: rordInfo }) => rordInfo)
        .map(item => item.rord_info)

      return rords.reduce((prev, item) => {
        if (prev.some(({ desc }) => desc === item.desc)) {
          return prev
        }
        return [...prev, item]
      }, [])
    },
  },
  mounted() {
    this.fetchScoreboardList()
  },
  methods: {
    fetchItemStyle(key, item) {
      const { rord_info: rord } = item
      if (['rank'].includes(key) && rord) {
        return {
          backgroundColor: rord.color,
          color: '#fff',
        }
      }

      return {}
    },

    handleChangeCurLeagueId(id) {
      if (this.curLeagueId === id) {
        return
      }
      this.curLeagueId = id
      this.pointerLocked()
      this.fetchScoreboardList()
    },

    fetchScoreboardList() {
      this.loading = true
      this.$axios
        .get(api.get.football.fetchScoreboard, {
          params: {
            event_id: this.curLeagueId,
            size: 20,
          },
        })
        .then(({ code, data, msg }) => {
          if (code !== 0 || !data) {
            throw new Error(msg || '获取球队排行榜失败')
          }

          this.listData = data.standing.total.map((item, index) => {
            const teamInto = data.teams[item.team_id]
            const [, win, draw, lost, , , integral] = item.data

            return {
              team: teamInto ? teamInto.name_j : '未知',
              flat: `${win}/${lost}/${draw}`,
              rank: index + 1,
              rord_info: item.rord_info,
              integral: integral,
            }
          })
        })
        .catch(() => {
          this.listData = []
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 按钮点击事件
    handleClickLeague(flag) {
      const len = this.fetchLenByCurLeagueId()
      if (flag) {
        if (len < LEAGUE_LIST.length - 1) {
          this.curLeagueId = LEAGUE_LIST[len + 1].id
          this.fetchScoreboardList()
          this.pointerLocked(len + 1)
        }
      } else if (len > 0) {
        this.curLeagueId = LEAGUE_LIST[len - 1].id
        this.fetchScoreboardList()
        this.pointerLocked(len - 1)
      }
    },

    // 判断左右按键是否锁死
    pointerLocked(num) {
      const len = num || this.fetchLenByCurLeagueId()

      if (len === 0) {
        this.lock_prev = true
        this.lock_next = false
      } else if (len === LEAGUE_LIST.length - 1) {
        this.lock_prev = false
        this.lock_next = true
      } else {
        this.lock_prev = false
        this.lock_next = false
      }
    },

    // 找当前 id 的下标
    fetchLenByCurLeagueId() {
      let len = null
      const id = this.curLeagueId
      LEAGUE_LIST.forEach((item, index) => {
        if (item.id === id) {
          len = index
        }
      })
      return len
    },
  },
}
</script>

<style lang="scss" scoped>
.home-scoreboard {
  .icon-pointer {
    margin-top: 2px;
    font-size: 16px;
  }
  .pointer-lock {
    color: #ccc;
    cursor: auto;
  }
  .pointer-active {
    color: #333;
    cursor: pointer;
  }
  .pointer-left {
    transform: rotateZ(180deg);
  }
  @include card;
  .home-scoreboard__title {
    @include card-title;
    margin-bottom: 16px;
  }
  .home-scoreboard__leagues {
    font-size: 13px;
    border-bottom: 1px solid #efefef;
    display: flex;
    text-align: center;
    padding-bottom: 9px;
    margin-bottom: 17px;
    .leagues-item {
      flex: 1;
      cursor: pointer;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        bottom: -11px;
        left: 50%;
        transform: translateX(-5px);
        display: block;
        width: 10px;
        height: 3px;
        background-color: transparent;
        @include transition-all;
      }
      &.active {
        font-weight: bold;
        color: $color-active;
        &::after {
          background-color: $color-active;
        }
      }
    }
  }
  .home-scoreboard__list {
    padding-bottom: 12px;
    border-bottom: 1px solid #efefef;
    .list-title {
      color: #666;
    }
    .list-item {
      font-size: 12px;
      display: flex;
      line-height: 14px;
      justify-content: space-between;
      padding: 8px 0;
    }
    .rank {
      width: 26px;
      text-align: center;
      .value {
        display: inline-block;
        width: 15px;
        height: 14px;
      }
    }
    .team {
      width: 75px;
      .value {
        white-space: nowrap;
        max-width: 6em;
        overflow: hidden;
      }
    }
    .flat {
      width: 45px;
      text-align: center;
      color: #666;
    }
    .integral {
      width: 30px;
      text-align: center;
      color: #666;
    }
  }
  .home-scoreboard__rordmap {
    padding-top: 12px;
    display: flex;
    flex-wrap: wrap;
    font-size: 12px;
    margin-bottom: -10px;
    .rord-item {
      width: 50%;
      padding-bottom: 10px;
    }
    .rord-color-block {
      margin-right: 6px;
      display: inline-block;
      width: 10px;
      height: 10px;
    }
  }
  .text-empty {
    text-align: center;
    line-height: 60px;
  }
}
</style>
