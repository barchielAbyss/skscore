<template>
  <div class="score-fixed-toolbar">
    <p class="score-fixed-toolbar__item" @click="handleClickShow">
      <i class="iconfont icon-checked" />
      保留
    </p>

    <p class="score-fixed-toolbar__item" @click="handleClickHide">
      <i class="iconfont icon-delete" />
      删除
    </p>

    <p class="score-fixed-toolbar__item" @click="handleClickShowAll">
      <i class="iconfont icon-eye" />
      全部
    </p>
  </div>
</template>

<script>
export default {
  props: {
    onShow: {
      type: Function,
      default: () => {},
    },
    onHide: {
      type: Function,
      default: () => {},
    },
    onShowAll: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    handleClickShow() {
      this.onShow()
    },
    handleClickHide() {
      this.onHide()
    },
    handleClickShowAll() {
      this.onShowAll()
    },
  },
}
</script>

<style lang="scss" scoped>
.score-fixed-toolbar {
  width: 60px;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  position: fixed;
  top: 150px;
  left: 50%;
  transform: translate(-720px, 8px);
  background-color: $color-white;
  border-radius: 8px;
  text-align: center;
  font-size: 12px;
  color: #666;
  &__item {
    cursor: pointer;
    user-select: none;
    &:hover {
      color: $color-active;
      .iconfont {
        color: $color-active;
      }
    }
  }
  .iconfont {
    display: block;
    font-size: 16px;
    color: #d8d8d8;
  }
}
</style>
