<template>
  <ul class="home-flex-box" :class="{ visible: isVisible }">
    <li
      v-for="item of btns"
      :key="item.id"
      class="home-flex-item"
      @click="handleClickBtn(item.id)"
    >
      <i :class="['home-flex-item__icon', 'iconfont', `icon-${item.icon}`]" />
      <span v-if="item.into" class="home-flex-item__into" v-text="item.into" />
      <span class="home-flex-item__title" v-text="item.name" />
    </li>
  </ul>
</template>

<script>
import { throttle } from 'lodash'

const BTNS = [
  {
    name: '回到顶部',
    icon: 'backup',
    id: 'Backup',
  },
  {
    name: '篮球比分',
    icon: 'lanqiu',
    id: 'Basketball',
    hidden: true,
  },
  {
    name: '足球比分',
    icon: 'football',
    id: 'Football',
    hidden: true,
  },
  {
    name: '收藏本站',
    icon: 'star',
    into: '（Ctrl+D）',
    id: 'Collect',
  },
]

export default {
  props: {
    visibilityHeight: {
      type: Number,
      default: 400,
    },
  },
  data() {
    return {
      isVisible: false,
    }
  },
  computed: {
    btns() {
      switch (this.$route.name) {
        case 'competition-football':
          return BTNS.map(item => ({
            ...item,
            hidden: item.id === 'Football',
          })).filter(item => !item.hidden)
        case 'competition-basketball':
          return BTNS.map(item => ({
            ...item,
            hidden: item.id === 'Basketball',
          })).filter(item => !item.hidden)
        default:
          return BTNS.filter(item => !item.hidden)
      }
    },
  },
  mounted() {
    document.addEventListener('scroll', this.listenTop)
  },
  beforeDestroy() {
    document.removeEventListener('scroll', this.listenTop)
  },
  methods: {
    listenTop() {
      if (window.scrollY > this.visibilityHeight) {
        this.isVisible = true
        this.$el.style.height = `${this.btns.length * 92}px`
      } else {
        this.isVisible = false
        this.$el.style.height = 0
      }
    },
    handleClickBtn(id) {
      this[`on${id}`]()
    },
    onFootball() {
      this.onBackup()
      this.$router.push({ name: 'competition-football' })
    },
    onBasketball() {
      this.onBackup()
      this.$router.push({ name: 'competition-basketball' })
    },
    onBackup() {
      const goTop = setInterval(() => {
        window.scrollBy(0, -(window.scrollY / 10))
        const cTop = window.scrollY

        if (cTop <= 10) {
          clearInterval(goTop)
        }
      }, 10)
    },
    onCollect: throttle(function() {
      try {
        window.external.addFavorite('//TODO url src', '实况比分')
      } catch (e) {
        try {
          window.sidebar.addPanel('实况比分', '//TODO url src', '')
        } catch (e) {
          this.$message({
            message:
              '抱歉，您所使用的浏览器无法完成此操作。\n\n加入收藏失败，请使用Ctrl+D进行添加',
            type: 'error',
          })
        }
      }
    }, 3000),
  },
}
</script>

<style lang="scss" scoped>
.home-flex-box {
  position: fixed;
  left: 50%;
  transform: translate(660px, 8px);
  bottom: 150px;
  width: 80px;
  opacity: 0;
  overflow: hidden;
  height: 0;
  @include transition-all;
  &.visible {
    opacity: 1;
  }
  .home-flex-item {
    cursor: pointer;
    width: 80px;
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: $color-white;
    border-radius: 8px;
    margin-bottom: 12px;
    @include transition-all;
    &:hover,
    &:active {
      background-color: $color-active;
      color: $color-white;
    }
    .home-flex-item__icon {
      font-size: 26px;
      &.icon-star {
        margin-bottom: 12px;
      }
    }
    .home-flex-item__into {
      position: absolute;
      font-size: 16px;
      transform: translateY(7px) scale(0.5);
    }
    .home-flex-item__title {
      font-size: 12px;
    }
  }
}
@media screen and (max-width: 1120px) {
  .home-flex-box {
    display: none;
  }
}
</style>
