import Vue from 'vue'
import dayjs from 'dayjs'

import api from '@/api'

import {
  footballOngoing,
  footballMatchEnd,
  footballAhYield,
  footballOuYield,
} from '@/utils/status'

import { uniqByKey, exponentialArray2Object } from '@/utils/getOdds2Object'

const DEFAULT_SETTING = () => ({
  pinned: '0',
  video: {
    home: '',
    guest: '',
  },
  dialog: ['score'],
  dialog_position: 'top',
  event: ['rank'],
  exponents: ['ah'], // 'hda', 'ah', 'ou'
  lang: 'zh',
})

export const namespace = true

export const state = () => ({
  scoreLoading: false,
  scoreList: [],
  setting: DEFAULT_SETTING(),
  scoreAhList: [],
  scoreOuList: [],
  scoreEventList: [],
  checkedList: [],
  hiddenList: [],
  pinnedList: [],
  favorList: [],

  /*
   * 1. 热门
   * 2. 关注
   * 3. 竞彩
   * 4. 北单
   * 5. 完整
   * 0. 当前默认展示 */
  headerTypes: 0,
})

export const mutations = {
  SET_SCORE_LOADING(state, type) {
    state.scoreLoading = type
  },
  SET_SCORE_LIST(state, data) {
    state.scoreList = data
  },
  SET_SCORE_LIST_ITEM(state, { index, value }) {
    Vue.set(state.scoreList, index, value)
  },
  SET_SCORE_AH_LIST(state, data) {
    state.scoreAhList = Object.freeze(
      uniqByKey(
        data.map(item => {
          const { ah } = item.exponential
          const itemYield = footballAhYield(ah.l)
          return {
            id: item.id,
            value: ah ? ah.l : '',
            name: itemYield === '-' ? '未开盘' : itemYield,
          }
        })
      )
    )
  },
  SET_SCORE_OU_LIST(state, data) {
    state.scoreOuList = Object.freeze(
      uniqByKey(
        data.map(item => {
          const { ou } = item.exponential
          const itemYield = footballOuYield(ou.t)
          return {
            id: item.id,
            value: ou ? ou.t : '',
            name: itemYield === '-' ? '未开盘' : itemYield,
          }
        })
      )
    )
  },
  SET_SCORE_EVENT_LIST(state, data) {
    state.scoreEventList = Object.freeze(
      uniqByKey(
        data.map(item => ({
          ...item.event,
          id: item.id,
          value: item.event.id,
        }))
      )
    )
  },
  SET_FOOTBALL_SETTING(state, setting) {
    state.setting = setting.lang ? setting : DEFAULT_SETTING()
  },
  SET_HEAD_TYPES(state, value) {
    state.headerTypes = value
  },
  SET_HIDDEN_LIST(state, value) {
    state.hiddenList = value
  },
  SET_FUNCTION_LIST(state, value) {
    if (value.str === 'favor') {
      state.favorList = value.list
    } else if (value.str === 'pinned') {
      state.pinnedList = value.list
    }
  },
  SET_CHECKED_LIST(state, value) {
    state.checkedList = value
  },
}

export const actions = {
  FetchSetting({ commit, rootGetters }) {
    if (!rootGetters.isLogin) {
      const stringSetting = localStorage.getItem('competition-football-setting')
      const setting = stringSetting
        ? JSON.parse(stringSetting)
        : DEFAULT_SETTING()
      commit('SET_FOOTBALL_SETTING', setting)
      return
    }

    this.$axios
      .get(api.get.common.fetchMatchSetting, {
        params: {
          category: 1,
        },
      })
      .then(({ code, data, msg }) => {
        if (code !== 0 || !data) {
          throw new Error(msg || '获取设置失效')
        }

        commit('SET_FOOTBALL_SETTING', data.setting)
      })
      .catch(error => {
        console.warn(error)
      })
  },
  SetSetting({ commit, rootGetters }, setting) {
    if (!setting) {
      setting = DEFAULT_SETTING()
    }

    if (!rootGetters.isLogin) {
      localStorage.setItem(
        'competition-football-setting',
        JSON.stringify(setting)
      )
      commit('SET_FOOTBALL_SETTING', setting)
      return
    }
    this.$axios
      .post(api.post.common.setMatchSetting, {
        setting,
        category: 1,
      })
      .then(({ code, msg }) => {
        if (code !== 0) {
          throw new Error(msg)
        }
        commit('SET_FOOTBALL_SETTING', setting)
      })
      .catch(error => {
        console.warn(error)
      })
  },
  SetHeadTypes({ commit }, value) {
    commit('SET_HEAD_TYPES', value)
  },
  FetchScoreList({ commit, dispatch, rootGetters }, query) {
    commit('SET_SCORE_LOADING', true)
    commit('SET_SCORE_LIST', [])

    if (!rootGetters.isLogin) {
      const pinnedList = JSON.parse(
        localStorage.getItem('competition-football-pinned') || '[]'
      )
      commit({
        type: 'SET_FUNCTION_LIST',
        str: 'pinned',
        list: pinnedList,
      })

      const favorList = JSON.parse(
        localStorage.getItem('competition-football-favor') || '[]'
      )
      commit({
        type: 'SET_FUNCTION_LIST',
        str: 'favor',
        list: favorList,
      })
    }
    const hiddenList = JSON.parse(
      localStorage.getItem('competition-football-hidden') || '[]'
    )
    commit('SET_HIDDEN_LIST', Object.freeze(hiddenList))

    return this.$axios
      .get(api.get.football.fetchMatchList, { params: query })
      .then(({ code, data, msg }) => {
        if (code !== 0 || !data) {
          throw new Error(msg || '获取球队信息失败')
        }

        const ongoingList = []
        const underwayList = []
        const endList = []

        data.matchs.forEach(item => {
          const isOngoing = footballOngoing(item.status)
          const isEnd = footballMatchEnd(item.status)
          const isStart = isOngoing || isEnd

          const itemData = { ...item, isStart }

          if (![15].includes(Number(item.status))) {
            if (isOngoing) {
              ongoingList.push(itemData)
            } else if (isEnd) {
              endList.push(itemData)
            } else {
              underwayList.push(itemData)
            }
          }
        })

        data.matchs = [...ongoingList, ...underwayList, ...endList]

        dispatch('FormatData', data)
      })
      .catch(error => {
        console.warn(error)
      })
      .finally(() => {
        if (!rootGetters.isLogin) {
          commit('SET_SCORE_LOADING', false)
        }
      })
  },
  FetchMatchListState({ dispatch, rootGetters }) {
    if (!rootGetters.isLogin) {
      return
    }
    Promise.all([
      this.$axios.get(api.get.common.fetchBlackList, {
        params: {
          category: 1, // 足球
        },
      }),
      this.$axios.get(api.get.common.fetchMatchTop, {
        params: {
          category: 1, // 足球
        },
      }),
    ])
      .then(([blacklist, matchTop]) => {
        dispatch('SetHiddenList', blacklist.data || [])
        dispatch({
          type: 'SetFunctionList',
          str: 'pinned',
          list: matchTop.data.ids || [],
        })
      })
      .catch()
  },
  FormatData({ commit }, matchData) {
    const { matchs, events, teams } = matchData

    const formated = matchs.map(item => {
      const eventInfo = Object.freeze(events[item.event_id])
      const homeTeam = Object.freeze(teams[item.home_team_id])
      const guestTeam = Object.freeze(teams[item.guest_team_id])
      const { ah, hda, ou, n } = item

      const startTime = item.time
        ? dayjs(Number(item.time)).format('HH:mm')
        : '-'

      return {
        n, // 是否中立场。1是0否
        id: item.id,
        event_id: item.event_id,
        isStart: item.isStart,
        event: eventInfo,
        time: startTime,
        hasTv: !!item.animated, //  || !!item.live_tv 视频直播暂时屏蔽
        status: Object.freeze({
          value: item.status,
          time: Number(item.t_start_time),
        }),
        home: homeTeam,
        ht_score: [0, 1, 13, 15, 17].includes(Number(item.status))
          ? ''
          : `${item.home_goal_b}-${item.guest_goal_b}`,
        score: Object.freeze({
          home: item.home_goal_all,
          guest: item.guest_goal_all,
        }),
        rank: Object.freeze({
          home: item.home_rank,
          guest: item.guest_rank,
        }),
        card: Object.freeze({
          yellow: {
            home: Number(item.home_yellow),
            guest: Number(item.guest_yellow),
          },
          red: {
            home: Number(item.home_red),
            guest: Number(item.guest_red),
          },
        }),
        guest: guestTeam,
        corner: item.isStart
          ? `${item.home_corners}-${item.guest_corners}`
          : '-',
        exponential: Object.freeze(
          exponentialArray2Object({
            ah,
            hda,
            ou,
          })
        ),
        dataCenter: item.id,
        is_hot: Number(item.is_hot) === 1,
      }
    })

    commit('SET_SCORE_LOADING', false)
    commit('SET_SCORE_LIST', formated)
    commit('SET_SCORE_AH_LIST', formated)
    commit('SET_SCORE_OU_LIST', formated)
    commit('SET_SCORE_EVENT_LIST', formated)
  },
  OnChangeScoreList({ commit, state }, { ids = [], newValue }) {
    ids.forEach(id => {
      const itemIndex = state.scoreList.findIndex(
        item => Number(item.id) === Number(id)
      )

      if (~itemIndex) {
        commit('SET_SCORE_LIST_ITEM', {
          index: itemIndex,
          value: {
            ...state.scoreList[itemIndex],
            ...newValue,
          },
        })
      }
    })
  },
  MergeScoreList({ commit, state }, valueList) {
    valueList.forEach(({ mid, key, value }) => {
      const itemIndex = state.scoreList.findIndex(
        item => Number(item.id) === Number(mid)
      )

      if (~itemIndex) {
        const item = state.scoreList[itemIndex]
        commit('SET_SCORE_LIST_ITEM', {
          index: itemIndex,
          value: {
            ...item,
            [key]: {
              ...item[key],
              ...value,
            },
          },
        })
      }
    })
  },
  SetHiddenList({ commit }, value) {
    localStorage.setItem('competition-football-hidden', JSON.stringify(value))
    commit('SET_HIDDEN_LIST', Object.freeze(value))
  },
  SetFunctionList({ commit }, value) {
    localStorage.setItem(
      'competition-football-' + value.str,
      JSON.stringify(value.list)
    )
    commit({
      type: 'SET_FUNCTION_LIST',
      str: value.str,
      list: value.list,
    })
  },
  SetCheckedList({ commit }, value) {
    commit('SET_CHECKED_LIST', Object.freeze(value))
  },
  MoveItem2End({ commit, state }, matchId) {
    const from = state.scoreList.findIndex(
      item => Number(item.id) === Number(matchId)
    )

    if (!~from) {
      return
    }
    const to = state.scoreList.length - 1
    const item = state.scoreList[from]

    for (let i = from; i < to; i++) {
      const next = state.scoreList[i + 1]
      if (next) {
        commit('SET_SCORE_LIST_ITEM', {
          index: i,
          value: next,
        })
      }
    }

    commit('SET_SCORE_LIST_ITEM', {
      index: to,
      value: item,
    })
  },
  MoveItem2OtherStatus({ commit, state }, matchId) {
    let endIndex = state.scoreList.findIndex(item =>
      footballMatchEnd(item.status.value)
    )
    endIndex = ~endIndex ? endIndex : state.scoreList.length

    const from = state.scoreList.findIndex(
      item => Number(item.id) === Number(matchId)
    )

    if (!~from) {
      return
    }
    const to = endIndex - 1
    const item = state.scoreList[from]

    for (let i = from; i < to; i++) {
      const next = state.scoreList[i + 1]
      if (next) {
        commit('SET_SCORE_LIST_ITEM', {
          index: i,
          value: next,
        })
      }
    }
    commit('SET_SCORE_LIST_ITEM', {
      index: to,
      value: item,
    })
  },
}
