<template>
  <ElDialog
    ref="dialog"
    :visible.sync="showPassReset"
    :before-close="handleClose"
    :close-on-click-modal="false"
    class="password-reset-dialog"
    width="480px"
    append-to-body
  >
    <div class="password-reset-main">
      <h2 class="password-reset-title">忘记密码</h2>
      <ElForm ref="passReset" :model="formData">
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
            :class="[
              'password-reset-input',
              {
                'is-v-code': ['verify_code'].includes(key),
                disabled: vCodeTime > 0,
              },
            ]"
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
            class="password-reset-submit"
            type="primary"
            :loading="userLoading"
            :disabled="passResetDisabled"
            @click="handleSubmitPassReset"
          >
            完成
          </ElButton>
        </ElFormItem>
      </ElForm>
    </div>
  </ElDialog>
</template>

<script>
import api from '@/api'

const DEAFULT_FORM_DATA = () => ({
  phone: '', // string 手机号码，手机登录时必传
  verify_code: '', // number 手机验证，手机登录时必传
  passwd: '', // string 登录密码，选择手机密码登录时必传
})

const PASS_RESET_KEYS = () => ({
  phone: {
    hite: '手机号验证',
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
  passwd: {
    hite: '新密码(请输入6-30位数密码)',
    rules: [
      {
        required: true,
        message: '请输入新密码',
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
      showPassReset: this.visible,
      formData: DEAFULT_FORM_DATA(),
      formKeys: PASS_RESET_KEYS(),
      vCodeTime: 0,
    }
  },
  computed: {
    passResetDisabled() {
      return !Object.values(this.formData).every(val => val)
    },
  },
  watch: {
    visible(value) {
      this.showPassReset = value
    },
  },
  methods: {
    handleClose(done) {
      this.$emit('update:visible', false)
      done && done()
    },
    handleFetchVCode() {
      this.$refs.passReset.validateField('phone', error => {
        if (this.vCodeTime !== 0 || error) {
          return
        }
        this.$axios
          .get(api.get.user.fetchSmsCode, {
            params: {
              mobile: this.formData.phone,
            },
          })
          .then(({ code }) => {
            if (code !== 0) {
              throw new Error('验证码获取错误')
            }
            this.$message({
              message: '获取验证码成功，请在手机上查看',
              type: 'success',
            })
          })
          .catch(error => {
            this.$message({
              message: error,
              type: 'error',
            })
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
    handleSubmitPassReset() {
      this.userLoading = true
      this.$refs.passReset.validate(valid => {
        if (!valid) {
          this.userLoading = false
          return
        }
        this.$axios
          .post(api.post.user.resetPassword, this.formData)
          .then(({ code, msg }) => {
            if (code !== 0) {
              this.formData.verify_code = ''
              throw new Error(msg || '重置密码失败，请检查网络')
            }
            this.$message({
              message: '重置密码成功',
              type: 'success',
            })

            this.handleClose()
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
.password-reset-dialog {
  cursor: default;
  .password-reset-main {
    padding: 0 30px;
  }
  .password-reset-title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    padding-bottom: 50px;
  }
  .password-reset-input {
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
  .password-reset-submit {
    width: 100%;
    border-radius: 8px;
    font-size: 16px;
    height: 50px;
  }
}
</style>
