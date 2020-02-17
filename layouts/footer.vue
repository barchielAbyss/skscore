<template>
  <div class="footer-main">
    <div class="footer-link">
      <span>友情链接:</span>
      <a
        v-for="item of arr_link"
        :key="item.name"
        :class="['friendly-link']"
        target="_blank"
        :href="item.link"
        >{{ item.name }}</a
      >
    </div>

    <div class="footer-ctx">
      <a
        target="_blank"
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030502004777"
      >
        粤公网安备 44030502004777号
      </a>
      | 深圳优求网络科技有限公司
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      arr_link: [
        { name: '足球比分', link: 'http://www.tiankongbagua.com' },
        { name: '足球赛事', link: 'http://www.shikuangbifen.com' },
        { name: '篮球比分', link: 'http://www.shikuangbifen.net' },
        { name: '中超比分', link: 'http://www.shikuangbifen.cn' },
        { name: '英超赛事', link: 'http://www.bifenwan.com' },
      ],
    }
  },
}
</script>

<style lang="scss">
.footer-main {
  text-align: center;
  color: #ccc;
  font-size: 12px;

  .friendly-link {
    padding: 0 20px;
    border-right: 1px #ccc solid;

    &:last-of-type {
      border-right: none;
    }
  }

  .footer-link {
    padding: 20px;
    border-bottom: 1px #efefef solid;
  }

  .footer-ctx {
    padding: 30px 0;
  }
}
</style>
