<template>
  <div class="person-info">
    <div class="head-img">
      <NuxtLink
        :to="{
          name: 'exchange-alliance-professor-authorId',
          params: { authorId: msg.uid },
        }"
      >
        <img
          v-lazy="{
            src: msg.head,
            error: '/icon/user.png',
          }"
        />
      </NuxtLink>
    </div>

    <div class="msg-details">
      <div class="top">
        <span>{{ msg.name }}</span>
        <span>{{ msg.profession }}</span>
      </div>

      <div class="bottom">
        <p>{{ msg.tags ? msg.tags[0] : '' }}</p>
        <p>{{ msg.tags ? msg.tags[1] : '' }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    msg: { type: Object, default: () => ({}) },
  },
}
</script>

<style lang="scss" scoped>
.person-info {
  display: flex;
  padding-right: 48px;
  justify-content: flex-start;
  font-family: $font-family-no-number;

  .head-img {
    cursor: pointer;
    border-radius: 50%;
    margin-right: 8px;
    width: 42px;
    height: 42px;
    overflow: hidden;

    img {
      max-width: 42px;
    }
  }

  .msg-details {
    flex: 1;
    height: 42px;
    position: relative;

    div {
      position: absolute;
      left: 0;
    }

    .top {
      top: 0;

      span:nth-of-type(1) {
        color: #333;
        font-size: $font-size-middle;
      }

      span:nth-of-type(2) {
        font-size: $font-size-small;
        color: #666;
        margin-left: 8px;
      }
    }

    .bottom {
      bottom: 0;
      font-size: $font-size-small;
      display: flex;
      justify-content: flex-start;

      p {
        text-align: center;
        height: 20px;
        line-height: 20px;
        overflow: hidden;
        border-radius: 10px;
        font-size: $font-size-small;
        padding: 0 10px;
      }

      p:nth-of-type(1) {
        color: #fa6400;
        background: rgba(250, 100, 0, 0.2);
      }

      p:nth-of-type(2) {
        margin-left: 6px;
        background: rgba(225, 36, 59, 0.2);
        color: #e1243b;
      }
    }
  }
}
</style>
