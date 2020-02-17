<script>
import { mapState } from 'vuex'

export default {
  name: 'Nav',
  props: {
    defaultActive: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState('user', ['routerList']),
  },
  methods: {
    fetchItem(nav) {
      return (
        <nuxt-link
          class={[
            'page-nav-item',
            nav.name,
            this.$route.name === 'index' ? 'is-home' : 'is-other',
          ]}
          to={nav}>
          {nav.title}
        </nuxt-link>
      )
    },
    fetchSubmenu(nav) {
      return (
        <div class="page-nav-submenu">
          {this.fetchItem(nav)}
          <div class="submenu-list">
            {nav.children.map(item => {
              return this.fetchItem(item)
            })}
          </div>
        </div>
      )
    },
    fetchNavList(list) {
      return (list || this.routerList).map(nav => {
        return nav.children ? this.fetchSubmenu(nav) : this.fetchItem(nav)
      })
    },
  },
  render() {
    return (
      <div class="page-nav" mode="horizontal" router>
        {this.fetchNavList()}
        <a
          class="page-nav-item app-down-load"
          href="/download/index.html"
          target="_blank">
          APP下载
        </a>
      </div>
    )
  },
}
</script>

<style lang="scss">
.page-nav {
  display: flex;
  .page-nav-item {
    display: block;
    text-align: center;
  }
  > .page-nav-item,
  .page-nav-submenu > .page-nav-item {
    width: 116px;
    line-height: 60px;
    &.is-other {
      &.index {
        color: $color-font-base;
        background-color: $color-white;
      }
      &:hover {
        color: $color-white;
        background-color: $color-active;
      }
    }
    &.nuxt-link-active {
      color: $color-white;
      background-color: $color-active;
    }
  }
  > .page-nav-item {
    border-right: 1px solid $color-white;
    &:hover {
      color: $color-white;
      background-color: $color-active;
    }
  }

  .page-nav-submenu {
    position: relative;
    z-index: 2001;
    text-align: center;
    border-right: 1px solid $color-white;
    &:hover {
      > a.page-nav-item {
        color: $color-white;
        background-color: $color-active;
      }
      & .submenu-list {
        padding: 0 10px;
        max-height: 100px;
        > a.page-nav-item:hover {
          color: $color-active;
          background-color: $color-white;
        }
      }
    }
  }
  .submenu-list {
    width: 96px;
    box-shadow: 0 2px 6px 0 #dedede;
    background-color: #fff;
    padding: 0 10px;
    border-radius: 4px;
    position: absolute;
    top: 100%;
    max-height: 0;
    z-index: 100;
    overflow: hidden;
    transition: 0.2s ease-in-out;

    .page-nav-item {
      text-align: center;
      line-height: 50px;
      color: #666;
      padding: 0 10px;
      border-bottom: 1px $color-tab-border solid;

      &.page-nav-item:last-of-type {
        border-bottom: none;
      }
    }
  }
}
</style>
