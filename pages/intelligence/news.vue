<template>
  <NuxtChild />
</template>

<script>
export default {
  name: 'News',
  head() {
    return {
      title: '情报中心_足球情报_篮球情报_体育比赛情报',
      meta: [
        {
          hid: 'keywords',
          name: 'keyword',
          content: '足球情报,篮球情报,情报中心',
        },

        {
          hid: 'keywords',
          name: 'keyword',
          content: '实况比分情报中心提供最终最快的足球、篮球比赛情报信息',
        },
      ],
    }
  },
}
</script>

<style scoped></style>
