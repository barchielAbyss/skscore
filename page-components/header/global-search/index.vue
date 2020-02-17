<template>
  <transition name="search-fade" mode="out-in">
    <div v-if="visible" class="global-search" @click="handleClose">
      <div class="main-content" @click.stop>
        <div class="global-search__type">
          <span
            v-for="type of types"
            :key="type.id"
            :class="[
              'type-item',
              {
                active: type.id === curId,
              },
            ]"
            v-text="type.name"
          />
        </div>

        <ElAutocomplete
          ref="keyword"
          v-model="keyword"
          class="global-search__keyword"
          :fetch-suggestions="querySearch"
          value-key="name_e"
          placeholder="请输入联赛名称后按回车键（Enter）搜索"
          @select="onSearch"
        >
          <template #suffix>
            <i class="iconfont icon-clean clean" @click="cleanKeyword" />
          </template>

          <template slot-scope="{ item }">
            {{ item.name || item.name_j || item.name }} ({{ item.name_e }})
          </template>
        </ElAutocomplete>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'
const SEARCH_TYPES = [{ id: 0, name: '搜索联赛' }]
const FILTER_KEYS = ['name', 'name_e', 'name_s', 'name_j', 'name_js']

export default {
  props: {
    visible: Boolean,
  },
  data() {
    return {
      curId: 0,
      keyword: '',
      eventList: [],
    }
  },
  computed: {
    types: () => SEARCH_TYPES,
  },
  watch: {
    visible(show) {
      this.cleanKeyword()
      if (show) {
        document.addEventListener('keyup', this.handleEscKey)
      } else {
        document.removeEventListener('keyup', this.handleEscKey)
      }
    },
  },
  mounted() {
    Promise.all([
      this.FetchFootballCountryEventList(),
      this.FetchBasketballCountryEventList(),
    ]).then(([football, basketball]) => {
      this.eventList = this.fetchMatchEvent({
        football,
        basketball,
      })
    })
  },
  methods: {
    ...mapActions('football', {
      FetchFootballCountryEventList: 'FetchCountryEventList',
    }),
    ...mapActions('basketball', {
      FetchBasketballCountryEventList: 'FetchCountryEventList',
    }),
    querySearch(queryString, cb) {
      const res = queryString
        ? this.eventList.filter(item => {
            return FILTER_KEYS.some(
              key =>
                ~(item[key] || '')
                  .toLowerCase()
                  .indexOf(queryString.toLowerCase())
            )
          })
        : this.eventList.filter(item => Number(item.is_hot))
      cb(res)
    },
    fetchMatchEvent({ football, basketball }) {
      const footballFlatten = this.deepFlatten(football, 1)
      const basketballFlatten = this.deepFlatten(basketball, 2)

      return [].concat(footballFlatten, basketballFlatten)
    },
    deepFlatten(list, sportType = 1) {
      if (!list) {
        return
      }
      let res = []
      for (const item of list) {
        if (!item || !item.country) {
          return
        }
        for (const event of item.country) {
          res = res.concat(event.events.map(item => ({ ...item, sportType })))
        }
      }
      return res
    },
    handleEscKey({ keyCode }) {
      if (keyCode === 27) {
        this.handleClose()
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    cleanKeyword() {
      if (this.$refs.keyword) {
        if (this.$refs.keyword.$refs.input) {
          this.$refs.keyword.$refs.input.clear()
        }
      }
    },
    onSearch(item) {
      this.$emit('submit', item)
      this.handleClose()
    },
  },
}
</script>

<style lang="scss" scoped>
.global-search {
  &.search-fade-enter-active,
  &.search-fade-leave-active {
    @include transition-all;
  }
  &.search-fade-enter,
  &.search-fade-leave-to {
    .main-content {
      transform: translate(0px, -100%);
    }
    opacity: 0;
  }
  cursor: default;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  &::after {
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background-color: $font-title-color;
    opacity: 0.8;
  }
  .main-content {
    font-size: 18px;
    position: relative;
    z-index: 1;
    margin-top: 200px;
    @include transition-all;
    .global-search__keyword {
      width: 100%;
      /deep/ input {
        line-height: 60px;
        height: 60px;
        box-sizing: border-box;
        border-radius: 8px;
        font-size: 18px;
        padding-right: 60px;
      }
      .clean {
        cursor: pointer;
        line-height: 60px;
        font-size: 21px;
        margin-right: 20px;
        transition: all 0.4s;
        display: block;
        &:hover {
          color: $color-active;
        }
      }
    }
    .global-search__type {
      display: flex;
      width: 160px;
      line-height: 50px;
      border-radius: 8px;
      overflow: hidden;
      text-align: center;
      margin-bottom: 10px;
      .type-item {
        background-color: $color-white;
        color: $font-title-color;
        flex: 1;
        cursor: pointer;
        &.active {
          color: $color-white;
          background-color: $color-active;
        }
      }
    }
  }
}
</style>
