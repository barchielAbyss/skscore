<template>
  <div
    v-show="carousel.pageCount > 1"
    class="carousel-pagination"
    :class="[
      carousel.paginationClass,
      {
        [`carousel-pagination--${paginationPositionModifierName}`]: paginationPositionModifierName,
      },
    ]"
  >
    <div
      class="carousel-dot-container"
      role="tablist"
      :style="dotContainerStyle"
    >
      <button
        v-for="(page, index) in paginationCount"
        :key="`${page}_${index}`"
        class="carousel-dot"
        aria-hidden="false"
        role="tab"
        :title="getDotTitle(index)"
        :value="getDotTitle(index)"
        :aria-label="getDotTitle(index)"
        :aria-selected="isCurrentDot(index) ? 'true' : 'false'"
        :class="{ 'carousel-dot--active': isCurrentDot(index) }"
        :style="dotStyle(index)"
        @click="goToPage(index)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  inject: ['carousel'],
  computed: {
    paginationPositionModifierName() {
      const { paginationPosition } = this.carousel
      // guard to add only required class modifiers
      if (paginationPosition.indexOf('overlay') < 0) {
        return
      }
      return paginationPosition
    },
    paginationCount() {
      if (!this.carousel) {
        return 0
      }

      const { scrollPerPage, pageCount, slideCount } = this.carousel

      if (scrollPerPage) {
        return pageCount
      } else if (slideCount > 0) {
        return slideCount - 1
      } else {
        return 0
      }
    },
    dotContainerStyle() {
      const { carousel } = this
      const containerWidth =
        carousel.maxPaginationDotCount * carousel.paginationSize
      return {
        overflow: 'hidden',
        width: `${containerWidth}px`,
        margin: '0 auto',
        'white-space': 'nowrap',
      }
    },
  },
  methods: {
    /**
     * Change page by index
     * @param {number} index
     * return {void}
     */
    goToPage(index) {
      /**
       * @event paginationclick
       * @type {number}
       */
      this.$emit('paginationclick', index)
    },

    /**
     * Check on current dot
     * @param {number} index - dot index
     * @return {boolean}
     */
    isCurrentDot(index) {
      return index === this.carousel.currentPage
    },

    /**
     * Generate dot title
     * @param {number} index - dot index
     * @return {string}
     */
    getDotTitle(index) {
      return this.carousel.$children[index].title
        ? this.carousel.$children[index].title
        : `Item ${index}`
    },
    /**
     * Control dots appear and disappear
     * @param {number} index - dot index
     * @return {Object} - dot(buttn) style
     */
    dotStyle(index) {
      const { carousel } = this
      const basicBtnStyle = {}

      Object.assign(basicBtnStyle, {
        width: this.isCurrentDot(index)
          ? `${carousel.paginationSize * 3}px`
          : `${carousel.paginationSize}px`,
        height: `${carousel.paginationSize}px`,
        'background-color': `${
          this.isCurrentDot(index)
            ? carousel.paginationActiveColor
            : carousel.paginationColor
        }`,
      })

      if (carousel.maxPaginationDotCount === -1) {
        return basicBtnStyle
      }

      const eachDotsWidth = carousel.paginationSize
      const maxReverse = carousel.pageCount - carousel.maxPaginationDotCount
      const translateAmount =
        carousel.currentPage > maxReverse
          ? maxReverse
          : carousel.currentPage <= carousel.maxPaginationDotCount / 2
          ? 0
          : carousel.currentPage -
            Math.ceil(carousel.maxPaginationDotCount / 2) +
            1
      const transformWidth = 0 - eachDotsWidth * translateAmount
      return Object.assign(basicBtnStyle, {
        '-webkit-transform': `translate3d(${transformWidth}px,0,0)`,
        transform: `translate3d(${transformWidth}px,0,0)`,
        '-webkit-transition': `-webkit-transform ${carousel.speed / 1000}s`,
        transition: `transform ${carousel.speed / 1000}s`,
      })
    },
  },
}
</script>

<style scoped>
.carousel-pagination {
  right: 0;
  bottom: 0;
  padding: 0 20px 12px;
  box-sizing: border-box;
}

.carousel-pagination--top-overlay {
  position: absolute;
  top: 0;
}

.carousel-pagination--bottom-overlay {
  position: absolute;
  bottom: 0;
}

.carousel-into-container {
  color: #fff;
  font-family: Helvetica sans-serif;
  font-size: 15px;
}

.carousel-dot {
  display: inline-block;
  cursor: pointer;
  appearance: none;
  border: none;
  background-clip: content-box;
  box-sizing: content-box;
  padding: 0;
  border-radius: 5px;
  outline: none;
  transition: all 0.3s ease-in;
  margin-right: 8px;
}
</style>
