<template>
  <ElPopover placement="bottom-end" width="274" @after-leave="saveSetting">
    <span slot="reference"> <i class="iconfont icon-setting" /> 设置 </span>

    <ul class="toolbar-basketball-setting">
      <li class="toolbar-basketball-setting-item">
        <div class="toolbar-basketball-setting-item__label">置顶功能：</div>
        <div class="toolbar-basketball-setting-item__main">
          <ElCheckbox
            v-model="localSetting.pinned"
            true-label="1"
            false-label="0"
            class="m-checkbox"
          >
            仅提示置顶赛事弹框
          </ElCheckbox>
        </div>
      </li>

      <li class="toolbar-basketball-setting-item">
        <div class="toolbar-basketball-setting-item__label">声音选择：</div>
        <div class="toolbar-basketball-setting-item__main">
          <span class="team-video">
            主
            <ToolSelect
              v-model="localSetting.video.home"
              :options="videoOptions"
              @change="onChangeSound"
            />
          </span>
          <span class="team-video">
            客
            <ToolSelect
              v-model="localSetting.video.guest"
              :options="videoOptions"
              @change="onChangeSound"
            />
          </span>
        </div>
      </li>

      <li class="toolbar-basketball-setting-item">
        <div class="toolbar-basketball-setting-item__label">弹窗提示：</div>
        <div class="toolbar-basketball-setting-item__main">
          <ToolSelect
            v-model="localSetting.dialog_position"
            class="dialog-position"
            :options="dialogPositionOptions"
          />
        </div>
      </li>

      <li class="toolbar-basketball-setting-item">
        <div class="toolbar-basketball-setting-item__label">语言设置：</div>
        <div class="toolbar-basketball-setting-item__main">
          <ElRadioGroup v-model="localSetting.lang">
            <ElRadio class="m-checkbox" label="zh">中文</ElRadio>
            <ElRadio class="m-checkbox" label="en">英文</ElRadio>
          </ElRadioGroup>
        </div>
      </li>
    </ul>
  </ElPopover>
</template>

<script>
import { cloneDeep } from 'lodash'
import ToolSelect from './select'

const VIDEO_OPTIONS = [
  { lable: '无声', value: '' },
  { lable: '欢呼1', value: '/sound/football_goal_huanhu.mp3' },
  { lable: '欢呼2', value: '/sound/football_goal_huanhu2.mp3' },
  { lable: '胜利1', value: '/sound/football_goal_win.mp3' },
  { lable: '胜利2', value: '/sound/football_goal_win2.mp3' },
]

const DIALOG_POSITION_OPTIONS = [
  { lable: '正上方', value: 'top' },
  { lable: '中间', value: 'center' },
  { lable: '正下方', value: 'bottom' },
]

export default {
  components: {
    ToolSelect,
  },
  props: {
    setting: Object,
    onSetSetting: Function,
    onChangeSound: Function,
  },
  data() {
    return {
      localSetting: {
        pinned: '0',
        video: {
          home: '',
          guest: '',
        },
        dialog_position: 'top',
        lang: 'zh', // zh, en
      },
    }
  },
  computed: {
    videoOptions: () => VIDEO_OPTIONS,
    dialogPositionOptions: () => DIALOG_POSITION_OPTIONS,
  },
  watch: {
    setting: {
      immediate: true,
      handler() {
        this.localSetting = cloneDeep(this.setting)
      },
    },
  },
  methods: {
    saveSetting() {
      this.onSetSetting(this.localSetting)
    },
  },
}
</script>

<style lang="scss">
.toolbar-basketball-setting {
  &-item {
    display: flex;
    padding: 8px 0;
    align-items: center;
    &__main {
      flex: 1;
      display: flex;
      .tool-select {
        margin: 0 12px 0 6px;
      }
      .v-checkbox {
        min-width: 80px;
      }

      .dialog-position {
        margin-left: 0px;
        .tool-select__selected {
          width: 80px;
        }
      }
      .team-video {
        margin-right: 14px;
      }
    }
  }
}
</style>
