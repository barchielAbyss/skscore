<template>
  <div class="list-item-wrap" :style="styles">
    <h1 class="title">
      <NuxtLink
        :to="{
          name: 'exchange-alliance-articles-authorId-articleId',
          params: { articleId: list.articleId, authorId: list.uid },
        }"
      >
        {{ list.title }}
      </NuxtLink>
    </h1>
    <div class="is-pay">
      <p v-text="list.type" />
    </div>
    <div class="list-details">
      <div class="details-top">
        <p>
          <VIcon name="football" class="list-icon" />
          <span v-text="list.eventName" />
        </p>
        <p v-text="list.time" />
      </div>
      <div v-if="!flag" v-text="list.teams" />
      <div v-if="flag" class="style-img">
        <span>{{ list.homeName }}</span>
        <img v-lazy="list.homeIcon" class="team-title-icon home" />
        <span class="challenge">vs</span>
        <img v-lazy="list.guestIcon" class="team-title-icon guest" />
        <span>{{ list.guestName }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import VIcon from '@/components/icon'

export default {
  components: { VIcon },
  props: {
    list: { type: Object, default: () => ({}) },
    styles: { type: Object, default: () => ({}) },
    flag: { type: Boolean, default: false },
  },
}
</script>

<style lang="scss" scoped>
.list-item-wrap {
  font-family: $font-family-no-number;
  font-size: $font-size-small;
  color: #666;
  background-color: $color-white;

  .title {
    font-size: $font-size-middle;
    color: #333;
    font-weight: bold;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 40px;
    line-height: 20px;

    a:hover {
      color: $color-active;
    }
  }

  .is-pay {
    margin: 10px 0;
    display: flex;
    justify-content: flex-end;
    p {
      border: 1px solid #00a54f;
      border-radius: 2px;
      width: 36px;
      height: $font-size-middle;
      line-height: $font-size-middle;
      text-align: center;
      color: #00a54f;
    }
  }

  .list-details {
    background: #f5f5f5;
    border-radius: 8px;
    padding: 8px;

    .style-img {
      height: 22px;
      line-height: 22px;
      img {
        width: 22px;
        margin: 0 4px;
        max-height: 22px;
        vertical-align: bottom;
      }
    }

    .details-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;

      .list-icon {
        margin-right: 8px;
      }
    }
  }
}
</style>
