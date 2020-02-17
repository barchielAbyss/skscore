<template>
  <div class="intelligence-match-data">
    <RadarMap
      :home-team="homeTeam"
      :guest-team="guestTeam"
      :match-id="matchId"
    />
    <Table :home-team="homeTeam" :guest-team="guestTeam" />
    <LineMap :match-info="matchInfo" />
  </div>
</template>

<script>
import Table from '@/page-components/competition/football-match/data/middle-table'
import LineMap from '@/page-components/competition/football-match/data/line-map'
import RadarMap from '@/page-components/competition/football-match/data/radar-map'

export default {
  components: { RadarMap, LineMap, Table },
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
  computed: {
    homeTeam() {
      return this.matchInfo.home
    },
    guestTeam() {
      return this.matchInfo.guest
    },
  },
}
</script>
