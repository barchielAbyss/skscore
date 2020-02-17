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
    <CarouselSlide v-for="item in news" :key="item.id" class="home-news__item">
      <a
        class="home-news_item-link"
        :href="
          $router.resolve({
            name: 'intelligence-news-detail-id',
            params: {
              id: item.id,
            },
          }).href
        "
        target="__blank"
      >
        <img class="home-news__item-pic" :src="item.img" :alt="item.title" />
        <p class="home-news__item-title" v-text="item.title" />
      </a>
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
    news: Array,
  },
}
</script>

<style lang="scss">
.home-news {
  background-color: $color-white;
  height: 334px;
  border-radius: 8px;
  overflow: hidden;
  .prev,
  .next {
    font-size: 36px;
    opacity: 0.5;
    background-color: #333;
    color: $color-white;
    transition: all 0.3s;
    &:hover {
      opacity: 0.8;
    }
  }

  .home-news__item {
    display: flex;
    height: 334px;
    align-items: center;
    position: relative;
    overflow: hidden;

    &:hover {
      .home-news__item-pic {
        transform: scale(1.05);
      }
    }
    .home-news__item-pic {
      min-width: 578px;
      min-height: 334px;
      transition: all 0.5s ease-out;
    }
    .home-news__item-title {
      color: $color-white;
      width: 100%;
      font-size: 15px;
      font-weight: bold;
      padding: 16px 20px;
      box-sizing: border-box;
      position: absolute;
      bottom: 0;
      left: 0;
      background: linear-gradient(
        to bottom,
        transparent 0,
        rgba(0, 0, 0, 0.4) 100%
      );
    }
  }
}
</style>
