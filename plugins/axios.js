import qs from 'qs'
import CODE from '@/core/code'
import emitter from '@/utils/emitter'

export default function({ $axios, redirect }) {
  // 请求回调
  $axios.onRequest(
    config => {
      if (config.method === 'get') {
      }
      if (config.method === 'post') {
        config.data = qs.stringify(config.data)
      }

      return config
    },
    err => {
      return Promise.reject(err)
    }
  )
  // 返回结果回调
  $axios.onResponse(response => {
    const { data = {} } = response

    const globalErrorCodes = Object.values(CODE).filter(
      code => ![CODE.SUCCESS, CODE.NO_TOKEN].includes(code)
    )

    if (data.code === CODE.NO_TOKEN) {
      emitter.$emit('user.userLogout')
    }

    if (globalErrorCodes.includes(data.code)) {
      emitter.$emit('http.code.exception', data.code)

      return data
    } else {
      return data
    }
  })
  // 错误拦截器
  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/')
    }
  })
}
