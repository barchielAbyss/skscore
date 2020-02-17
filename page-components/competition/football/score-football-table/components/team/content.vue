<template>
  <NuxtLink
    ref="popover"
    :to="{
      name: 'archive-team-detail',
      query: {
        eventId: row.event.id,
        eventName: row.event.name_js,
        sportType: 'football',
        teamId: row[keyId].id,
      },
    }"
    :class="['components-team', keyId]"
  >
    <div class="team-main">
      <span v-if="row.card.yellow[keyId] && hasYellowCard" class="card-yellow">
        {{ row.card.yellow[keyId] }}
      </span>
      <span v-if="row.card.red[keyId] && hasRedCard" class="card-red">
        {{ row.card.red[keyId] }}
      </span>
      <span
        v-if="row.rank[keyId] && hasRank"
        title="联赛排名"
        class="team-rank"
      >
        [{{ row.rank[keyId] }}]
      </span>
      <span :class="isVisible ? 'title-active' : 'title-default'">
        {{
          setting.lang === 'zh'
            ? row[keyId].name
            : row[keyId].name_e || row[keyId].name
        }}
      </span>
    </div>
    <div class="team-icon">
      <VImage :src="row[keyId].icon" error-src="/icon/team.png" />
    </div>
  </NuxtLink>
</template>

<script>
import { mapState } from 'vuex'
import VImage from '@/components/image'

export default {
  components: {
    VImage,
  },
  props: {
    isVisible: { type: Boolean, required: true },
    row: Object,
    keyId: String,
  },
  computed: {
    ...mapState('competition-football', ['setting']),
    hasRank() {
      return this.setting.event.includes('rank')
    },
    hasYellowCard() {
      return this.setting.event.includes('yellow')
    },
    hasRedCard() {
      return this.setting.event.includes('red')
    },
  },
}
</script>

<style lang="scss" scoped>
.components-team {
  padding: 0 2px;
  font-size: $font-size-small;
  .card-yellow,
  .card-red {
    display: inline-block;
    vertical-align: text-bottom;
    text-align: center;
    border-radius: 2px;
    color: white;
    min-width: 10px;
    margin: 0 2px;
  }
  .card-yellow {
    background-color: #f7b500;
  }
  .card-red {
    background-color: #e1243b;
  }
  .team-icon {
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    padding: 0 2px;
  }

  .title-default {
    color: $color-font-base;
  }

  .title-active {
    color: $color-active;
  }
}
</style>
