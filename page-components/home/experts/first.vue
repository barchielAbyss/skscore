<template>
  <div class="home-experts-first">
    <h3 class="home-experts-first__title">
      赛事推介
    </h3>

    <div class="home-experts-first__mian">
      <div class="experts-pic">
        <img src="@/assets/images/experts.jpg" alt="" />
      </div>
      <Item :list="info" :styles="style" :style-bar="styleBar" :flag="true" />
    </div>
  </div>
</template>

<script>
import Item from '../../exchange/bbs/bbs-list-item'

export default {
  components: {
    Item,
  },
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    style() {
      return {
        width: '321px',
        boxShadow: '0 0 0 0 rgba(51, 51, 51, 0.05)',
        borderRadius: '8px',
        padding: 0,
      }
    },

    styleBar() {
      return {
        top: 0,
        right: '-12px',
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.home-experts-first {
  @include card;
  @include transition-all;
  padding: 12px;
  margin-bottom: 8px;
  box-shadow: 0 0 4px 0 rgba(51, 51, 51, 0.05);
  &__title {
    @include card-title;
    padding-bottom: 12px;
    padding-left: 12px;
    padding-right: 12px;
    margin: 0 -12px;
    border-bottom: 1px solid #efefef;
  }
  &__mian {
    padding-top: 12px;
    position: relative;
    display: flex;
    overflow: hidden;
    padding-left: 12px;
    padding-right: 12px;
    margin: 0 -12px;
  }

  .experts-pic {
    width: 223px;
    height: 182px;
    margin-right: 10px;
    overflow: hidden;
    border-radius: 4px;
    display: flex;
    justify-content: center;

    img {
      max-width: max-content;
      height: 100%;
    }
  }
}
</style>
