import api from '@/api'

const CONTINENT_EVENT_IDS = [
  { id: 1103, uid: 3, name: '美洲' },
  { id: 1104, uid: 4, name: '亚洲' },
  { id: 1105, uid: 5, name: '欧洲' },
  { id: 1106, uid: 6, name: '澳洲' },
  { id: 1107, uid: 7, name: '非洲' },
  { id: 1102, uid: 2, name: '其他赛事' },
]

export const namespace = true

export const state = () => ({
  countryEventList: null,
})

export const mutations = {
  SET_COUNTRY_EVENT_LIST(state, list = []) {
    state.countryEventList = list
  },
}

export const actions = {
  SetCountryEventList({ commit }, list) {
    commit('SET_COUNTRY_EVENT_LIST', Object.freeze(list))
  },
  FetchCountryEventList({ state, dispatch }) {
    if (state.countryEventList) {
      return Promise.resolve(state.countryEventList)
    }

    return Promise.resolve(
      this.$axios
        .get(api.get.basketball.fetchCountryEventList)
        .then(({ data }) => {
          const formatData = CONTINENT_EVENT_IDS.map(item => {
            const itemData = data.find(({ id }) => Number(id) === item.uid)
            return {
              ...item,
              country: itemData.countries.map(item => ({
                ...item,
                id: Number(`100${item.id}`),
              })),
            }
          })

          dispatch('SetCountryEventList', formatData)
          return formatData
        })
    )
  },
}
