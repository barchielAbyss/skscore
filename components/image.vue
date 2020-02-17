<template>
  <img :src="loaded ? imgSrc : errorSrc" @error="onError" />
</template>

<script>
export default {
  props: {
    src: String,
    errorSrc: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loaded: false,
      imgSrc: '',
    }
  },
  watch: {
    src(value) {
      this.fetchImage(value)
    },
  },
  mounted() {
    this.fetchImage(this.src)
  },
  methods: {
    fetchImage(value) {
      if (!value) {
        return
      }
      this.imgSrc = value
      const $IMG = document.createElement('img')
      $IMG.src = value
      $IMG.onload = () => {
        this.loaded = true
      }
    },
    onError() {
      this.imgSrc = this.errorSrc
    },
  },
}
</script>
