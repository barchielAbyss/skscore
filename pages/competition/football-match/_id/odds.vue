<template>
  <div class="intelligence-match-odds">
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
        ref="component"
        :type-id="curTabId"
        :match-id="matchId"
        :team-name="teamName"
      />
    </keep-alive>
  </div>
</template>

<script>
import HdaList from '@/page-components/competition/football-match/odds/hda-list'
import AhList from '@/page-components/competition/football-match/odds/ah-list'
import OuList from '@/page-components/competition/football-match/odds/ou-list'

const TAB_LIST = [
  { id: 'hda', title: '欧赔', component: 'HdaList' },
  { id: 'ah', title: '亚赔', component: 'AhList' },
  { id: 'ou', title: '大小', component: 'OuList' },
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
      const host = this.matchInfo.home
      const guest = this.matchInfo.guest
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

<style lang="scss">
.intelligence-match-odds {
  font-size: 14px;
  .odds-tabs-title {
    margin-bottom: 12px;
    text-align: center;
    .m-tab {
      padding: 0 24px;
      margin: 0 32px;
    }
  }

  .card {
    padding: 14px;
    background-color: $color-white;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.03);
    border-radius: 4px;
    margin-bottom: 12px;
  }
}
</style>
