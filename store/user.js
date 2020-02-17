export const namespace = true

const ROUTER_MAP = [
  { path: '/', name: 'index', title: '首页' },
  {
    path: '/competition',
    name: 'competition',
    title: '即时比分',
    redirect: '/competition/football',
    children: [
      {
        path: '/competition/football',
        name: 'competition-football',
        title: '足球比分',
      },
      {
        path: '/competition/basketball',
        name: 'competition-basketball',
        title: '篮球比分',
      },
    ],
  },
  {
    path: '/intelligence',
    name: 'intelligence',
    title: '资讯',
    children: [
      {
        path: '/intelligence/news/main/1',
        name: 'intelligence-news-main-id',
        params: { id: 1 },
        title: '时事新闻',
      },
    ],
  },
  {
    path: '/archive',
    name: 'archive',
    title: '资料库',
    redirect: '/archive/previous/football',
    children: [
      {
        path: '/archive/previous/football',
        name: 'archive-previous-type',
        params: { type: 'football' },
        title: '往期球赛',
      },
    ],
  },
  {
    path: '/exchange',
    name: 'exchange',
    title: '推介',
    redirect: '/exchange/alliance/bbs',
    children: [
      {
        path: '/exchange/alliance/bbs',
        name: 'exchange-alliance-bbs',
        title: '爱好者同盟',
      },
    ],
  },
]

export const state = () => ({
  userInfo: null,
  isLogin: false,
  routerList: ROUTER_MAP,
  serverTime: '',
})

export const mutations = {
  SET_LOGIN_TYPE(state, type) {
    state.isLogin = type
  },
  SET_USER_INFO(state, user) {
    if (!user) {
      return
    }
    state.userInfo = user
  },
  SET_SERVER_TIME(state, time) {
    state.serverTime = time
  },
}

export const actions = {
  UserLogout({ commit }) {
    commit('SET_LOGIN_TYPE', false)
    commit('SET_USER_INFO', null)
    setTimeout(() => {
      location.reload()
    }, 3000)
  },
  SetLoginType({ commit }, type) {
    commit('SET_LOGIN_TYPE', type)
  },
  SetUserInfo({ commit }, data) {
    commit('SET_USER_INFO', data)
  },
  SetServerTime({ commit }, time) {
    commit('SET_SERVER_TIME', time)
  },
}
