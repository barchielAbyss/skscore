import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

import UiNotification from '@/components/ui-notification'
import infiniteScroll from '@/directives/infinite-scroll'

Vue.directive('body-infinite-scroll', infiniteScroll)
Vue.use(UiNotification)
Vue.use(VueLazyload, {
  error: '/icon/team.png',
  loading: '/icon/team.png',
  attempt: 1,
  throttleWait: 0,
})
