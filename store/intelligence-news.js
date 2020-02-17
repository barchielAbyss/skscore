import api from '@/api'
export const namespace = true
export const actions = {
  fetchNewsList({ state }, params) {
    return Promise.resolve(
      this.$axios.get(api.get.news.fetchNewsList, params).then(({ data }) => {
        return data
      })
    )
  },
}
