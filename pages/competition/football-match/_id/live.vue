<template>
  <div class="intelligence-match-live">
    <MatchesVideoList class="fixed-left card" />

    <div class="match-live-main">
      <MatchOdds class="card" :match-id="matchId" />

      <div class="match-live">
        <MatchStat class="card" :match-id="matchId" :match-info="matchInfo" />
        <ClientOnly>
          <ChatRoom class="card" :match-id="matchId" />
        </ClientOnly>
      </div>

      <MatchSquad
        class="card distant"
        :match-id="matchId"
        :match-info="matchInfo"
      />
    </div>
  </div>
</template>

<script>
import MatchesVideoList from '@/page-components/competition/football-match/live/matches-live-list'
import MatchOdds from '@/page-components/competition/football-match/live/match-odds'
import MatchStat from '@/page-components/competition/football-match/live/match-stat'
import MatchSquad from '@/page-components/competition/football-match/live/match-squad'
import ChatRoom from '@/page-components/competition/components/chat-room'

export default {
  components: {
    MatchesVideoList,
    MatchOdds,
    MatchStat,
    ChatRoom,
    MatchSquad,
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
.intelligence-match-live {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .card {
    box-shadow: 0 0 4px 0 rgba(51, 51, 51, 0.08);
  }

  .distant {
    margin-top: 12px;
  }

  .fixed-left {
    width: 288px;
    margin-left: -300px;
    margin-top: -186px;
    margin-bottom: 12px;
    background-color: $color-white;
  }

  .match-live-main {
    width: 1000px;
  }

  .match-live {
    display: flex;
    justify-content: space-between;
  }
}
</style>
