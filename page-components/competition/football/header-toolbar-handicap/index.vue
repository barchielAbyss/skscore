<template>
  <ElPopover
    ref="main"
    :offset="222"
    width="508"
    :visible-arrow="false"
    popper-class="set-event-popper"
    @after-leave="fetchHandicapList"
  >
    <span slot="reference" class="title">
      盘口 <VIcon name="icon_dropdown_selected" />
    </span>

    <div class="competition-score-toolbar-handicap">
      <ul class="tags-title">
        <li
          v-for="(name, key) of tags"
          :key="key"
          :class="[
            'tags-title-item',
            {
              active: curTagKey === key,
            },
          ]"
          @click="handleChangeTag(key)"
          v-text="name"
        />
      </ul>

      <ul class="handicap-list">
        <li
          v-for="item of handicapList"
          :key="item.value"
          class="handicap-list-item"
        >
          <UiCheckBox v-model="item.checked" @change="handleChangeChecked">
            <div class="checked-label">
              <span class="list-item-label" v-html="item.name" />
              <span class="list-item-sub-label">[{{ item.total }}]</span>
            </div>
          </UiCheckBox>
        </li>
      </ul>

      <div class="handicap-footer">
        <div>
          <div class="radio-wrap">
            <div
              v-for="item of radioGroup"
              :key="item.name"
              :class="['btn-item', { 'color-press': item.active }]"
              @click="handleClickRadio(item)"
              @mousedown="handlePress(1, item)"
              @mouseup="handlePress(0, item)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>

        <div>
          <div class="btn-wrap">
            <div
              v-for="item of btnGroup"
              :key="item.name"
              :class="['btn-item', { 'color-press': item.active }]"
              @click="handleClickBtn(item)"
              @mousedown="handlePress(1, item)"
              @mouseup="handlePress(0, item)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </ElPopover>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import UiCheckBox from '@/components/ui-check-box'
import VIcon from '@/components/icon'

const TAGS = {
  ah: '让球',
  ou: '大小球',
}

const RADIO_GROUP = [
  { name: '全选', value: 'all', active: 0 },
  { name: '全不选', value: 'none', active: 0 },
]

const BTN_GROUP = [
  { name: '取消', active: 0 },
  { name: '确定', active: 0 },
]

export default {
  components: { VIcon, UiCheckBox },
  data() {
    return {
      curTagKey: 'ah',
      handicapList: [],
      checkedAll: '',
      btnGroup: BTN_GROUP,
      radioGroup: RADIO_GROUP,
    }
  },
  computed: {
    ...mapState('competition-football', [
      'scoreAhList',
      'scoreOuList',
      'hiddenList',
    ]),
    tags: () => TAGS,
  },
  watch: {
    scoreAhList: {
      immediate: true,
      handler() {
        this.fetchHandicapList()
      },
    },
    hiddenList() {
      this.fetchHandicapList()
    },
  },
  methods: {
    ...mapActions('competition-football', ['SetHiddenList', 'SetOnlyHot']),
    handleChangeTag(key) {
      if (key === this.curTagKey) {
        return
      }

      this.curTagKey = key
      this.fetchHandicapList()
    },
    fetchHandicapList() {
      const curTagList =
        this.curTagKey === 'ah' ? this.scoreAhList : this.scoreOuList

      this.handicapList = curTagList.map(item => {
        const checked = !item.ids.some(id => this.hiddenList.includes(id))
        return {
          ...item,
          checked,
        }
      })

      this.checkedAll = this.handicapList.every(item => item.checked)
        ? 'all'
        : 'none'
    },
    handleChangeChecked() {
      const allChecked = this.handicapList.every(item => item.checked)
      const allUnChecked = this.handicapList.every(item => !item.checked)
      if (allChecked) {
        this.checkedAll = 'all'
      } else if (allUnChecked) {
        this.checkedAll = 'none'
      } else {
        this.checkedAll = ''
      }
    },
    changeCheckAll(value) {
      this.handicapList.forEach((item, index) => {
        this.$set(this.handicapList, index, {
          ...item,
          checked: value === 'all',
        })
      })
      this.checkedAll = value
    },
    handleChangeFilter() {
      const hiddenListIds = this.handicapList
        .filter(item => !item.checked)
        .map(item => item.ids)
        .flat(1)

      this.SetHiddenList(hiddenListIds)
      this.SetOnlyHot(false)
      this.handleClose()
    },
    handleClose() {
      this.$refs.main.doClose()
    },
    handleClickRadio(item) {
      this.changeCheckAll(item.value)
    },
    handleClickBtn(item) {
      if (item.name === '取消') {
        this.handleClose()
      } else if (item.name === '确定') {
        this.handleChangeFilter()
      }
    },
    handlePress(flag, item) {
      item.active = flag
    },
  },
}
</script>

<style lang="scss" scoped>
.competition-score-toolbar-handicap {
  .tags-title {
    display: flex;
    justify-content: center;

    .tags-title-item {
      background-color: #f9f9f9;
      cursor: pointer;
      width: 70px;
      height: 26px;
      text-align: center;
      line-height: 26px;
      color: $color-active;
      transition: all 0.3s ease-in-out;
      border-radius: 2px;
      &.active {
        box-shadow: 0 0 4px 0 rgba(0, 55, 175, 0.4);
        background-color: $color-active;
        color: $color-white;
      }
    }
  }
  .handicap-list {
    display: flex;
    flex-wrap: wrap;
    color: #666;
    font-family: $font-family-no-number;
    font-size: $font-size-small;
    padding: 0 15px;
    margin-top: 20px;
    max-height: 300px;
    overflow: auto;
    @include scrollbar;

    .ui-check-box {
      min-width: 100px;
      margin-right: 19px;
      margin-bottom: 23px;
    }

    .handicap-list-item:last-of-type .ui-check-box {
      margin-right: 0;
    }
  }
  .handicap-footer {
    height: 50px;
    box-shadow: 0 -2px 6px 0 #f8f8f8;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
