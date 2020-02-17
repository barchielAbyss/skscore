<template>
  <div class="page">
    <div class="header">
      <TopHeader>
        <div class="header-tool">
          <Nav :default-active="defaultActive" />
          <User class="user" />
        </div>
      </TopHeader>
    </div>

    <div class="main main-content" :class="$route.name">
      <transition name="router-fade" mode="out-in">
        <Nuxt />
      </transition>
    </div>

    <div class="footer">
      <BottomFooter />
    </div>

    <ClientOnly>
      <FlexBox />
    </ClientOnly>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapState, mapActions } from 'vuex'

import api from '@/api'
import User from './user'
import Nav from './nav'
import TopHeader from './header'
import BottomFooter from './footer'
import FlexBox from './flex-box'

export default {
  components: {
    Nav,
    User,
    TopHeader,
    BottomFooter,
    FlexBox,
  },
  data() {
    return {
      timeDifference: 0,
      version: '',
    }
  },
  computed: {
    ...mapState('user', ['serverTime']),
    defaultActive() {
      return this.$route.path || ''
    },
  },
  created() {
    this.fetchServerTime().then(date => {
      const time = date.add(20, 'second')
      this.timeDifference = time.diff(dayjs())
      this.SetServerTime(time)

      setInterval(() => {
        this.SetServerTime(
          dayjs()
            .add(this.timeDifference, 'millisecond')
            .add(1, 'second')
        )
      }, 1000)
    })
  },
  mounted() {
    this.fetchUserInfo()
    this.fetchVersion()

    setInterval(() => {
      this.fetchVersion()
    }, 2 * 60 * 1000)
  },
  methods: {
    ...mapActions('user', ['SetLoginType', 'SetUserInfo', 'SetServerTime']),
    async fetchServerTime(res) {
      const { data } = await this.$axios.get(api.get.user.fetchServerTime)
      return Promise.resolve(data.time ? dayjs.unix(data.time) : dayjs())
    },
    handleSearch(value) {
      this.$router.push({
        name:
          value.sportType === 1
            ? 'archive-football-id-basic'
            : 'archive-basketball-id-basic',
        params: {
          id: value.id,
        },
      })
    },
    fetchUserInfo() {
      this.$axios
        .get(api.get.user.getUserInfo)
        .then(({ code, data }) => {
          if (code === 0) {
            this.SetLoginType(true)
            this.SetUserInfo(data.user)
          }
        })
        .catch(() => {})
    },
    fetchVersion() {
      this.$axios.get(api.get.user.getVersion).then(({ code, data }) => {
        if (code !== 0 || !data.value || this.version === data.value) {
          return
        }

        if (this.version) {
          location.reload()
        }

        this.version = data.value
      })
    },
  },
}
</script>

<style lang="scss">
.page {
  padding-top: 60px;

  .header {
    min-width: 1040px;
    background-color: #fff;
    color: $color-font-base;
    height: 60px;
    box-sizing: border-box;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;

    .top-header {
      position: relative;
      width: 1280px;
      margin: 0 auto;
      @include transition-all;
    }
    .header-tool {
      display: flex;
      align-items: center;

      .user {
        position: absolute;
        right: 0;
        top: 15px;
      }
    }
    .page-nav {
      border: none;
    }
  }
  .main {
    margin-top: 12px;
    margin-bottom: 40px;
    min-height: calc(100vh - 160px);
  }
  .footer {
    background-color: $color-white;
    color: #999;
    position: relative;
  }

  .router-fade-enter-active,
  .router-fade-leave-active {
    @include transition-all;
  }
  .router-fade-enter,
  .router-fade-leave-to {
    opacity: 0;
  }
}
</style>
