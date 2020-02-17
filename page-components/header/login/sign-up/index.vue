<template>
  <ElDialog
    :visible.sync="showSignUp"
    :before-close="handleClose"
    :close-on-click-modal="false"
    class="sign-up-dialog"
    width="480px"
    append-to-body
  >
    <div class="sign-up-main">
      <h2 class="sign-up-title">注册</h2>
      <ElForm ref="signUp" :model="formData">
        <ElFormItem
          v-for="(item, key) of formKeys"
          :key="key"
          :prop="key"
          :rules="item.rules"
        >
          <ElInput
            v-model="formData[key]"
            :placeholder="item.hite"
            :type="['re_passwd', 'passwd'].includes(key) ? 'password' : 'text'"
            :class="[
              'sign-up-input',
              {
                'is-v-code': ['verify_code'].includes(key),
                disabled: vCodeTime > 0,
              },
            ]"
            @change="fetchUserAccount(key)"
          >
            <a
              v-if="['verify_code'].includes(key)"
              slot="append"
              :class="['v-code-button']"
              @click="handleFetchVCode"
            >
              {{ vCodeTime ? `${vCodeTime}s后重新发送` : '获取验证码' }}
            </a>
          </ElInput>
        </ElFormItem>

        <ElFormItem>
          <ElButton
            class="sign-up-submit"
            type="primary"
            :loading="userLoading"
            :disabled="passResetDisabled"
            @click="handleSubmitSignUp"
          >
            注册
          </ElButton>
        </ElFormItem>
      </ElForm>
    </div>
  </ElDialog>
</template>

<script>
import { debounce } from 'lodash'
import api from '@/api'

const DEAFULT_FORM_DATA = () => ({
  account_type: 1,
  account: '',
  phone: '',
  verify_code: '',
  passwd: '',
  re_passwd: '',
})

const SIGN_UP_KEYS = vm => ({
  account: {
    hite: '用户名',
    rules: [
      {
        required: true,
        message: '请填写用户名',
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
          if (vm.isExists) {
            callback(new Error('用户名已被占用'))
          } else {
            callback()
          }
        },
        trigger: 'change',
      },
    ],
  },
  passwd: {
    hite: '密码(请输入6-30位数密码)',
    rules: [
      {
        required: true,
        message: '请输入密码',
        trigger: 'change',
      },
      {
        min: 6,
        max: 30,
        message: '请输入6-30位数密码',
        trigger: 'change',
      },
    ],
  },
  re_passwd: {
    hite: '确认密码 (请重新输入您的新密码)',
    rules: [
      {
        required: true,
        message: '请再次输入密码',
        trigger: 'change',
      },
      {
        min: 6,
        max: 30,
        message: '长度在 6 到 30 个字符',
        trigger: 'change',
      },
      {
        validator: (rule, value, callback) => {
          if (value !== vm.formData.passwd) {
            callback(new Error('两次输入密码不一致!'))
          } else {
            callback()
          }
        },
        trigger: 'change',
      },
    ],
  },
  phone: {
    hite: '手机号',
    rules: [
      {
        required: true,
        message: '请输入手机号',
        trigger: 'change',
      },
      {
        validator: (rule, value, callback) => {
          if (/^[1]([3-9])[0-9]{9}$/.test(value)) {
            callback()
          } else {
            callback(new Error('请输入正确的手机号'))
          }
        },
        trigger: 'change',
      },
    ],
  },
  verify_code: {
    hite: '输入验证码',
    rules: [
      {
        required: true,
        message: '请输入验证码',
        trigger: 'change',
      },
    ],
  },
})

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      userLoading: false,
      showSignUp: this.visible,
      formData: DEAFULT_FORM_DATA(),
      formKeys: SIGN_UP_KEYS(this),
      vCodeTime: 0,
      isExists: false,
    }
  },
  computed: {
    passResetDisabled() {
      return !Object.values(this.formData).every(val => val)
    },
  },
  watch: {
    visible(value) {
      this.showSignUp = value
    },
  },
  methods: {
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
            this.isExists = Number(data.exists) === 1
            this.$refs.signUp.validateField('account')
          }
        })
    }, 500),
    handleClose(done) {
      this.$emit('update:visible', false)
      done && done()
    },
    handleFetchVCode() {
      this.$refs.signUp.validateField('phone', error => {
        if (this.vCodeTime !== 0 || error) {
          return
        }

        this.$axios
          .get(api.get.user.fetchSmsCode, {
            params: {
              mobile: this.formData.phone,
            },
          })
          .then(({ code, msg }) => {
            if (code !== 0) {
              throw new Error(msg || '验证码获取错误')
            }
            this.$message({
              message: '获取验证码成功，请在手机上查看',
              type: 'success',
            })
          })
          .catch(error => {
            this.showAlert('warning', '温馨提示', error)
          })
          .finally(() => {
            this.vCodeTime = 60
            this.onDiminishingVCodeTime()
          })
      })
    },
    onDiminishingVCodeTime() {
      if (this.vCodeTime === 0) {
        return
      }

      setTimeout(() => {
        this.vCodeTime--
        this.onDiminishingVCodeTime()
      }, 1000)
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
    handleSubmitSignUp() {
      this.userLoading = true
      this.$refs.signUp.validate(valid => {
        if (!valid) {
          this.userLoading = false
          return
        }

        this.$axios
          .post(api.post.user.register, this.formData)
          .then(({ code, msg }) => {
            if (code !== 0) {
              this.formData.verify_code = ''
              throw new Error(msg || '注册失败，请检查网络')
            }
            this.showAlert(
              'success',
              '温馨提示',
              '注册成功，请登录',
              this.handleClose
            )
          })
          .catch(error => {
            this.showAlert('warning', '注册失败', error)
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
.sign-up-dialog {
  cursor: default;
  .sign-up-main {
    padding: 0 30px;
  }
  .sign-up-title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    padding-bottom: 50px;
  }
  .sign-up-input {
    display: flex;
    align-items: center;
    > input {
      font-size: 16px;
      line-height: 50px;
      height: 50px;
      border-radius: 8px;
    }
    .v-code-button {
      width: 110px;
      text-align: center;
      display: inline-block;
    }
    &.is-v-code {
      > .el-input-group__append {
        background-color: $color-white;
        font-size: 16px;
        width: 130px;
        height: 50px;
        line-height: 50px;
        color: $color-active;
        border: 1px solid $color-active;
        border-radius: 8px;
        margin-left: 16px;
        &:hover {
          background-color: #dfebf9;
          color: $color-active;
        }
      }

      &.disabled {
        > .el-input-group__append {
          border-color: #ccc;
          background-color: $color-white;
          color: #999;
        }
      }
    }
  }
  .sign-up-submit {
    width: 100%;
    border-radius: 8px;
    font-size: 16px;
    height: 50px;
  }
}
</style>
