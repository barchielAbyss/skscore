<template>
  <div class="video-bottom">
    <p class="title">{{ title }}</p>

    <div v-if="flag">
      <Tab :team-group="first_team" />
      <Tab :team-group="backup_team" />
    </div>

    <div v-if="!flag" class="no-data-remind">暂 无 数 据</div>
  </div>
</template>

<script>
import api from '@/api'
import Tab from './video-team-square'

export default {
  components: { Tab },
  props: {
    matchId: {
      type: [String, Number],
      required: true,
    },

    matchInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      flag: false,
      title: '球队阵容',
      first_team: {},
      backup_team: {},
    }
  },
  mounted() {
    this.fetchTeamPeople(Number(this.matchId))
  },
  methods: {
    // 网络请求
    fetchTeamPeople(matchId) {
      this.$axios
        .get(api.get.basketball.fetchBasketballTeamSquare, {
          params: { match_id: matchId },
        })
        .then(({ data, code }) => {
          if (!data || code !== 0) {
            this.flag = false
            throw new Error('暂无数据')
          }

          this.first_team = {
            type: 1,
            home_team: this.classifyStaff(data.stat.home_stat, 1),
            guest_team: this.classifyStaff(data.stat.guest_stat, 1),
            home_name: this.matchInfo.homeInfo.name,
            guest_name: this.matchInfo.guestInfo.name,
          }

          this.backup_team = {
            type: 0,
            home_team: this.classifyStaff(data.stat.home_stat, 0),
            guest_team: this.classifyStaff(data.stat.guest_stat, 0),
            home_name: this.matchInfo.homeInfo.name,
            guest_name: this.matchInfo.guestInfo.name,
          }

          this.flag = true
        })
        .catch(() => {
          this.flag = false
        })
    },

    // 确定首发/替补球员
    classifyStaff(arr, type) {
      // 首发
      if (type) {
        return arr.filter(item => item[2] && item !== '0')
      } else {
        // 替补
        return arr.filter(item => !(item[2] && item !== '0'))
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.video-bottom {
  padding: 12px 20px;
  background-color: $color-white;
  border-radius: 8px;
  margin-bottom: 12px;

  .no-data-remind {
    color: #666;
    text-align: center;
    background-color: #f5f5f5;
    margin-top: 12px;
    height: 30px;
    line-height: 30px;
    font-size: $font-size-small;
  }

  .title {
    color: #666;
    font-weight: bold;
    font-family: $font-family-no-number;
    font-size: $font-size-middle;
  }
}
</style>
