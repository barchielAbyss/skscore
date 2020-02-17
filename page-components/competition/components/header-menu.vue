<template>
  <div class="score-header-menu">
    <div class="score-header-menu-content main-content">
      <div class="menu-wrap">
        <div id="menu-slider" class="menu-slider" />
        <span
          v-for="(item, index) of menuList"
          :key="index"
          :class="[
            'score-header-menu__item',
            {
              active:
                item.route.query.timeType === ($route.query.timeType || 'now'),
            },
          ]"
          @click="handleChangeMenu(item.route)"
          v-text="item.name"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'

export default {
  props: {
    menuList: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.sliderAnimate(this.$route)
  },
  methods: {
    sliderAnimate(route) {
      if (route.query.timeType === 'now') {
        document.getElementById('menu-slider').style.transform = 'translateX(0)'
      } else if (route.query.timeType === 'past') {
        document.getElementById('menu-slider').style.transform =
          'translateX(130px)'
      } else if (route.query.timeType === 'future') {
        document.getElementById('menu-slider').style.transform =
          'translateX(260px)'
      }
    },

    handleChangeMenu: debounce(function(route) {
      this.$router.push(route)
      this.sliderAnimate(route)
    }, 350),
  },
}
</script>

<style lang="scss">
.score-header-menu {
  background-color: $color-white;
  position: fixed;
  width: 100%;
  height: 46px;
  left: 0;
  top: 60px;
  z-index: 54;
  border-top: 1px #f3f4f7 solid;

  .menu-wrap {
    position: relative;
    width: 360px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
  }
  .menu-slider {
    width: 36px;
    height: 3px;
    background-image: linear-gradient(to right, #0037af, #e1243b);
    position: absolute;
    bottom: 0;
    left: 32px;
    transform: translateX(0);
  }
  &__item {
    cursor: pointer;
    display: block;
    font-size: $font-size-small;
    color: $color-active;
    width: 100px;
    height: 46px;
    font-weight: bold;
    line-height: 46px;
    text-align: center;
  }
}
</style>
