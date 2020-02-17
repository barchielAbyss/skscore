<template>
  <table class="match-odds">
    <thead>
      <tr>
        <th width="76" />
        <th
          v-for="(item, key) of keyMap"
          :key="key"
          width="200"
          v-text="item.label"
        />
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>即时盘</td>
        <td v-for="(item, key) of keyMap" :key="key">
          <div class="item-odds">
            <template v-if="emptyByKeys(key, item.instant)">
              <ValueChange
                v-for="keyId of item.instant"
                :key="keyId"
                :value="oddsData[key][keyId]"
                :format="fetchItemFromat(key, keyId)"
              />
            </template>
            <template v-else>
              <span>-</span>
            </template>
          </div>
        </td>
      </tr>

      <tr>
        <td>初盘</td>
        <td v-for="(item, key) of keyMap" :key="key">
          <div class="item-odds">
            <template v-if="emptyByKeys(key, item.initial)">
              <ValueChange
                v-for="keyId of item.initial"
                :key="keyId"
                :value="oddsData[key][keyId]"
                :format="fetchItemFromat(key, keyId)"
              />
            </template>
            <template v-else>
              <span>-</span>
            </template>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import api from '@/api'

import emitter from '@/utils/emitter'
import { footballAhYield, footballOuYield } from '@/utils/status'
import { exponentialArray2Object } from '@/utils/getOdds2Object'

import ValueChange from '@/components/value-change'

const COMPANYS = {
  ah: 12,
  hda: 308,
}

const KEYS_MAP = {
  hda: {
    label: '欧指',
    instant: ['w', 'd', 'l'],
    initial: ['wi', 'di', 'li'],
  },
  ah: {
    label: '让球',
    instant: ['h', 'l', 'g'],
    initial: ['hi', 'li', 'gi'],
  },
  ou: {
    label: '进球数',
    instant: ['b', 't', 's'],
    initial: ['bi', 'ti', 'si'],
  },
  corner: {
    label: '角球',
    instant: [],
    initial: [],
  },
}

export default {
  components: {
    ValueChange,
  },
  props: {
    matchId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      oddsData: {},
    }
  },
  computed: {
    keyMap: () => KEYS_MAP,
    oddCompanyId() {
      return {
        ah: Number(COMPANYS.ah),
        hda: Number(COMPANYS.hda),
      }
    },
  },
  created() {
    this.fetchOddsData()
  },
  mounted() {
    emitter.$on('socket-football-hda', this.changeSocketHda)
    emitter.$on('socket-football-ah', this.changeSocketAh)
    emitter.$on('socket-football-ou', this.changeSocketOu)
  },
  beforeDestroy() {
    emitter.$off('socket-football-hda', this.changeSocketHda)
    emitter.$off('socket-football-ah', this.changeSocketAh)
    emitter.$off('socket-football-ou', this.changeSocketOu)
  },
  methods: {
    fetchItemFromat(key, keyId) {
      if (key === 'ah' && ['l', 'li'].includes(keyId)) {
        return footballAhYield
      }

      if (key === 'ou' && ['t', 'ti'].includes(keyId)) {
        return footballOuYield
      }

      return value => {
        return Number(value).toFixed(2)
      }
    },
    emptyByKeys(type, keys) {
      if (!this.oddsData[type]) {
        return false
      }
      return keys.every(key => Boolean(this.oddsData[type][key]))
    },
    fetchOddsData() {
      this.$axios
        .get(api.get.common.fetchMatchOdds, {
          params: {
            category: 1,
            company: '皇冠',
            match_id: this.matchId,
          },
        })
        .then(({ code, data, msg }) => {
          if (code !== 0) {
            throw new Error(msg)
          }

          this.oddsData = exponentialArray2Object(data)
        })
        .catch(() => {
          this.oddsData = exponentialArray2Object()
        })
    },
    setOddsData(key, value) {
      this.oddsData[key] = value
    },
    changeSocketHda(value) {
      const hdaList = (value || []).filter(item => {
        return Number(item.company_id) === this.oddCompanyId.hda
      })
      if (!hdaList || !hdaList.length) {
        return
      }
      const itemOdd = hdaList.find(
        item => Number(item.mid) === Number(this.matchId)
      )
      if (!itemOdd) {
        return
      }
      this.setOddsData('hda', itemOdd.odd)
    },
    changeSocketAh(value) {
      const ahList = (value || []).filter(item => {
        return Number(item.company_id) === this.oddCompanyId.ah
      })
      if (!ahList || !ahList.length) {
        return
      }
      const itemOdd = ahList.find(
        item => Number(item.mid) === Number(this.matchId)
      )
      if (!itemOdd) {
        return
      }
      this.setOddsData('ah', itemOdd.odd)
    },
    changeSocketOu(value) {
      const ouList = (value || []).filter(item => {
        return item.company_id === this.oddCompanyId.ah
      })
      if (!ouList || !ouList.length) {
        return
      }
      const itemOdd = ouList.find(
        item => Number(item.mid) === Number(this.matchId)
      )
      if (!itemOdd) {
        return
      }
      this.setOddsData('ou', itemOdd.odd)
    },
  },
}
</script>

<style lang="scss" scoped>
.match-odds {
  width: 100%;
  line-height: 30px;
  margin-bottom: 12px;
  background-color: $color-white;
  text-align: center;
  color: #666666;
  th {
    font-weight: normal;
  }
  tbody {
    tr {
      &:nth-of-type(even) {
        background-color: $color-white;
      }
      &:nth-of-type(odd) {
        background-color: #f5f5f5;
      }
    }
    td {
      border-right: 1px solid #efefef;
    }
  }
  .item-odds {
    display: flex;
    > span {
      flex: 1;
    }
  }
}
</style>
