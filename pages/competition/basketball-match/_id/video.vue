<template>
  <div class="basketball-video-wrap">
    <List
      :match-id="matchId"
      :match-info="matchInfo"
      class="fixed-left set-shadow"
    />

    <div class="match-video-main">
      <TopTab class="set-shadow" :match-id="matchId" :match-info="matchInfo" />

      <div class="match-video">
        <MatchStat
          class="set-border-radius set-shadow"
          :match-id="matchId"
          :match-info="matchInfo"
        />

        <ClientOnly>
          <ChatRoom
            :match-id="matchId"
            :types="2"
            class="set-border-radius set-shadow"
          />
        </ClientOnly>
      </div>

      <BottomTab
        :match-id="matchId"
        :match-info="matchInfo"
        class="set-shadow"
      />
    </div>
  </div>
</template>

<script>
import TopTab from '@/page-components/competition/basketball-match/video-top'
import BottomTab from '@/page-components/competition/basketball-match/video-bottom'
import MatchStat from '@/page-components/competition/basketball-match/video-match'
import List from '@/page-components/competition/basketball-match/video-list'
import ChatRoom from '@/page-components/competition/components/chat-room'

export default {
  components: {
    TopTab,
    BottomTab,
    MatchStat,
    List,
    ChatRoom,
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
.basketball-video-wrap {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  .fixed-left {
    width: 303px;
    margin-left: -315px;
    margin-top: -175px;
    margin-bottom: 12px;
    background-color: $color-white;
  }

  .match-video-main {
    width: 1000px;
  }

  .set-shadow {
    box-shadow: 0 0 4px 0 rgba(51, 51, 51, 0.08);
  }

  .set-border-radius {
    border-radius: 8px;
  }

  .match-video {
    display: flex;
    margin-bottom: 12px;
    justify-content: space-between;
  }
}
</style>
