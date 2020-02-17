<template>
  <div ref="rr" class="professor-details">
    <div class="public-style left-article">
      <PersonalInfo :user-info="userInfo" />
      <Analysis v-loading="!hotList.length" :list="hotList" />
    </div>

    <div class="lise-section">
      <ListItem
        v-for="(item, index) of normalList"
        :key="index"
        :list="item"
        :styles="style"
        :class="['items-wrap']"
      />
    </div>
  </div>
</template>

<script>
import xss from 'xss'
import dayjs from 'dayjs'
import ListItem from '@/page-components/exchange/components/list-item'
import PersonalInfo from '@/page-components/exchange/professor/personal-info'
import Analysis from '@/page-components/exchange/professor/analysis'
import api from '@/api'
import storage from '@/utils/storage'

const ROLE = {
  editor: '作者',
  commenter: '评论者',
}

export default {
  components: {
    ListItem,
    PersonalInfo,
    Analysis,
  },
  async asyncData({ app, params }) {
    let urlHot = api.get.article.fetchPredictionsUserHot
    let urlNormal = api.get.article.fetchPredictionsUser

    urlHot = urlHot.replace(/\{(.+?)\}/g, params.authorId)
    urlNormal = urlNormal.replace(/\{(.+?)\}/g, params.authorId)

    const [requestDataHot, request1DataNormal] = await Promise.all([
      app.$axios.get(urlHot),
      app.$axios.get(urlNormal),
    ]).then(([res1, res2]) => {
      return [res1.data, res2.data]
    })

    return { requestDataHot, request1DataNormal }
  },
  data() {
    return {
      hotList: [],
      normalList: [],
      userInfo: {},
    }
  },
  computed: {
    style() {
      return {
        width: '329px',
        padding: '12px',
        boxShadow: '0 0 4px 0 rgba(51, 51, 51, 0.05)',
        borderRadius: '8px',
      }
    },
  },
  beforeMount() {
    this.handleAfterRequest(1, this.requestDataHot)
    this.handleAfterRequest(0, this.request1DataNormal)
  },
  methods: {
    handleAfterRequest(isHot, data) {
      const temp = data.data.map(item => {
        return this.formatData(item)
      })
      this.userInfo = temp[0]
      const itemOfLocalArr = storage.get('professorArr') || []
      itemOfLocalArr.forEach(item => {
        if (item.uid === this.userInfo.uid) {
          this.userInfo.shoot = item.shoot
          this.userInfo.count = item.count
        }
      })

      if (isHot) {
        this.hotList = temp.slice(0, 5)
      } else {
        this.normalList = temp
      }
    },

    visiblePostTime(target) {
      const timeObj = dayjs(new Date(target).getTime())
      return `${timeObj.format('YYYY-MM-DD HH:mm:ss')}`
    },

    formatData(item) {
      const { avatar, username, nickname, role, uid, tags } = item.author
      const { matchTime, league, homeTeam, awayTeam } = item.match
      const timeObj = dayjs(new Date(matchTime).getTime())
      return {
        name: username || nickname,
        profession: ROLE[role],
        head: avatar,
        time: `${timeObj.format('MM/DD HH:mm')}`,
        eventName: league.name,
        teams: homeTeam.name + ' vs ' + awayTeam.name,
        title: xss(item.title),
        uid,
        type: '免费',
        tags,
        imgArr: item.images,
        homeName: homeTeam.name,
        guestName: awayTeam.name,
        homeIcon: homeTeam.icon,
        guestIcon: awayTeam.icon,
        articleId: item._id,
        postTime: this.visiblePostTime(item.postTime),
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.professor-details {
  width: 1000px;
  display: flex;
  justify-content: space-between;

  .left-article {
    width: 270px;
  }

  .lise-section {
    width: 718px;
    margin-bottom: 12px;

    .items-wrap {
      display: inline-block;
      margin-bottom: 12px;
    }

    .items-wrap:nth-of-type(odd) {
      margin-right: 12px;
    }
  }
}
</style>
