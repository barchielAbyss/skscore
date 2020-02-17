/* eslint-disable nuxt/no-cjs-in-config */
const path = require('path')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')

const envHrefUrl =
  // process.env.NODE_ENV === 'dev'
  //   ? {
  //       API: 'https://prerelease-api.skscore.com:8081',
  //       // API: 'https://w.skscore.com',
  //       NODE_API: 'http://47.112.98.82:9080',
  //     }
  //   :
  {
    API: 'https://w.skscore.com',
    NODE_API: 'http://47.112.98.82:9080',
  }

const fetchHeaderScript = () => {
  switch (process.env.NODE_ENV) {
    case 'pro':
      return [
        {
          src: 'https://hm.baidu.com/hm.js?1acaf4b846962c15df512daf3eea4f4d',
        },
        {
          src: 'https://zz.bdstatic.com/linksubmit/push.js',
        },
      ]
    default:
      return []
  }
}

export default {
  mode: 'universal',
  server: {
    port: process.env.NODE_ENV === 'dev' ? 8000 : 8001, // default: 3000
    host: 'localhost', // default: localhost
  },
  env: {
    ...envHrefUrl,
    ENV: process.env.NODE_ENV,
    SOCKET: 'wss://www.lyscores.com:9507',
    CHART: 'wss://www.lyscores.com:9508',
    QQ_KEY: '',
    WEIXIN_KEY: '',
  },
  /*
   ** Headers of the page
   */
  head: {
    title: '实况比分_足球比分_篮球比分_直播比分_即时比分_比分数据',
    titleTemplate: '%s—实况比分',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'keywords',
        name: 'keyword',
        content: '实况比分,足球比分,比分直播,篮球比分,及时比分,体育比分',
      },
      {
        hid: 'description',
        name: 'description',
        content:
          '实况比分网提供专业体育数据平台体育数据、专业分析、比赛推荐、互动社区 一个都不少的安卓、苹果版APP下载，足球、篮球体育比分 更新更全更快的体育比分数据统计 专业的数据统计。',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: fetchHeaderScript(),
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#409EFF' },
  /*
   ** Global CSS
   */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/font/iconfont.css',
    '@/assets/style/reset.scss',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/axios',
    '@/plugins/element-ui',
    {
      src: '@/plugins/index',
      ssr: false,
    },
    {
      src: '@/plugins/baidu',
      ssr: false,
    },
    {
      src: './assets/font/iconfont.js',
      ssr: false,
    },
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/eslint-module',
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/style-resources',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true,
  },
  proxy: {
    '/api': {
      target: envHrefUrl.API,
      pathRewrite: { '^/api/': '' },
    },
    '/node': {
      target: envHrefUrl.NODE_API,
      pathRewrite: { '^/node/': '' },
    },
  },
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/],
    plugins: [
      new FilterWarningsPlugin({
        exclude: /extract-css-chunks-webpack-plugin[^]*/,
      }),
    ],
    styleResources: {
      scss: ['./assets/style/_variables.scss', './assets/style/mixin.scss'],
    },
    babel: {
      presets: ['@nuxt/babel-preset-app'],
    },
    postcss: {
      // 添加插件名称作为键，参数作为值
      // 使用npm或yarn安装它们
      plugins: {
        // 通过传递 false 来禁用插件
        'postcss-url': {},
      },
      preset: {
        // 更改postcss-preset-env 设置
        autoprefixer: {
          exclude: /\/node_modules\//,
        },
        'postcss-url': {
          exclude: /\/node_modules\//,
        },
      },
    },
    extractCSS: true,

    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx.isClient) {
        // 添加 alias 配置
        Object.assign(config.resolve.alias, {
          '@page': path.join(__dirname, 'page_components'),
        })
      }
    },
  },
}
