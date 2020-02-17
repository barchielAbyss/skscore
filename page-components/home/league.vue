<template>
  <div class="home-league">
    <NuxtLink
      v-for="item of league"
      :key="item.event_id"
      :to="{
        name: 'archive-football-id-basic',
        params: { id: item.event_id },
      }"
      class="home-league-item"
    >
      <p class="home-league-item__icon">
        <img
          v-lazy="{
            src: item.icon,
            loading: '/icon/football-event.png',
            error: '/icon/football-event.png',
          }"
        />
      </p>
      <p class="home-league-item__name">{{ item.name }}</p>
    </NuxtLink>
  </div>
</template>

<script>
export default {
  props: {
    league: Array,
  },
}
</script>

<style lang="scss" scoped>
.home-league {
  @include card;
  height: 76px;
  padding: 10px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  .home-league-item {
    position: relative;
    width: 72px;
    max-height: 53px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
    transition: all 0.3s;
    .home-league-item__icon {
      > img {
        max-width: 100%;
        max-height: 53px;
        transition: all 0.3s;
      }
    }
    .home-league-item__name {
      position: absolute;
      bottom: -10px;
      font-size: 12px;
      opacity: 0;
      color: #666;
      transition: all 0.4s;
    }
    &:hover {
      box-shadow: 0 2px 6px 0 #dedede;
      padding-bottom: 30px;
      .home-league-item__icon {
        transform: translateY(-1px);
      }
      .home-league-item__name {
        bottom: 4px;
        opacity: 1;
      }
    }
  }
}
</style>
