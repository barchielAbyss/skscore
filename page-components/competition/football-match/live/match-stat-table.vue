<template>
  <div class="match-stat-table">
    <div class="stat-row">
      <div v-if="matchInfo" class="home-icon">
        <img v-lazy="matchInfo.home.icon" />
      </div>

      <div class="home-stat">
        <div class="corners">
          <span>{{ corners.home || 0 }}</span>
          <Icon name="jiaoqiu" />
        </div>

        <div class="card yellow">
          {{ yellow.home || 0 }}
        </div>

        <div class="card red">
          {{ red.home || 0 }}
        </div>
      </div>

      <div class="possession">
        <span class="possession-label">控球率</span>
        <span class="home-possession" v-text="possession.home || '0%'" />
        <div
          class="progress"
          :class="{ none: !possession.home || possession.home === '0' }"
        >
          <span class="use" :style="{ width: possession.home || 0 }" />
        </div>
        <span class="guest-possession" v-text="possession.guest || '0%'" />
      </div>

      <div class="guest-stat">
        <span class="card red">
          {{ red.guest || 0 }}
        </span>
        <span class="card yellow">
          {{ yellow.guest || 0 }}
        </span>
        <span class="corners">
          <Icon name="jiaoqiu" />
          {{ corners.guest || 0 }}
        </span>
      </div>

      <div v-if="matchInfo" class="guest-icon">
        <img v-lazy="matchInfo.guest.icon" />
      </div>
    </div>

    <div class="stat-row">
      <div class="attack">
        <span class="home-attack" v-text="attack.home || 0" />
        <div class="progress" :class="{ none: !attack.home }">
          <span class="use" :style="{ width: attack.homeProgress || 0 }" />
        </div>
        <span class="guest-attack" v-text="attack.guest || 0" />

        <span class="attack-label">进攻</span>
      </div>

      <div class="shots">
        <span class="shots-label">射门</span>
        <span class="home-shots" v-text="shots.home || 0" />
        <div class="progress" :class="{ none: !shots.homeProgress }">
          <span class="use" :style="{ width: shots.homeProgress || 0 }" />
        </div>
        <span class="guest-shots" v-text="shots.guest || 0" />
      </div>
    </div>

    <div class="stat-row">
      <div class="offsides">
        <span class="home-offsides" v-text="offsides.home || 0" />
        <div class="progress" :class="{ none: !offsides.homeProgress }">
          <span class="use" :style="{ width: offsides.homeProgress || 0 }" />
        </div>
        <span class="guest-offsides" v-text="offsides.guest || 0" />

        <span class="offsides-label">越位</span>
      </div>

      <div class="dangerous-attack">
        <span class="dangerous-attack-label">危险进攻</span>
        <span
          class="home-dangerous-attack"
          v-text="dangerousAttack.home || 0"
        />
        <div class="progress" :class="{ none: !dangerousAttack.homeProgress }">
          <span
            class="use"
            :style="{ width: dangerousAttack.homeProgress || 0 }"
          />
        </div>
        <span
          class="guest-dangerous-attack"
          v-text="dangerousAttack.guest || 0"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/icon'

// corners: '角球',
// yellow: '黄牌',
// red: '红牌',
// possession: '控球率',
// attack: '进攻',
// dangerousAttack: '危险进攻',
// shots: '射门',
// offsides: '越位',

export default {
  components: {
    Icon,
  },
  props: {
    stat: {
      type: Object,
      default: () => {},
    },
    matchInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {}
  },
  computed: {
    corners() {
      return this.stat ? this.stat.corners : {}
    },
    yellow() {
      return this.stat ? this.stat.yellow : {}
    },
    red() {
      return this.stat ? this.stat.red : {}
    },
    possession() {
      return this.stat ? this.stat.possession : {}
    },
    attack() {
      if (!this.stat) {
        return {}
      }
      const { home, guest } = this.stat.attack
      const totalValue = Number(home) + Number(guest)
      return {
        ...this.stat.attack,
        homeProgress: this.fetchPercent(Number(home), totalValue),
      }
    },
    dangerousAttack() {
      if (!this.stat) {
        return {}
      }
      const { home, guest } = this.stat.dangerousAttack
      const totalValue = Number(home) + Number(guest)
      return {
        ...this.stat.dangerousAttack,
        homeProgress: this.fetchPercent(Number(home), totalValue),
      }
    },
    shots() {
      if (!this.stat) {
        return {}
      }
      const { home, guest } = this.stat.shots
      const totalValue = Number(home) + Number(guest)
      return {
        ...this.stat.shots,
        homeProgress: this.fetchPercent(Number(home), totalValue),
      }
    },
    offsides() {
      if (!this.stat) {
        return {}
      }
      const { home, guest } = this.stat.offsides
      const totalValue = Number(home) + Number(guest)
      return {
        ...this.stat.offsides,
        homeProgress: this.fetchPercent(Number(home), totalValue),
      }
    },
  },
  methods: {
    fetchPercent(value, total) {
      if (!value || !total) {
        return '0%'
      }
      return `${Math.ceil((value / total) * 100)}%`
    },
  },
}
</script>

<style lang="scss" scoped>
.match-stat-table {
  padding: 0 7px;
  .stat-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
  }
  .home-icon,
  .guest-icon {
    width: 26px;
    text-align: center;
    border-radius: 50%;
    overflow: hidden;
    img {
      vertical-align: middle;
      max-height: 26px;
    }
  }
  .home-stat,
  .guest-stat {
    max-width: 120px;
    display: flex;
    align-items: flex-end;
  }
  .corners {
    display: flex;
    align-items: flex-end;
    line-height: 1.3;
    .icon {
      padding-left: 3px;
      width: 16px;
      height: 16px;
    }
  }
  .card {
    padding: 0 2px;
    border-radius: 2px;
    margin: 0 3px;
    color: $color-white;
    text-align: center;
    display: block;
    &.yellow {
      background-color: #f7b500;
    }
    &.red {
      background-color: #e1243b;
    }
  }
  .progress {
    position: relative;
    width: 200px;
    height: 6px;
    background-color: #fca266;
    border-radius: 5px;
    overflow: hidden;
    margin: 0 8px;
    &.none {
      background-color: #ececec;
    }
    span {
      position: absolute;
      height: 100%;
      top: 0;
      left: 0;
      background: #66afff;
      transition: all 0.5s ease-in-out;
    }
  }
  .possession {
    padding-top: 14px;
    position: relative;
    .possession-label {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    .progress {
      width: 250px;
    }
  }
  .possession,
  .attack,
  .shots,
  .offsides,
  .dangerous-attack {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .home-attack,
  .home-shots,
  .home-offsides,
  .home-dangerous-attack {
    text-align: right;
    width: 2em;
  }
  .guest-attack,
  .guest-shots,
  .guest-offsides,
  .guest-dangerous-attack {
    text-align: left;
    width: 2em;
  }
}
</style>
