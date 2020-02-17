<template>
  <ElPopover
    ref="main"
    :visible-arrow="false"
    :offset="300"
    width="660"
    popper-class="set-event-popper"
    @after-leave="fetchEventList"
  >
    <span slot="reference" class="title">
      赛事 <VIcon name="icon_dropdown_selected" />
    </span>

    <div class="competition-score-toolbar-event">
      <div class="list-wrap">
        <div class="event-select-list">
          <div v-for="(enList, letter) of hotGroup.hotArr" :key="letter">
            <div
              v-show="
                letter !== '热门' || (hotGroup.len > 0 && letter === '热门')
              "
              class="items-container"
            >
              <p class="event-select-list-title">{{ letter }}</p>

              <ul>
                <li v-for="item of enList" :key="item.event_id">
                  <UiCheckBox
                    v-model="item.checked"
                    @change="handleChangeChecked"
                  >
                    <div class="checked-label">
                      <span
                        class="team-name text-ellipsis"
                        :title="
                          setting.lang === 'zh'
                            ? item.name_js || item.name
                            : item.name_e || item.name_js || item.name
                        "
                      >
                        {{
                          setting.lang === 'zh'
                            ? item.name_js || item.name
                            : item.name_e || item.name_js || item.name
                        }}
                      </span>
                      <span class="team-total">[{{ item.total }}]</span>
                    </div>
                  </UiCheckBox>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="event-footer">
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
import { pinyinSort } from '@/utils/sort'
import UiCheckBox from '@/components/ui-check-box'
import VIcon from '@/components/icon'

const RADIO_GROUP = [
  { name: '热门', value: 'hot', active: 0 },
  { name: '全选', value: 'all', active: 0 },
  { name: '全不选', value: 'none', active: 0 },
]
const BTN_GROUP = [
  { name: '取消', active: 0 },
  { name: '确定', active: 0 },
]

export default {
  components: {
    UiCheckBox,
    VIcon,
  },
  data() {
    return {
      checkedAll: '',
      eventList: [],
      btnGroup: BTN_GROUP,
      radioGroup: RADIO_GROUP,
    }
  },
  computed: {
    ...mapState('competition-football', [
      'hiddenList',
      'setting',
      'scoreEventList',
    ]),
    enSortEvent() {
      return pinyinSort(
        this.eventList,
        this.setting.lang === 'zh' ? 'name' : 'name_e',
        'name'
      )
    },
    hotGroup() {
      let arr = []
      for (const key in this.enSortEvent) {
        const temp = this.enSortEvent[key].filter(item => item.is_hot)
        arr = [...arr, ...temp]
      }
      return {
        hotArr: { 热门: arr, ...this.enSortEvent },
        len: arr.length,
      }
    },
  },
  watch: {
    scoreEventList: {
      immediate: true,
      handler() {
        this.fetchEventList()
      },
    },
    hiddenList() {
      this.fetchEventList()
    },
  },
  methods: {
    ...mapActions('competition-football', ['SetHiddenList', 'SetHeadTypes']),
    fetchEventList() {
      this.eventList = this.scoreEventList.map(item => ({
        ...item,
        checked: !item.ids.some(id => this.hiddenList.includes(id)),
      }))

      this.checkedAll = this.eventList.every(item => item.checked)
        ? 'all'
        : 'none'
      this.handleChangeChecked()
    },

    // 点击复选框
    handleChangeChecked() {
      const allChecked = this.eventList.every(item => item.checked)
      const allUnChecked = this.eventList.every(item => !item.checked)
      const arrHot = this.eventList.filter(item => item.is_hot)
      const allHot = arrHot.every(item => item.checked)
      if (allChecked) {
        this.checkedAll = 'all'
      } else if (allUnChecked) {
        this.checkedAll = 'none'
      } else if (allHot) {
        this.checkedAll = 'hot'
      } else {
        this.checkedAll = ''
      }
    },

    // 点击单选按钮
    changeCheckAll(value) {
      let temp = null
      this.eventList.forEach((item, index) => {
        if (value === 'all') {
          temp = true
        } else if (value === 'none') {
          temp = false
        } else if (value === 'hot') {
          temp = item.is_hot === 1
        }
        this.$set(this.eventList, index, {
          ...item,
          checked: temp,
        })
      })
      this.checkedAll = value
    },

    // 点击确定
    handleChangeFilter() {
      const hiddenListIds = this.eventList
        .filter(item => !item.checked)
        .map(item => item.ids)
        .flat(1)

      this.SetHiddenList(hiddenListIds)

      this.SetHeadTypes(0)
      this.handleClose()
    },

    // 点击取消
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
.competition-score-toolbar-event {
  .items-container {
    display: flex;
    justify-content: flex-start;
  }

  .list-wrap {
    padding: 0 10px;
  }

  .event-select-list {
    color: #666;
    font-family: $font-family-no-number;
    font-size: $font-size-small;
    max-height: 300px;
    overflow: auto;
    @include scrollbar;
    &-title {
      text-align: center;
      height: 20px;
      min-width: 40px;
      line-height: 20px;
      background-color: #f9f9f9;
      margin-right: 17px;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
    }
    .ui-check-box {
      min-width: 100px;
      margin-right: 37px;
      margin-bottom: 27px;
    }

    .ui-check-box:last-of-type {
      margin-right: 0;
    }
  }
  .event-footer {
    height: 50px;
    box-shadow: 0 -2px 6px 0 #f8f8f8;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
