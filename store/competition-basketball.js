/**
 * 比赛状态值。
 * 0: 未开始,
 * 1: 第一节,
 * 2: 第一节完,
 * 3: 第二节,
 * 4: 第二节完,
 * 5: 第三节,
 * 6: 第三节完,
 * 7: 第四节,
 * 8: 第四节完,
 * 9: 完场,
 * 10: 加时,
 * 11: 完场(加),
 * 12: 中断,
 * 13: 取消,
 * 14: 延期,
 * 15: 腰斩,
 * 16: 待定
 */
import Vue from 'vue'
import api from '@/api'

import { basketballOngoing, basketballMatchEnd } from '@/utils/status'
import { uniqByKey, exponentialArray2Object } from '@/utils/getOdds2Object'

const DEFAULT_SETTING = () => ({
  pinned: '0',
  video: {
    home: '',
    guest: '',
  },
  dialog_position: 'top',
  lang: 'zh',
})

export const namespace = true

export const state = () => ({
  scoreLoading: false,
  scoreList: [],
  setting: DEFAULT_SETTING(),
  scoreEventList: [],
  checkedList: [],
  hiddenList: [],
  pinnedList: [],
  onlyHot: false,
})

export const mutations = {
  SET_SCORE_LOADING(state, type) {
    state.scoreLoading = type
  },
  SET_BASKETBALL_SETTING(state, setting) {
    state.setting = setting.lang ? setting : DEFAULT_SETTING()
  },
  SET_SCORE_LIST(state, list = []) {
    state.scoreList = list
  },
  SET_SCORE_LIST_ITEM(state, { index, value }) {
    Vue.set(state.scoreList, index, value)
  },
  SET_ONLY_HOT(state, value) {
    state.onlyHot = value
  },
  SET_HIDDEN_LIST(state, value) {
    state.hiddenList = value
  },
  SET_PINNED_LIST(state, value) {
    state.pinnedList = value
  },
  SET_CHECKED_LIST(state, value) {
    state.checkedList = value
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
}

export const actions = {
  FetchSetting({ commit, rootGetters }) {
    if (!rootGetters.isLogin) {
      try {
        const setting = JSON.parse(
          localStorage.getItem('competition-basketball-match-id-setting')
        )
        commit('SET_BASKETBALL_SETTING', setting)
      } catch {
        commit('SET_BASKETBALL_SETTING', DEFAULT_SETTING())
      }
      return
    }

    // TODO

    console.log(this, this.$axios)
    this.$axios
      .get(api.get.common.fetchMatchSetting, {
        params: { category: 2 },
      })
      .then(({ code, data, msg }) => {
        if (code !== 0 || !data) {
          throw new Error(msg || '获取设置失效')
        }

        commit('SET_BASKETBALL_SETTING', data.setting)
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
        'competition-basketball-match-id-setting',
        JSON.stringify(setting)
      )
      commit('SET_BASKETBALL_SETTING', setting)
      return
    }

    // TODO
    console.log(this, this.$axios)

    this.$axios
      .post(api.post.common.setMatchSetting, {
        setting,
        category: 2,
      })
      .then(({ code, msg }) => {
        if (code !== 0) {
          throw new Error(msg)
        }
        commit('SET_BASKETBALL_SETTING', setting)
      })
      .catch(error => {
        console.warn(error)
      })
  },
  FetchScoreList({ commit, rootGetters }, query) {
    if (!rootGetters.isLogin) {
      const pinnedList = JSON.parse(
        localStorage.getItem('competition-basketball-match-id-pinned') || '[]'
      )
      commit('SET_PINNED_LIST', Object.freeze(pinnedList))
    }
    const hiddenList = JSON.parse(
      localStorage.getItem('competition-basketball-match-id-hidden') || '[]'
    )
    commit('SET_HIDDEN_LIST', Object.freeze(hiddenList))

    return this.$axios
      .get(api.get.basketball.fetchMatchList, { params: query })
      .then(({ code, data, msg }) => {
        if (code !== 0 || !data) {
          throw new Error(msg || '获取篮球赛事流失败')
        }

        const underwayList = []
        const otherList = []
        data.matchs.forEach(item => {
          if (!basketballMatchEnd(item.status)) {
            underwayList.push(item)
          } else {
            otherList.push(item)
          }
        })

        data.matchs = [...underwayList, ...otherList]

        const { matchs, events, teams } = data

        const matchList = matchs.map(item => {
          const ItemEvent = events[item.event_id]
          const ItemHost = teams[item.home_team_id]
          const ItemGuest = teams[item.guest_team_id]
          const { ah, hda, ou } = item

          return {
            id: item.id,
            ongoing: basketballOngoing(item.status),
            isEnd: basketballMatchEnd(item.status),
            hasTv: !!item.animated,
            event: ItemEvent,
            host: ItemHost,
            guest: ItemGuest,
            startTime: item.time,
            time: {
              runTime: item.r_time,
              status: item.status,
            },
            rank: {
              home: item.home_rank,
              guest: item.guest_rank,
            },
            score: {
              home: {
                total: Number(item.home_total),
                half: Number(item.home_h),
                first: Number(item.home_first),
                second: Number(item.home_second),
                third: Number(item.home_third),
                fourth: Number(item.home_fourth),
              },
              guest: {
                total: Number(item.guest_total),
                half: Number(item.guest_h),
                first: Number(item.guest_first),
                second: Number(item.guest_second),
                third: Number(item.guest_third),
                fourth: Number(item.guest_fourth),
              },
            },
            exponential: Object.freeze(
              exponentialArray2Object(
                {
                  ah,
                  hda,
                  ou,
                },
                'basketball'
              )
            ),
          }
        })

        commit('SET_SCORE_LIST', matchList)
        commit(
          'SET_SCORE_EVENT_LIST',
          matchList.map(item => ({ id: item.id, event: item.event }))
        )
      })
      .catch(() => {
        commit('SET_SCORE_LIST', [])
      })
  },
  FetchMatchListState({ dispatch, rootGetters }) {
    if (!rootGetters.isLogin) {
      return
    }
    Promise.all([
      this.$axios.get(api.get.common.fetchBlackList, {
        params: {
          category: 2, // 足球
        },
      }),
      this.$axios.get(api.get.common.fetchMatchTop, {
        params: {
          category: 2, // 足球
        },
      }),
    ])
      .then(([blacklist, matchTop]) => {
        dispatch('SetHiddenList', blacklist.data || [])
        dispatch('SetPinnedList', matchTop.data.ids || [])
      })
      .catch()
  },
  SetHiddenList({ commit }, value) {
    localStorage.setItem('competition-basketball-hidden', JSON.stringify(value))
    commit('SET_HIDDEN_LIST', Object.freeze(value))
  },
  SetPinnedList({ commit }, value) {
    localStorage.setItem('competition-basketball-pinned', JSON.stringify(value))
    commit('SET_PINNED_LIST', Object.freeze(value))
  },
  SetCheckedList({ commit }, value) {
    commit('SET_CHECKED_LIST', Object.freeze(value))
  },
  SetOnlyHot({ commit }, value) {
    commit('SET_ONLY_HOT', value)
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
      basketballMatchEnd(item.status.value)
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
