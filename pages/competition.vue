<template>
  <NuxtChild class="competition-score" />
</template>

<script>
export default {
  head() {
    return {
      title: '实况比分-实时数据',
    }
  },
  middleware: 'redirect',
}
</script>
