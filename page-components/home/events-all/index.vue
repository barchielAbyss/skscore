<template>
  <div class="home-events-all">
    <div class="home-events-all_title">
      <h3>赛事查询</h3>
      <ul class="home-events-all_title--select">
        <li
          v-for="item of matchType"
          :key="item.value"
          :class="{ active: curType === item.value }"
          @click="handleChangeMatchType(item.value)"
        >
          <span v-text="item.label" />
        </li>
      </ul>
    </div>

    <ElInput
      v-model="filterText"
      placeholder="请输入联赛名称"
      class="home-events-all__search"
      size="small"
      @input="onChangeFilterKeyword"
    >
      <template #suffix>
        <i class="el-input__icon el-icon-search" />
      </template>
    </ElInput>

    <Tree
      ref="tree"
      :data="countryList"
      :keymap="keymap"
      :filter-method="onFilterNode"
      empty-text="没有查找到联赛"
      node-key="id"
      accordion
      class="home-events-all__tree"
      @node-click="handleNodeClick"
    >
      <template #default="{ node, data }">
        <div
          :class="[
            'home-events-all__tree-node',
            `node-level-${node.level}-title`,
          ]"
        >
          <div class="image">
            <i
              v-show="node.level === 1"
              :class="['area-icon', 'iconfont', fetchAreaIcon(data.name)]"
            />
            <img
              v-show="node.level !== 1"
              v-lazy="{
                src: data.icon,
                loading: '/icon/football-event.png',
                error: '/icon/football-event.png',
              }"
            />
          </div>
          <div class="node-into">
            <span class="name">
              {{ node.label }}
            </span>
            <span v-show="data.count" class="count" v-text="data.count" />
          </div>
        </div>
      </template>
    </Tree>
  </div>
</template>

<script>
import Tree from '@/components/tree'

const AREA_ICON_MAPS = {
  欧洲: 'icon-europe',
  美洲: 'icon-americas',
  亚洲: 'icon-asina',
  '大洋洲/非洲': 'icon-africa-oceania',
  其他赛事: 'icon-world',
  澳洲: 'icon-oceania',
  非洲: 'icon-africa',
}

const MATCH_TYPE = [
  {
    value: 1,
    label: '足球',
  },
  {
    value: 2,
    label: '篮球',
  },
]

export default {
  components: {
    Tree,
  },
  props: {
    footballCountryEventList: Array,
    basketballCountryEventList: Array,
  },
  data() {
    return {
      curType: 1,
      keymap: {
        children: 'children',
        label: 'name',
        icon: 'icon',
        isLeaf: 'isLeaf',
      },
      filterText: '',
    }
  },
  computed: {
    matchType: () => MATCH_TYPE,
    countryList() {
      const list =
        this.curType === 1
          ? this.footballCountryEventList
          : this.basketballCountryEventList

      return this.formatCountry(list)
    },
  },
  methods: {
    fetchAreaIcon(key) {
      return AREA_ICON_MAPS[key] || ''
    },
    formatCountry(list = []) {
      return (list || []).map(item => {
        return {
          children: item.country.map(country => {
            return {
              children: country.events.map(event => {
                return {
                  id: event.id,
                  icon: event.icon,
                  name: event.name_js || event.name_s,
                  isLeaf: true,
                }
              }),
              id: country.id,
              icon: country.icon,
              name: country.name,
              count: country.count || country.events.length,
            }
          }),
          id: item.id,
          icon: item.icon,
          name: item.name,
        }
      })
    },
    loadNode({ level, data }, resolve) {
      if (level === 1) {
        return resolve(
          data.country.map(item => ({
            ...item,
            count: Number(item.count) || item.events.length,
          }))
        )
      }
      if (level === 2) {
        resolve(
          (data.events || []).map(item => ({
            ...item,
          }))
        )
      }
    },
    onChangeFilterKeyword() {
      this.$refs.tree &&
        this.$refs.tree.filter(this.filterText.trim().toUpperCase())
    },
    onFilterNode(value, data, node) {
      if (!value) {
        return true
      }
      return data.name.indexOf(value) !== -1 && node.level !== 1
    },
    handleNodeClick(data) {
      if (!data.isLeaf) {
        return
      }

      this.$router.push({
        name:
          this.curType === 1
            ? 'archive-football-id-basic'
            : 'archive-basketball-id-basic',
        params: { id: data.id },
      })
    },

    handleChangeMatchType(type = 1) {
      if (this.curType === type) {
        return
      }
      this.curType = type
    },
  },
}
</script>

<style lang="scss">
.home-events-all {
  @include card;
  position: relative;
  .home-events-all_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    font-size: 12px;
    > h3 {
      @include card-title;
      margin: 0;
    }
    > .home-events-all_title--select {
      display: flex;
      > li {
        cursor: pointer;
        border-right: 1px solid #efefef;
        height: 14px;
        line-height: 14px;
        padding: 0 4px;
        &:last-of-type {
          border: none;
        }
        &.active {
          color: $color-active;
          font-weight: bold;
        }
      }
    }
  }
  .home-events-all__search {
    margin-bottom: 8px;
  }
  .home-events-all__tree {
    .tree-node {
      &.is-expanded {
        > .tree-node-content {
          .home-events-all__tree-node {
            .icon-arrow {
              transform: rotate(-90deg);
            }
          }
        }
        .node-level-1-title {
          background-color: #efefef;
        }
      }
      &.is-current.tree-node-level-3 {
        .node-level-3-title {
          color: $color-active;
        }
      }
    }
    .tree-node-level-1 {
      border-radius: 8px;
      margin-bottom: 4px;
      overflow: hidden;
      > .tree-node-content {
        padding-bottom: 2px;
      }
      > .tree-node-children {
        padding: 8px 12px 8px 0;
        background: #f9f9f9;
      }
    }
    .tree-node-level-2 {
      > .tree-node-content {
        padding: 4px 0;
      }
    }
    .tree-node-level-3 {
      > .tree-node-content {
        padding: 4px 0;
      }
    }
  }
  .home-events-all__tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    cursor: pointer;
    &.node-level-1-title {
      background-color: #f9f9f9;
      color: $font-title-color;
      height: 36px;
      line-height: 36px;
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      padding: 0 24px;
      text-align: center;
      .area-icon {
        color: #ccc;
      }
    }
    &.node-level-2-title {
      font-size: 13px;
      color: $font-title-color;
      .icon-arrow {
        transform: rotate(90deg);
        transition: all 0.3s;
      }
    }
    &.node-level-3-title {
      font-size: 13px;
      color: #666;
      padding-left: 12px;
    }
    .image {
      font-size: 18px;
      width: 18px;
      height: 18px;
      padding-right: 8px;
      text-align: center;
      line-height: 1;
      text-align: center;
      > img {
        max-width: 100%;
        max-height: 15px;
      }
    }
    .node-into {
      flex: 1;
      display: flex;
      justify-content: space-between;
      .count {
        color: #666;
      }
    }
  }
}
</style>
