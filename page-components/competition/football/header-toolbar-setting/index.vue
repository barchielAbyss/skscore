<template>
  <ElPopover
    :visible-arrow="false"
    :offset="-133"
    popper-class="competition-setting-popper"
    @after-leave="saveSetting"
  >
    <span slot="reference"><VIcon name="icon_setup" /> 设置 </span>

    <ul class="toolbar-setting">
      <li class="toolbar-setting-item">
        <div class="toolbar-setting-item__label">置顶功能：</div>
        <div class="toolbar-setting-item__main">
          <UiCheckBox
            :checked="Number(localSetting.pinned)"
            @change="
              handleChangeCheckBox({
                type: 'pinned',
                label: Number(localSetting.pinned),
              })
            "
          >
            仅提示置顶赛事弹框
          </UiCheckBox>
        </div>
      </li>

      <li class="toolbar-setting-item">
        <div class="toolbar-setting-item__label">声音选择：</div>
        <div class="toolbar-setting-item__main">
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

      <li class="toolbar-setting-item">
        <div class="toolbar-setting-item__label">弹窗提示：</div>
        <div class="toolbar-setting-item__main">
          <UiCheckBox
            :checked="localSetting.dialog.includes('score')"
            @change="handleChangeCheckBox({ type: 'dialog', label: 'score' })"
            ><p class="check-box-ctx">比分</p></UiCheckBox
          >
          <UiCheckBox
            :checked="localSetting.dialog.includes('red')"
            @change="handleChangeCheckBox({ type: 'dialog', label: 'red' })"
            ><p class="check-box-ctx">红牌</p></UiCheckBox
          >

          <ToolSelect
            v-model="localSetting.dialog_position"
            class="dialog-position"
            :options="dialogPositionOptions"
          />
        </div>
      </li>

      <li class="toolbar-setting-item">
        <div class="toolbar-setting-item__label">赛事显示：</div>
        <div class="toolbar-setting-item__main">
          <UiCheckBox
            :checked="localSetting.event.includes('rank')"
            @change="handleChangeCheckBox({ type: 'event', label: 'rank' })"
            ><p class="check-box-ctx">排名</p></UiCheckBox
          >
          <UiCheckBox
            :checked="localSetting.event.includes('yellow')"
            @change="handleChangeCheckBox({ type: 'event', label: 'yellow' })"
            ><p class="check-box-ctx">黄牌</p></UiCheckBox
          >
          <UiCheckBox
            :checked="localSetting.event.includes('red')"
            @change="handleChangeCheckBox({ type: 'event', label: 'red' })"
            ><p class="check-box-ctx">红牌</p></UiCheckBox
          >
        </div>
      </li>

      <li class="toolbar-setting-item odds-setting">
        <div class="toolbar-setting-item__label">指数设置：</div>
        <div class="toolbar-setting-item__main">
          <UiCheckBox
            :checked="localSetting.exponents.includes('ah')"
            @change="handleChangeCheckBox({ type: 'exponents', label: 'ah' })"
            ><p class="check-box-ctx">亚</p></UiCheckBox
          >
          <UiCheckBox
            :checked="localSetting.exponents.includes('hda')"
            @change="handleChangeCheckBox({ type: 'exponents', label: 'hda' })"
            ><p class="check-box-ctx">欧</p></UiCheckBox
          >
          <UiCheckBox
            :checked="localSetting.exponents.includes('ou')"
            @change="handleChangeCheckBox({ type: 'exponents', label: 'ou' })"
            ><p class="check-box-ctx">大</p></UiCheckBox
          >
        </div>
      </li>

      <li class="toolbar-setting-item lang-setting">
        <div class="toolbar-setting-item__label">语言设置：</div>
        <div class="toolbar-setting-item__main">
          <UiRadio v-model="localSetting.lang" :value="'zh'"
            ><p class="check-box-ctx">中文</p></UiRadio
          >
          <UiRadio v-model="localSetting.lang" :value="'en'"
            ><p class="check-box-ctx">英文</p></UiRadio
          >
        </div>
      </li>
    </ul>
  </ElPopover>
</template>

<script>
import { cloneDeep } from 'lodash'
import VIcon from '@/components/icon'
import UiCheckBox from '@/components/ui-check-box'
import UiRadio from '@/components/ui-radio'
import ToolSelect from './select'

const VIDEO_OPTIONS = [
  { lable: '无声', value: '' },
  { lable: '欢呼1', value: '/sound/football_goal_huanhu.mp3' },
  { lable: '欢呼2', value: '/sound/football_goal_huanhu2.mp3' },
  { lable: '胜利1', value: '/sound/football_goal_win.mp3' },
  { lable: '胜利2', value: '/sound/football_goal_win2.mp3' },
]

const DIALOG_POSITION_OPTIONS = [
  { lable: '上', value: 'top' },
  { lable: '中', value: 'center' },
  { lable: '下', value: 'bottom' },
]

export default {
  components: {
    ToolSelect,
    VIcon,
    UiCheckBox,
    UiRadio,
  },
  props: {
    setting: Object,
    onSetSetting: Function,
    onChangeSound: Function,
  },
  data() {
    return {
      localSetting: {},
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
    handleChangeCheckBox({ type, label }) {
      if (type === 'pinned') {
        this.localSetting[type] = label === 0 ? '1' : '0'
      } else if (this.localSetting[type].includes(label)) {
        this.localSetting[type].splice(
          this.localSetting[type].indexOf(label),
          1
        )
      } else {
        this.localSetting[type].push(label)
      }
    },

    saveSetting() {
      this.onSetSetting(this.localSetting)
    },
  },
}
</script>

<style lang="scss">
.iconfont {
  font-size: 12px;
}

.toolbar-setting {
  &-item {
    display: flex;
    padding: 8px 0;
    align-items: center;
    &__main {
      flex: 1;
      display: flex;
      align-items: center;
      margin-left: 13px;

      .tool-select {
        margin-left: 6px;
      }

      .ui-radio,
      .ui-check-box {
        margin-left: 38px;
      }

      .ui-radio:first-of-type,
      .ui-check-box:first-of-type {
        margin-left: 0;
      }

      .check-box-ctx {
        width: 28px;
      }

      .team-video {
        margin-right: 20px;
      }

      .team-video:last-of-type {
        margin-right: 0;
      }
    }
  }
}
</style>
