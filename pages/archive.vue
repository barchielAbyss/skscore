<template>
  <NuxtChild class="archive" />
</template>

<script>
export default {
  head() {
    return {
      title: '资料库_足球资料库_篮球资料库_球队资料',
      meta: [
        {
          hid: 'keywords',
          name: 'keyword',
          content: '足球资料库,篮球资料库,球队资料库',
        },
        {
          hid: 'description',
          name: 'description',
          content: '实况比分资料库为您提供最新最全的足球、篮球等球队资料信息。',
        },
      ],
    }
  },
  middleware: 'redirect',
}
</script>
