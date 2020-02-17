<template>
  <NuxtChild class="intelligence" />
</template>

<script>
export default {
  head() {
    return {
      title: '实况比分-情报中心',
    }
  },
  middleware: 'redirect',
}
</script>
