<template>
  <div class="expert-detail">
    <div class="expert-detail-header">
      <h1 class="title" v-text="articleMsg.title" />
      <p class="time" v-text="articleMsg.postTime" />
    </div>

    <div class="expert-detail-content" v-html="articleMsg.ctx" />
  </div>
</template>

<script>
export default {
  props: {
    articleMsg: { type: Object, default: () => ({}) },
  },
}
</script>

<style lang="scss">
.expert-detail-content {
  p {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }

  h3 {
    display: block;
    font-size: 1.17em;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }
}

.expert-detail {
  padding: 20px;
  &-header {
    border-bottom: 1px solid #efefef;
    margin-bottom: 20px;
  }
  .title {
    font-size: 16px;
    padding-bottom: 12px;
  }
  .time {
    font-size: 12px;
    color: #666666;
    padding-bottom: 20px;
  }
  &-content {
    font-size: 14px;
    color: #666666;
    padding-bottom: 12px;
    line-height: 20px;
    text-align: justify;
    /deep/ img {
      margin-bottom: 14px;
    }
  }
}
</style>
