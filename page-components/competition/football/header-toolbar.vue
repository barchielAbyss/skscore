<template>
  <div class="competition-score-header-toolbar">
    <div class="toolbar-left toolbar-box">
      <div
        v-for="item of headTypesButton"
        :key="item.name"
        :class="[
          {
            active: headerTypes === item.type,
          },
          'toolbar-box-item',
          'hot-type',
        ]"
        @click="handleChangeHeadTypes(item.type)"
      >
        {{ item.name }}
      </div>

      <EventSelect class="toolbar-icon-box-item" />

      <HandicapSelect class="toolbar-icon-box-item" />

      <div class="hidden-len" @click="onShowAll" v-html="userSelectInto" />
    </div>

    <div class="toolbar-right toolbar-box">
      <ElPopover
        ref="companySelect"
        :visible-arrow="false"
        placement="bottom"
        width="62"
        popper-class="score-header-toolbar-company"
        class="toolbar-box-item company"
      >
        <div slot="reference" class="title">
          <img
            v-show="filter.company === '澳门'"
            src="@/assets/images/company/Macao.png"
            alt=""
          />
          <img
            v-show="filter.company === 'Bet365'"
            src="@/assets/images/company/365.png"
            alt=""
          />
          <img
            v-show="filter.company === '皇冠'"
            src="@/assets/images/company/crown.png"
            alt=""
          />
          <VIcon name="icon_dropdown_selected" />
        </div>
        <ul class="competition-score-header-toolbar-company">
          <li @click="handleChangeCompany('皇冠')">
            <img src="@/assets/images/company/crown.png" alt="" />
          </li>
          <li @click="handleChangeCompany('Bet365')">
            <img src="@/assets/images/company/365.png" alt="" />
          </li>
          <li @click="handleChangeCompany('澳门')">
            <img src="@/assets/images/company/Macao.png" alt="" />
          </li>
        </ul>
      </ElPopover>

      <Setting
        class="toolbar-box-item setting"
        :setting="setting"
        :on-set-setting="onSaveUserSetting"
        :on-change-sound="onChangeSound"
      />
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { mapState, mapActions } from 'vuex'
import VIcon from '@/components/icon'
import EventSelect from './header-toolbar-event'
import HandicapSelect from './header-toolbar-handicap'
import Setting from './header-toolbar-setting'

const HEAD_TYPES_BUTTON = [
  { name: '热门', type: 1 },
  { name: '关注', type: 2 },
  { name: '竞彩', type: 3 },
  { name: '北单', type: 4 },
  { name: '完整', type: 5 },
]

export default {
  components: {
    EventSelect,
    HandicapSelect,
    Setting,
    VIcon,
  },
  props: {
    filter: Object,
    onChangeSound: Function,
    onUpdateRouter: Function,
    onShowAll: Function,
  },
  computed: {
    ...mapState('competition-football', [
      'setting',
      'hiddenList',
      'headerTypes',
    ]),
    ...mapState('user', ['isLogin']),
    headTypesButton: () => HEAD_TYPES_BUTTON,
    userSelectInto() {
      return this.hiddenList.length
        ? `已隐藏 <b>${this.hiddenList.length}</b> 场`
        : ''
    },
  },
  watch: {
    isLogin: {
      immediate: true,
      handler() {
        this.FetchSetting()
      },
    },
  },
  methods: {
    ...mapActions('competition-football', [
      'FetchSetting',
      'SetSetting',
      'SetHeadTypes',
    ]),
    handleChangeHeadTypes: debounce(function(types) {
      this.SetHeadTypes(types)
      if (types === 5) {
        this.onShowAll()
      }
    }),
    handleChangeFilter(filter) {
      this.$emit('update:filter', {
        ...this.filter,
        ...filter,
      })
      this.$nextTick(() => {
        this.onUpdateRouter()
      })
    },
    onSaveUserSetting(setting) {
      this.SetSetting(setting)
    },
    handleChangeCompany(id = '') {
      this.$refs.companySelect.doClose()
      this.handleChangeFilter({ company: id })
    },
  },
}
</script>

<style lang="scss">
.competition-score-header-toolbar {
  display: flex;

  .hidden-len {
    font-size: 12px;
    color: #999;
    line-height: 24px;
  }

  .toolbar-box {
    display: flex;
  }

  .toolbar-box {
    &.toolbar-left .toolbar-box-item {
      width: 50px;
      margin-right: 12px;
    }

    &.toolbar-left .toolbar-icon-box-item {
      width: 62px;
      margin-right: 12px;
    }

    &.toolbar-right .toolbar-box-item {
      width: 62px;
      margin-left: 12px;
    }

    &.toolbar-right .title > img {
      vertical-align: middle;
      margin-bottom: 2px;
      width: 26px;
    }

    &.toolbar-right .icon,
    &.toolbar-left .icon {
      color: #999;
    }

    > .toolbar-box-item,
    > .toolbar-icon-box-item {
      height: 24px;
      cursor: pointer;
      font-size: $font-size-small;
      color: $color-font-base;
      background-color: $color-white;
      text-align: center;
      line-height: 24px;
      border-radius: 2px;
      &:hover {
        color: $color-active;
      }
      &.hot-type {
        cursor: pointer;
        &.active {
          color: $color-white;
          background-color: $color-active;
        }
      }
      .title {
        display: inline-block;
      }
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
  }
  .toolbar-left {
    flex: 1;
  }

  &-company {
    font-size: 14px;
    color: #666666;
    > li {
      cursor: pointer;
      text-align: center;
      line-height: 40px;
      img {
        width: 33px;
        vertical-align: middle;
      }
    }
  }
}
.score-header-toolbar-company {
  min-width: 87px;
  padding: 0;
  overflow: hidden;
  z-index: 50 !important;
}
</style>
