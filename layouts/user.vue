<template>
  <div class="header-menu-user">
    <div v-if="!isLogin" :class="{ isLogin: 'user-login' }">
      <div class="user-login-button" @click="handleLogin">登录/注册</div>

      <LoginDialog v-if="showLogin" :visible.sync="showLogin" />
    </div>

    <div v-else class="user-info">
      <ElPopover placement="bottom-end" popper-class="user-info__setting">
        <a class="user-info__logout" @click="handleLogout">
          登出
        </a>
        <div slot="reference" :title="userInfo.nickname">
          <i v-if="!noIcon" class="user-info__icon">
            <img :src="userInfo.iconurl" @error="onImgError" />
          </i>

          <i v-if="noIcon" class="iconfont icon-user user-info__icon" />
        </div>
      </ElPopover>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import LoginDialog from '@/page-components/header/login/login-dialog'

import api from '@/api'

export default {
  components: {
    LoginDialog,
  },
  data() {
    return {
      showLogin: false,
      noIcon: false,
    }
  },
  computed: {
    ...mapState('user', ['userInfo', 'isLogin']),
  },
  methods: {
    ...mapActions('user', ['SetLoginType', 'SetUserInfo']),
    handleLogin() {
      this.showLogin = true
    },
    onImgError() {
      this.noIcon = true
    },
    handleLogout() {
      this.$axios.post(api.post.user.logout).then(({ code }) => {
        localStorage.removeItem('tkey')
        if (code === 0) {
          this.SetUserInfo()
          this.SetLoginType(false)
          this.$router.push({
            query: {
              ...this.$route.query,
              _: new Date().getTime(),
            },
          })
        }
      })
    },
  },
}
</script>

<style lang="scss">
.header-menu-user {
  margin-left: 16px;
  cursor: pointer;
  .user-login-button {
    text-align: center;
    color: $color-white;
    font-size: $font-size-middle;
    background-color: #e1243b;
    border-radius: 2px;
    width: 83px;
    height: 30px;
    cursor: pointer;
    line-height: 30px;
  }
  .user-login {
    width: 26px;
    height: 26px;
    background: $color-white;
    border-radius: 50%;
    overflow: hidden;
    text-align: right;
    transition: all 0.2s ease-in-out;
  }
  .user-info__icon {
    display: flex;
    font-size: 20px;
    max-width: 20px;
    max-height: 20px;
    padding-right: 8px;
    justify-content: center;
    align-items: center;
  }
}
.user-info__setting {
  text-align: center;
  .user-info__logout {
    line-height: 32px;
  }
}
</style>
