export const strict = process.env.ENV !== 'pro'

export const getters = {
  isLogin: state => state.user.isLogin,
  user: state => state.user.userInfo,
  serverTime: state => state.user.serverTime,
}

export const actions = {}

export const mutations = {}
