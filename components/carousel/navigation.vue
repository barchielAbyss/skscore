<template>
  <div class="carousel-navigation">
    <div
      class="carousel-navigation-button carousel-navigation-prev"
      :class="{ 'carousel-navigation--disabled': !canAdvanceBackward }"
    >
      <i
        :class="['prev', 'iconfont', `icon-${icon}`]"
        @click.prevent="triggerPageAdvance('backward')"
      />
    </div>
    <div
      class="carousel-navigation-button carousel-navigation-next"
      :class="{ 'carousel-navigation--disabled': !canAdvanceForward }"
    >
      <i
        :class="['next', 'iconfont', `icon-${icon}`]"
        @click.prevent="triggerPageAdvance('forward')"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  inject: ['carousel'],
  props: {
    icon: {
      type: String,
      default: 'arrow',
    },
  },
  computed: {
    /**
     * @return {Boolean} Can the slider move forward?
     */
    canAdvanceForward() {
      return this.carousel.canAdvanceForward || false
    },
    /**
     * @return {Boolean} Can the slider move backward?
     */
    canAdvanceBackward() {
      return this.carousel.canAdvanceBackward || false
    },
  },
  methods: {
    /**
     * Trigger page change on +/- 1 depending on the direction
     * @param {"backward"} [direction]
     * @return {void}
     */
    triggerPageAdvance(direction) {
      /**
       * @event paginationclick
       * @type {string}
       */
      this.$emit('navigationclick', direction)
    },
  },
}
</script>

<style lang="scss">
.carousel-navigation {
  .carousel-navigation-button {
    position: absolute;
    display: flex;
    top: 0;
    height: 100%;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    box-sizing: border-box;
    color: #000;
    text-decoration: none;
    border: none;
    background-color: transparent;
    padding: 0;
    outline: none;
  }

  .carousel-navigation-next {
    right: 0;
    .next {
      cursor: pointer;
      transform: rotate(0deg);
    }
  }

  .carousel-navigation-prev {
    left: 0;
    .prev {
      cursor: pointer;
      transform: rotate(180deg);
    }
  }

  .carousel-navigation--disabled {
    .next,
    .prev {
      color: #ccc;
      cursor: not-allowed;
    }
  }
}
</style>
