<template>
  <Carousel
    class="home-news"
    :per-page="1"
    :mouse-drag="false"
    navigation-arrow="hover"
    pagination-enabled
    navigation-enabled
    autoplay
    loop
  >
    <CarouselSlide
      v-for="(item, index) in list"
      :key="index"
      class="home-news__item"
    >
      <!--      <a-->
      <!--        class="home-news_item-link"-->
      <!--        :href="`/intelligence/new/${item.newsid}`"-->
      <!--        target="__blank"-->
      <!--      >-->
      <img class="home-news__item-pic" :src="item" />
      <!--      </a>-->
    </CarouselSlide>
  </Carousel>
</template>

<script>
import Carousel from '@/components/carousel'
import CarouselSlide from '@/components/carousel/slide'

export default {
  components: {
    Carousel,
    CarouselSlide,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss" scoped>
.home-news {
  background-color: $color-white;
  height: 221px;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  .home-news__item {
    display: flex;
    align-items: center;
    height: 221px;
    position: relative;
    &:hover {
      .home-news__item-pic {
        transform: scale(1.05);
      }
    }
    .home-news_item-link {
      width: 100%;
      display: block;
    }
    .home-news__item-pic {
      width: 100%;
      height: 221px;
      transition: all 0.5s ease-out;
    }
  }
}
.home-news /deep/ .carousel-pagination--bottom-overlay {
  right: 50%;
  transform: translateX(50%);
  bottom: -5px;
}
.home-news /deep/ .carousel-pagination .carousel-dot-container {
  .carousel-dot {
    width: 4px !important;
    height: 4px !important;
  }

  .carousel-dot--active {
    width: 12px !important;
  }
}
.home-news /deep/ .prev,
.home-news /deep/ .next {
  font-size: 20px;
  padding: 0 5px;
  opacity: 0.5;
  background-color: #333;
  color: $color-white;
  transition: all 0.3s;
  &:hover {
    opacity: 0.8;
    font-weight: bold;
  }
}
</style>
