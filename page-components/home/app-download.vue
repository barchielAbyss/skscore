<template>
  <div class="home-app-download">
    <img
      class="home-app-download__img"
      src="https://w.skscore.com/qrcode/dl?ch=2"
      alt="扫码下载"
      title="扫码下载"
    />
    <div class="home-app-download__into">
      <p>扫一扫下载</p>
      <p>实况比分APP</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-app-download {
  @include card;
  padding: 8px;
  display: flex;
  .home-app-download__img {
    width: 96px;
    height: 96px;
  }
  .home-app-download__into {
    padding-left: 4px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    p {
      padding: 6px 0;
    }
  }
}
</style>
