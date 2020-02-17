<template>
  <div class="personal-info">
    <div class="top-part">
      <div class="header-img-wrap">
        <img
          v-lazy="{
            src: userInfo.head,
            error: '/icon/user.png',
          }"
        />
      </div>
      <p class="font-default">{{ userInfo.name || '---' }}</p>
      <p class="font-small">{{ userInfo.profession }}</p>
    </div>

    <div class="middle-part">
      <div class="set-line-start short-box">
        <p class="font-large">足球</p>
        <p class="font-small">擅长类型</p>
      </div>

      <div class="mid-box">
        <p class="font-large">{{ userInfo.shoot || '0' }}%</p>
        <p class="font-small">近3场命中率</p>
      </div>

      <div class="set-line-end short-box">
        <p class="font-large">{{ userInfo.count || '0' }}场</p>
        <p class="font-small">最高连红</p>
      </div>
    </div>

    <div class="bottom-part">个人资料：专家简介</div>
  </div>
</template>
<script>
import professor from '@/utils/professor'
export default {
  props: {
    userInfo: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      mockShoot: professor.getNumRandom(70, 100),
      count: professor.getNumRandom(3, 7),
    }
  },
}
</script>
<style lang="scss" scoped>
.personal-info {
  padding: 14px;
  color: #333;
  font-family: $font-family-no-number;
  margin-bottom: 12px;
  box-shadow: 0 0 4px 0 rgba(51, 51, 51, 0.05);
  background-color: $color-white;
  border-radius: 8px;

  .font-small {
    font-size: $font-size-small;
    /*cursor: pointer;*/
  }

  .font-default {
    font-size: $font-size-middle;
    /*cursor: pointer;*/
    font-weight: bold;
  }

  .font-large {
    font-size: $font-size-large;
    font-weight: bold;
  }

  .bottom-part {
    padding: 20px 0 6px 0;
    border-top: 1px #efefef solid;
    color: #666;
    font-size: $font-size-small;
    line-height: $font-size-small;
  }

  .middle-part {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;

    div {
      text-align: center;
      position: relative;
      box-sizing: border-box;
    }

    .short-box {
      width: 65px;
    }

    .mid-box {
      flex: 1;
    }

    div.set-line-start:after {
      content: '';
      height: 20px;
      border: 0.5px #efefef solid;
      position: absolute;
      top: 50%;
      right: -8px;
      transform: translateY(-50%);
    }

    div.set-line-end:before {
      content: '';
      height: 20px;
      border: 0.5px #efefef solid;
      position: absolute;
      top: 50%;
      left: -8px;
      transform: translateY(-50%);
    }
  }

  .top-part {
    text-align: center;
    /*cursor: pointer;*/

    .header-img-wrap {
      margin: 0 auto;
      width: 60px;
      height: 60px;
      padding: 12px;

      img {
        border-radius: 50%;
      }
    }

    .header-img {
      max-width: 100%;
      border-radius: 50%;
    }
  }
}
</style>
