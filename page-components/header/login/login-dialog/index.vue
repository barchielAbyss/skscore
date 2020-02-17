<template>
  <ElDialog
    ref="loginDialog"
    class="user-login-dialog"
    :visible.sync="showLogin"
    width="480px"
    append-to-body
    @closed="handleCloseLogin"
  >
    <div class="user-login-main">
      <h2 class="user-login-title">登录</h2>
      <ElForm ref="login" :model="formData">
        <ElFormItem
          v-for="(item, key) of formKeys"
          :key="key"
          :prop="key"
          :rules="item.rules"
        >
          <ElInput
            v-model="formData[key]"
            :placeholder="item.hite"
            :type="['passwd'].includes(key) ? 'password' : 'text'"
            :disabled="needResetPass && ['passwd'].includes(key)"
            class="user-login-input"
            @change="fetchUserAccount(key)"
          />
        </ElFormItem>

        <ElFormItem>
          <div class="user-tools">
            <span class="sign-up" @click="handleSignUp">
              新用户注册
            </span>
            <span class="forgot-pass" @click="handleForgotPass">
              忘记密码？
            </span>
          </div>
          <ElButton
            class="login-submit"
            type="primary"
            :loading="userLoading"
            :disabled="loginDisabled"
            @click="handleSubmitLogin"
          >
            登录
          </ElButton>
        </ElFormItem>
      </ElForm>

      <!-- <p class="user-login-divider">
        <span>使用第三方登陆</span>
      </p>
      <div class="user-login-other">
        <span v-for="item of thirdparty" :key="item.id" class="thirdparty-item">
          <i
            class="iconfont"
            :class="[`icon-${item.icon}`, `login-${item.id}`]"
          />
        </span>
      </div> -->

      <PassReset v-if="passResetVisible" :visible.sync="passResetVisible" />
      <SignUp v-if="signUpVisible" :visible.sync="signUpVisible" />
    </div>
  </ElDialog>
</template>

<script>
import { mapActions } from 'vuex'
import { debounce } from 'lodash'

import api from '@/api'
import PassReset from '../password-reset'
import SignUp from '../sign-up'

/*
    account_type 解释
    1 系统账号
    2 微信
    3 QQ
    4 微博 //目前不支持
*/

const DEAFULT_FORM_DATA = () => ({
  account_type: 1,
  account: '', // string 手机号码，手机登录时必传
  passwd: '', // string 登录密码，选择手机密码登录时必传
})

const LOGIN_KEYS = vm => ({
  account: {
    hite: '用户名',
    rules: [
      {
        required: true,
        message: '请输入用户名',
        trigger: 'change',
      },
      {
        min: 1,
        max: 24,
        message: '请输入正确的用户名',
        trigger: 'change',
      },
      {
        validator: (rule, value, callback) => {
          if (vm.needResetPass) {
            callback(new Error('您的账号还没有设置密码，请重置密码后再登录'))
          } else {
            callback()
          }
        },
        trigger: 'change',
      },
    ],
  },
  passwd: {
    hite: '登录密码（6-30位）',
    rules: [
      {
        required: true,
        message: '请输入密码',
        trigger: 'change',
      },
      {
        min: 6,
        max: 30,
        message: '请输入6-8位数密码',
        trigger: 'change',
      },
    ],
  },
})

const THIRDPARTY = [
  { id: 'weixin', icon: 'weixin', appId: '' },
  { id: 'qq', icon: 'qq', appId: '' },
]

export default {
  components: {
    PassReset,
    SignUp,
  },
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showLogin: this.visible,
      userLoading: false,
      formData: DEAFULT_FORM_DATA(),
      passResetVisible: false,
      signUpVisible: false,
      needResetPass: false,
    }
  },
  computed: {
    formKeys() {
      return LOGIN_KEYS(this)
    },
    thirdparty() {
      return THIRDPARTY
    },
    loginDisabled() {
      return !Object.values(this.formData).every(val => val)
    },
  },
  watch: {
    visible(value) {
      this.showLogin = value
    },
  },
  methods: {
    ...mapActions('user', ['SetUserInfo', 'SetLoginType']),
    fetchUserAccount: debounce(function(key) {
      if (key !== 'account') {
        return
      }
      this.$axios
        .post(api.post.user.checkAccount, {
          account: this.formData.account,
        })
        .then(({ code, data }) => {
          if (code === 0) {
            this.needResetPass = Number(data.needPassword) === 1
            this.$refs.login.validateField('account')
          }
        })
    }, 500),
    resetFromFiled() {
      this.needResetPass = false
      this.$refs.login.resetFields()
    },
    handleCloseLogin() {
      this.resetFromFiled()
      this.$emit('update:visible', false)
    },
    handleSignUp() {
      this.signUpVisible = true
      this.resetFromFiled()
      this.$refs.login.resetFields()
    },
    handleForgotPass() {
      this.passResetVisible = true
      this.resetFromFiled()
      this.$refs.login.resetFields()
    },
    showAlert(type, title, content, dosomething) {
      this.$alert(content, title, {
        type: type || 'info',
        confirmButtonText: '确定',
        callback: () => {
          if (dosomething) {
            dosomething()
          }
        },
      })
    },
    handleSubmitLogin() {
      this.userLoading = true
      this.$refs.login.validate(valid => {
        if (!valid) {
          this.userLoading = false
          return
        }

        this.$axios
          .post(api.post.user.login, this.formData)
          .then(({ code, data, msg }) => {
            if (code !== 0) {
              throw new Error(msg || '登录失败，请检查账号密码')
            }
            this.showAlert('success', '温馨提示', '登陆成功')
            localStorage.setItem('tkey', data.user.tkey)
            this.SetUserInfo(data.user)
            this.SetLoginType(true)
            this.handleCloseLogin()
            this.$router.push({
              query: {
                ...this.$route.query,
                _: new Date().getTime(),
              },
            })
          })
          .catch(error => {
            this.$message({
              message: error,
              type: 'error',
            })
          })
          .finally(() => {
            this.userLoading = false
          })
      })
    },
  },
}
</script>

<style lang="scss">
.user-login-dialog {
  cursor: default;
  .user-login-main {
    padding: 0 30px;
  }
  .user-login-title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    padding-bottom: 50px;
  }
  .user-login-input {
    > input {
      line-height: 50px;
      height: 50px;
      border-radius: 8px;
    }
  }
  .user-tools {
    margin: -10px 0 30px;
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 1;
  }
  .sign-up,
  .forgot-pass {
    cursor: pointer;
    font-size: 16px;
    color: gray;
  }
  .sign-up {
    text-align: right;
    color: $color-active;
    &:hover,
    &:active {
      color: $color-hover;
    }
  }
  .login-submit {
    width: 100%;
    border-radius: 8px;
    font-size: 16px;
    height: 50px;
  }
  .user-login-divider {
    margin: 60px 0 36px;
    height: 24px;
    line-height: 24px;
    font-size: 16px;
    text-align: center;
    &::before {
      content: '';
      display: block;
      height: 1px;
      background-color: #ccc;
      margin-bottom: -12px;
    }
    > span {
      padding: 0 20px;
      background-color: #f9f9f9;
      color: #999;
    }
  }
  .user-login-other {
    font-size: 12px;
    color: gray;
    display: flex;
    justify-content: space-evenly;
    .thirdparty-item {
      display: flex;
      width: 45px;
      height: 45px;
      justify-content: center;
      align-items: center;
      background-color: #ccc;
      border-radius: 50%;
      cursor: pointer;
      @include transition-all;
      .iconfont {
        font-size: 18px;
        color: $color-white;
        @include transition-all;
      }
      &:hover {
        background-color: $color-active;
        box-shadow: 0 10px 20px 0 #ccc;
        .iconfont {
          color: $color-white;
        }
      }
    }
  }
}
</style>
