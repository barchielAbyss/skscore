<template>
  <div class="home-hot-team">
    <h3 class="home-hot-team__title">最热球队</h3>

    <ul class="home-hot-team__list">
      <Item
        v-for="team of hotTeams.list"
        :key="team.team_id"
        :info="team"
        :event="hotTeams.event"
      />
    </ul>
  </div>
</template>

<script>
import Item from './item'

export default {
  components: {
    Item,
  },
  props: {
    hotTeams: Object,
  },
}
</script>

<style lang="scss" scoped>
.home-hot-team {
  @include card;
  .home-hot-team__title {
    @include card-title;
  }
}
</style>
