<template>
  <ElPopover
    ref="main"
    placement="bottom-start"
    width="680"
    @after-leave="fetchEventList"
  >
    <span slot="reference" class="title">
      赛事 <i class="el-icon-arrow-down" />
    </span>

    <div class="competition-score-toolbar-event">
      <div class="event-select-list">
        <div v-for="(enList, letter) of enSortEvent" :key="letter">
          <p class="event-select-list-title">{{ letter }}</p>

          <ul>
            <li
              v-for="item of enList"
              :key="item.event_id"
              class="event-select-list-item"
            >
              <ElCheckbox
                v-model="item.checked"
                class="m-checkbox"
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
              </ElCheckbox>
            </li>
          </ul>
        </div>
      </div>

      <div class="event-footer">
        <div class="select-tool">
          <ElRadio
            v-model="checkedAll"
            class="m-checkbox"
            label="all"
            @change="changeCheckAll"
          >
            全选
          </ElRadio>
          <ElRadio
            v-model="checkedAll"
            class="m-checkbox"
            label="none"
            @change="changeCheckAll"
          >
            全不选
          </ElRadio>
        </div>

        <div class="select-buttons">
          <ElButton type="text" @click="handleClose">取消</ElButton>
          <ElButton type="primary" size="small" @click="handleChangeFilter">
            确认
          </ElButton>
        </div>
      </div>
    </div>
  </ElPopover>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { pinyinSort } from '@/utils/sort'

export default {
  data() {
    return {
      checkedAll: '',
      eventList: [],
    }
  },
  computed: {
    ...mapState('competition-basketball', [
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
    ...mapActions('competition-basketball', ['SetHiddenList', 'SetOnlyHot']),
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
    handleChangeChecked() {
      const allChecked = this.eventList.every(item => item.checked)
      const allUnChecked = this.eventList.every(item => !item.checked)
      if (allChecked) {
        this.checkedAll = 'all'
        return
      }
      if (allUnChecked) {
        this.checkedAll = 'none'
        return
      }
      this.checkedAll = ''
    },
    changeCheckAll(value) {
      this.eventList.forEach((item, index) => {
        this.$set(this.eventList, index, {
          ...item,
          checked: value === 'all',
        })
      })
    },
    handleChangeFilter() {
      const hiddenListIds = this.eventList
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
  },
}
</script>

<style lang="scss" scoped>
.competition-score-toolbar-event {
  .event-select-list {
    max-height: 300px;
    overflow: auto;
    padding-bottom: 12px;
    margin-right: -2px;
    @include scrollbar;
    &-title {
      line-height: 20px;
      font-size: 14px;
      color: #666;
      background-color: #f5f5f5;
      padding-left: 8px;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 16px;
    }
    &-item {
      width: 20%;
      box-sizing: border-box;
      padding-right: 32px;
      padding-top: 16px;
      .checked-label {
        display: flex;
        align-items: center;
      }
      .team-name {
        display: block;
        font-size: 14px;
        color: #666;
        padding-right: 4px;
        max-width: 8em;
        overflow: hidden;
      }
      .team-total {
        font-size: 12px;
        color: #999;
      }
    }
  }
  .event-footer {
    margin: 0 -12px -12px;
    padding: 11px 12px;
    box-shadow: 0 -2px 6px 0 #f8f8f8;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
