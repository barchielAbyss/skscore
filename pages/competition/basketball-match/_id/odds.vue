<template>
  <div class="intelligence-basketball-match-odds">
    <div class="odds-tabs-title">
      <span
        v-for="tab of tabList"
        :key="tab.id"
        :class="['m-tab', { active: tab.id === curTabId }]"
        @click="handleChange(tab.id)"
      >
        <span class="content" v-text="tab.title" />
      </span>
    </div>

    <keep-alive>
      <component
        :is="curTab.component"
        :type-id="curTabId"
        :match-id="matchId"
        :team-name="teamName"
      />
    </keep-alive>
  </div>
</template>

<script>
import HdaList from '@/page-components/competition/basketball-match/odds/hda-list'
import AhList from '@/page-components/competition/basketball-match/odds/ah-list'
import OuList from '@/page-components/competition/basketball-match/odds/ou-list'

const TAB_LIST = [
  { id: 'hda', title: '欧赔', component: 'HdaList' },
  { id: 'ah', title: '亚赔', component: 'AhList' },
  { id: 'ou', title: '总分', component: 'OuList' },
]

export default {
  components: {
    HdaList,
    AhList,
    OuList,
  },
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
      curTabId: '',
    }
  },
  computed: {
    tabList: () => TAB_LIST,
    curTab() {
      return this.tabList.find(item => item.id === this.curTabId)
    },
    teamName() {
      const host = this.matchInfo.homeInfo
      const guest = this.matchInfo.guestInfo
      return `${host.name_js || host.name}-${guest.name_js || guest.name}`
    },
  },
  watch: {
    curTabId(value) {
      const { query } = this.$route
      this.$router.replace({
        query: {
          ...query,
          tab: value,
        },
      })
    },
  },
  created() {
    const { tab = 'hda' } = this.$route.query
    this.curTabId = tab
  },
  methods: {
    handleChange(id) {
      if (this.curTabId === id) {
        return
      }

      this.curTabId = id
    },
  },
}
</script>

<style lang="scss" scoped>
.intelligence-basketball-match-odds {
  margin-top: 12px;
  font-size: 14px;
  .odds-tabs-title {
    margin-bottom: 12px;
    text-align: center;
    .m-tab {
      padding: 0 24px;
      margin: 0 32px;
    }
  }
  /deep/ .card {
    padding: 14px;
    background-color: $color-white;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.03);
    border-radius: 4px;
    margin-bottom: 12px;
  }
}
</style>
