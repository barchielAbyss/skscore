<template>
  <div class="expert-info">
    <div class="expert-info-user">
      <div class="user-icon">
        <NuxtLink
          :to="{
            name: 'exchange-alliance-professor-authorId',
            params: { authorId },
          }"
          ><img
            v-lazy="{
              src: userInfo.head,
              error: '/icon/user.png',
            }"
        /></NuxtLink>
      </div>
      <p class="user-name">{{ userInfo.name || '-' }}</p>
      <p class="user-title">{{ authorMsg.profession }}</p>
      <div class="user-contribute">
        <p class="contribute-item"><b class="blod">足球</b> 擅长类型</p>
        <p class="contribute-item">
          <b class="blod">{{ authorMsg.shoot || 0 }}%</b> 近3场命中率
        </p>
      </div>
    </div>

    <ul v-loading="!list.length" class="expert-info-hot">
      <li
        v-for="(item, index) in list"
        :key="index"
        :class="[
          'hot-item',
          { 'item-active': articleId === item['articleId'] },
        ]"
      >
        <NuxtLink
          :to="{
            name: 'exchange-alliance-articles-authorId-articleId',
            params: { articleId: item.articleId, authorId },
          }"
        >
          <p class="hot-title">
            {{ item.title | trimFilter }}
          </p>
          <p class="hot-time">
            {{ item.postTime }}
          </p>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script>
import xss from 'xss'
import dayjs from 'dayjs'
import storage from '@/utils/storage'

const ROLE = {
  editor: '作者',
  commenter: '评论者',
}

export default {
  filters: {
    trimFilter(value) {
      const original = value.match(/\((.+?)\)/g)
      const temp = value.split('(')[0].replace(/\s/g, '')
      return temp + original
    },
  },
  props: {
    authorData: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      userInfo: {},
      list: [],
      authorMsg: { profession: '', name: '', shoot: '', count: '' },
    }
  },
  computed: {
    articleId() {
      return this.$route.params.articleId
    },
    authorId() {
      return this.$route.params.authorId
    },
  },
  watch: {
    authorData: {
      immediate: true,
      handler: function(value) {
        const temp = value.data.map(item => {
          return this.formatData(item)
        })
        this.userInfo = temp[0]
        this.list = temp.slice(0, 7)
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.instance()
    })
  },
  methods: {
    visiblePostTime(target) {
      const timeObj = dayjs(new Date(target).getTime())
      return `${timeObj.format('YYYY-MM-DD')}`
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

    instance() {
      const itemOfLocalArr = storage.get('professorArr') || []

      itemOfLocalArr.forEach(item => {
        if (item.uid === this.userInfo.uid) {
          this.authorMsg.shoot = item.shoot
          this.authorMsg.count = item.count
          Object.freeze(this.authorMsg)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.expert-info {
  padding: 20px 14px;

  &-user {
    text-align: center;
    .user-icon {
      cursor: pointer;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      > img {
        max-width: fit-content;
        max-height: 100%;
      }
    }
    .user-name {
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 2px;
    }
    .user-title {
      font-size: 12px;
      margin-bottom: 20px;
    }
    .user-contribute {
      display: flex;
      padding-bottom: 20px;
      .contribute-item {
        flex: 1;
        position: relative;
        font-size: 12px;
        color: #666;
        &:first-of-type {
          &::after {
            content: '';
            display: block;
            width: 1px;
            height: 20px;
            position: absolute;
            top: 14px;
            right: 0;
            background-color: #efefef;
          }
        }
        .blod {
          display: block;
          color: #333;
          font-size: 16px;
        }
      }
    }
  }
  &-hot {
    .hot-item {
      padding: 12px 0;
      border-top: 1px solid #efefef;
      text-align: justify;

      &:hover {
        color: $color-active;
        cursor: pointer;
      }

      &.item-active {
        color: $color-active;
      }
    }
    .hot-title {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-bottom: 3px;
      line-height: 20px;
    }
    .hot-time {
      font-size: 12px;
      line-height: 17px;
      color: #666;
    }
  }
}
</style>
