<template>
  <div class="competition-score-header-toolbar">
    <div class="toolbar-left toolbar-box">
      <span
        class="toolbar-box-item hot-type"
        :class="{
          active: onlyHot,
        }"
        @click="handleChangeHotType"
      >
        热门
      </span>

      <span
        class="toolbar-box-item hot-type"
        :class="{
          active: !onlyHot && !hiddenList.length,
        }"
        @click="handleShowAll"
      >
        完整
      </span>

      <EventSelect class="toolbar-box-item" />

      <span
        class="toolbar-box-item hidden-len"
        @click="onShowAll"
        v-html="userSelectInto"
      />
    </div>

    <div class="toolbar-right toolbar-box">
      <ElPopover
        ref="companySelect"
        :visible-arrow="false"
        placement="bottom"
        width="87"
        popper-class="score-header-toolbar-company"
        class="toolbar-box-item company"
      >
        <span slot="reference" class="title">
          {{ filter.company }} <i class="el-icon-arrow-down" />
        </span>
        <ul class="competition-score-header-toolbar-company">
          <li
            v-for="(id, lable) of companyList"
            :key="id"
            :class="{ active: lable === filter.company }"
            @click="handleChangeCompany(lable)"
            v-text="lable"
          />
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

import EventSelect from './header-toolbar-event'
import Setting from './header-toolbar-setting'

const COMPANY_LIST = {
  金宝博: 7,
  澳门: 1,
  威廉希尔: 2,
  易胜博: 3,
  '12BET': 4,
  皇冠: 5,
  立博: 6,
  '10BET': 8,
}

export default {
  components: {
    EventSelect,
    Setting,
  },
  props: {
    filter: Object,
    onChangeSound: Function,
    onUpdateRouter: Function,
    onShowAll: Function,
  },
  computed: {
    ...mapState('competition-basketball', ['setting', 'hiddenList', 'onlyHot']),
    ...mapState('user', ['isLogin']),
    companyList: () => COMPANY_LIST,
    userSelectInto() {
      return this.hiddenList && this.hiddenList.length
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
    ...mapActions('competition-basketball', [
      'FetchSetting',
      'SetSetting',
      'SetOnlyHot',
    ]),
    handleChangeHotType: debounce(function() {
      this.SetOnlyHot(true)
    }, 350),
    handleShowAll: debounce(function() {
      this.SetOnlyHot(false)
      this.onShowAll()
    }, 350),
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
  border-bottom: 1px solid #f3f4f7;
  .toolbar-box {
    > .toolbar-box-item {
      &:hover {
        color: $color-active;
      }
      &.hot-type {
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
  .hidden-len {
    b {
      font-size: $font-size-small;
      color: #e1243b;
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
      &:hover {
        color: $color-active;
      }
      &.active {
        color: $color-white;
        background: $color-active;
        &:hover {
          color: $color-white;
          background: $color-active;
        }
      }
    }
  }
}
.score-header-toolbar-company {
  min-width: 87px;
  padding: 0;
  overflow: hidden;
}
</style>
