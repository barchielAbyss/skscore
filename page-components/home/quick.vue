<template>
  <div class="home-quick-guide">
    <h3>快速入口</h3>
    <div class="home-quick-guide__list">
      <NuxtLink
        v-for="item of quickMap"
        :key="item.title"
        :class="[
          'home-quick-guide__item',
          {
            'has-hover': item.routeName,
          },
        ]"
        :to="{
          name: item.routeName,
        }"
      >
        <i
          :class="['iconfont', `icon-${item.icon}`]"
          :style="{ color: item.color }"
        />
        <span class="home-quick-guide__item__title" v-text="item.title" />
      </NuxtLink>
    </div>
  </div>
</template>

<script>
const DEFAULT_QUICK_MAP = [
  {
    title: '足球比分',
    icon: 'football',
    routeName: 'competition-football',
  },
  {
    title: '篮球比分',
    icon: 'basketball',
    routeName: 'competition-basketball',
  },
  {
    title: '赛事推介',
    icon: 'jewel',
    routeName: 'exchange-alliance-bbs',
  },
  {
    title: '敬情期待',
    icon: 'loading',
  },
]

export default {
  computed: {
    quickMap() {
      return DEFAULT_QUICK_MAP
    },
  },
}
</script>

<style lang="scss" scoped>
.home-quick-guide {
  @include card;
  h3 {
    @include card-title;
    margin-bottom: 13px;
  }
  .home-quick-guide__list {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    margin-bottom: -8px;
  }
  .home-quick-guide__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 36px;
    margin-bottom: 8px;
    background-color: #f9f9f9;
    border-radius: 8px;
    &.has-hover {
      &:hover,
      &:active {
        background-color: #e5f1ff;
        .home-quick-guide__item__title {
          color: $color-active;
        }
        .iconfont {
          color: $color-active;
        }
      }
    }

    .iconfont {
      font-size: 24px;
      &.icon-football {
        color: $font-title-color;
      }
      &.icon-basketball {
        color: #f06000;
      }
      &.icon-jewel {
        color: #f7b500;
      }
      &.icon-loading {
        color: $color-active;
      }
    }
    .home-quick-guide__item__title {
      color: $font-title-color;
      font-size: 15px;
      font-weight: bold;
    }
  }
}
</style>
