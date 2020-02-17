<template>
  <div class="intelligence-match-basic">
    <EventRank class="card" :match-info="matchInfo" />
    <MatchHistory class="card" :match-info="matchInfo" />
    <TeamHistory class="card" :match-info="matchInfo" />
    <MatchPlan class="card" :match-info="matchInfo" />
  </div>
</template>

<script>
import EventRank from '@/page-components/competition/football-match/basic/event-rank'
import MatchPlan from '@/page-components/competition/football-match/basic/match-plan'
import TeamHistory from '@/page-components/competition/football-match/basic/team-history'
import MatchHistory from '@/page-components/competition/football-match/basic/match-history'

export default {
  components: {
    EventRank,
    MatchHistory,
    TeamHistory,
    MatchPlan,
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
}
</script>

<style lang="scss" scoped>
.intelligence-match-basic {
  .card {
    padding: 14px;
    background-color: $color-white;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.03);
    border-radius: 4px;
    margin-bottom: 12px;
    overflow: hidden;
  }
}
</style>
