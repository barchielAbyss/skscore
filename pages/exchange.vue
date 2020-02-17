<template>
  <NuxtChild class="exchange" />
</template>

<script>
export default {
  head() {
    return {
      title: '赛事推荐_足球爱好者同盟_足球比赛_篮球比赛',
      meta: [
        {
          hid: 'keywords',
          name: 'keyword',
          content: '赛事推荐,足球比赛,篮球比赛',
        },
        {
          hid: 'description',
          name: 'description',
          content:
            '实况比分赛事推荐为广大足球、篮球爱好者们提供球友交流平台，分享相关球赛信息',
        },
      ],
    }
  },
  middleware: 'redirect',
}
</script>
