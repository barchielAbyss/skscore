<template>
  <div class="exchange-bbs">
    <Head :msg="formatData(firstInfo)" />

    <div class="section">
      <ListItem
        v-for="(item, index) of expertsList"
        :key="index"
        :list="formatData(item)"
        :class="['section-list-item']"
      />
    </div>
  </div>
</template>

<script>
import xss from 'xss'
import dayjs from 'dayjs'
import ListItem from '@/page-components/exchange/bbs/bbs-list-item'
import Head from '@/page-components/exchange/bbs/top-head'
import api from '@/api/'
import professor from '@/utils/professor'
import storage from '@/utils/storage'

const ROLE = {
  editor: '作者',
  commenter: '评论者',
}

const NUM = 37 // 总数

export default {
  components: {
    Head,
    ListItem,
  },
  async asyncData({ app }) {
    const articleDailyInfo = await Promise.resolve(
      app.$axios
        .get(api.get.article.fetchArticleDailyInfo, {
          params: {
            limit: NUM || 10,
          },
        })
        .then(({ data }) => {
          return data.data
        })
    )

    return { articleDailyInfo }
  },
  computed: {
    firstInfo() {
      return this.articleDailyInfo[0]
    },
    expertsList() {
      return this.articleDailyInfo.filter((_, index) => index)
    },
  },
  mounted() {
    this.fetchExpertMsg()
  },
  methods: {
    fetchExpertMsg() {
      if (!Array.isArray(this.articleDailyInfo)) {
        return
      }

      const temp = this.articleDailyInfo.map(item => {
        return this.formatData(item)
      })

      storage.put(
        'professorArr',
        temp.map(({ uid, count, shoot }) => ({
          uid,
          count,
          shoot,
        }))
      )
    },
    formatData(item) {
      if (!item) {
        return
      }
      let professorArr = []
      if (process.client) {
        professorArr = storage.get('professorArr') || []
      }
      const professorData = professorArr.find(
        ({ uid }) => Number(uid) === Number(item.uid)
      )

      const { avatar, username, nickname, role, uid, tags } = item.author
      const { matchTime, league, homeTeam, awayTeam } = item.match
      const timeObj = dayjs(new Date(matchTime).getTime())

      const userInfo = professorData || {
        count: professor.getNumRandom(3, 7),
        shoot: professor.setShootValueByName(
          item.author.username || item.author.nickname
        ),
      }

      return {
        ...userInfo,
        tags,
        uid,
        type: '免费',
        name: username || nickname,
        profession: ROLE[role],
        head: avatar,
        time: `${timeObj.format('MM/DD HH:mm')}`,
        eventName: league.name,
        teams: homeTeam.name + ' vs ' + awayTeam.name,
        title: xss(item.title),
        imgArr: item.images,
        homeName: homeTeam.name,
        guestName: awayTeam.name,
        homeIcon: homeTeam.icon,
        guestIcon: awayTeam.icon,
        articleId: item._id,
        matchId: item.matchId,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.exchange-bbs {
  .section {
    width: 100%;
    .section-list-item {
      display: inline-block;
      margin-bottom: 11px;
    }

    .section-list-item:nth-of-type(3n-1) {
      margin: 0 11px;
    }
  }
}
</style>
