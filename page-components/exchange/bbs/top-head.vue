<template>
  <div class="bbs-top-head">
    <p class="title">今日赛事推介</p>

    <div class="main-content">
      <!--      <Carousel-->
      <!--        :class="['carousel-part', { 'hidden-visibility': !msg.imgArr }]"-->
      <!--        :list="list"-->
      <!--      />-->

      <div class="test-pic">
        <img src="~/assets/images/experts.jpg" alt="" />
      </div>

      <div class="right-part">
        <PersonInfo :msg="msg" />
        <Bar :value="msg['shoot'] || '0'" class="bar" />

        <h1 class="ctx">
          <NuxtLink
            :to="{
              name: 'exchange-alliance-articles-authorId-articleId',
              params: { articleId: msg.articleId, authorId: msg.uid },
            }"
          >
            {{ msg.title }}
          </NuxtLink>
        </h1>

        <div class="is-pay">
          <p>免费</p>
        </div>

        <div class="bottom-part">
          <div class="event-msg">
            <VIcon name="football" class="list-icon" />
            <span class="event-name">{{ msg.eventName }}</span>
            <span>{{ msg.time }}</span>
          </div>

          <div class="team-msg">
            <span>{{ msg.homeName }}</span>
            <img v-lazy="msg.homeIcon" class="team-title-icon home" />
            <span class="challenge">vs</span>
            <img v-lazy="msg.guestIcon" class="team-title-icon guest" />
            <span>{{ msg.guestName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Carousel from './top-carousel'
import VIcon from '@/components/icon'
import Bar from './red-bar'
import PersonInfo from './person-info'

export default {
  components: { VIcon, Bar, PersonInfo },
  props: {
    msg: { type: Object, default: () => ({}) },
  },
  computed: {
    list() {
      if (!this.msg.imgArr) {
        return []
      } else {
        return this.msg.imgArr
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.bbs-top-head {
  background: $color-white;
  box-shadow: 0 0 4px 0 rgba(51, 51, 51, 0.05);
  border-radius: 8px;
  margin-bottom: 11px;
  width: 972px;
  padding: 10px 14px 14px 14px;
  font-family: $font-family-no-number;

  .title {
    font-size: $font-size-middle;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
  }

  .main-content {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .test-pic {
      width: 394px;
      height: 221px;

      img {
        width: 100%;
        height: 221px;
        border-radius: 4px;
      }
    }

    .right-part {
      width: 564px;
      font-family: $font-family-no-number;
      font-size: $font-size-middle;
      color: #333;
      position: relative;

      .is-pay {
        display: flex;
        justify-content: flex-end;
        margin: 23px 0 12px 0;

        p {
          border: 1px solid #00a54f;
          border-radius: 2px;
          width: 36px;
          height: $font-size-middle;
          line-height: $font-size-middle;
          text-align: center;
          color: #00a54f;
          font-size: $font-size-small;
        }
      }

      .ctx {
        -webkit-line-clamp: 3;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 63px;
        line-height: 21px;
        margin-top: 12px;
        font-weight: bold;

        a:hover {
          color: $color-active;
        }
      }

      .bottom-part {
        display: flex;
        justify-content: space-between;
        background: #f5f5f5;
        border-radius: 4px;
        align-items: center;
        padding: 14px 12px;

        .team-title-icon {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          vertical-align: bottom;
        }

        .event-msg {
          line-height: 22px;
          height: 22px;

          .event-name {
            margin: 0 20px 0 6px;
          }
        }

        .team-msg {
          line-height: 22px;
          height: 22px;

          .challenge {
            margin: 0 10px;
          }

          .home {
            margin-left: 8px;
          }

          .guest {
            margin-right: 8px;
          }
        }
      }

      .bar {
        position: absolute;
        right: -14px;
        top: 0;
      }
    }

    .carousel-part {
      width: 394px;
      border-radius: 4px;
    }

    .hidden-visibility {
      visibility: hidden;
    }
  }
}
</style>
