<template>
  <div class="archive-events-all">
    <ElInput
      v-model="filterText"
      placeholder="请输入联赛名"
      class="archive-events-all__search"
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
      :load="loadNode"
      :indent="0"
      :default-expanded-keys="expandedKeys"
      lazy
      empty-text="没有查找到联赛"
      node-key="id"
      accordion
      class="archive-events-all__tree"
      @node-click="handleNodeClick"
    >
      <template v-slot="{ node }">
        <div
          :class="[
            'archive-events-all__tree-node',
            `node-level-${node.level}-title`,
          ]"
        >
          <i
            v-if="node.level === 3"
            :class="[
              'iconfont',
              'icon-point',
              {
                active: Number(node.data.id) === Number(eventId),
              },
            ]"
          />
          <div class="node-into">
            <span
              :class="[
                'name',
                {
                  active:
                    [3].includes(node.level) &&
                    Number(node.data.id) === Number(eventId),
                },
              ]"
            >
              {{
                node.level === 1 &&
                !(~node.label.indexOf('赛事') || node.label === '大洋洲/非洲')
                  ? `${node.label}赛事`
                  : node.label
              }}
            </span>
            <i
              v-if="!node.expanded && node.level === 1"
              class="iconfont icon-arrow arrow-down"
            />
          </div>
        </div>
      </template>
    </Tree>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import Tree from '@/components/tree'

export default {
  components: {
    Tree,
  },
  props: {
    countryList: {
      type: Array,
      default: () => [],
    },
    expandedKeys: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      keymap: {
        children: 'country',
        label: 'name',
        icon: 'icon',
        isLeaf: 'isLeaf',
      },
      filterText: '',
    }
  },
  computed: {
    eventId() {
      return this.$route.params.id
    },
  },
  methods: {
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
            origin_name: item.name,
            name: item.name_js || item.name_s,
            isLeaf: true,
          }))
        )
      }
    },
    onChangeFilterKeyword() {
      this.$refs.tree.filter(this.filterText.trim().toUpperCase())
    },
    onFilterNode(value, data, node) {
      if (!value) {
        return true
      }
      return ~data.name.indexOf(value) && node.level !== 1
    },
    handleNodeClick: debounce(function(data) {
      if (!data.isLeaf) {
        return
      }

      this.$router.replace({
        params: {
          id: data.id,
        },
      })
    }, 300),
  },
}
</script>

<style lang="scss">
.archive-events-all {
  .nuxt-link-active {
    color: $color-active;
  }
  .archive-events-all_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    font-size: 12px;
    > h3 {
      @include card-title;
      margin: 0;
    }
    > .archive-events-all_title--select {
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
  .archive-events-all__search {
    margin-bottom: 8px;
    .el-input__inner {
      background-color: #f9f9f9;
    }
    .el-input__suffix {
      color: #ccc;
    }
  }
  .archive-events-all__tree {
    .tree-node {
      &.is-expanded {
        &.tree-node-level-1 {
          .node-level-1-title {
            background-color: #efefef;
          }
        }

        &.tree-node-level-2 {
          &:last-of-type {
            .node-level-2-title {
              ::after {
                height: calc(100% - 10px);
              }
            }
          }
          .node-level-2-title {
            color: $color-active;
            ::before {
              border-color: $color-active;
            }
          }
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
        @include tiny-scrollbar;
      }
    }
    .tree-node-level-2,
    .tree-node-level-3 {
      > .tree-node-content {
        line-height: 30px;
      }
    }
    .tree-node-level-2 {
      &:last-of-type {
        .node-level-2-title {
          ::after {
            height: 0;
          }
        }
      }
    }
  }
  .archive-events-all__tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 13px;

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
    }
    &.node-level-2-title {
      color: $font-title-color;
      padding-left: 34px;
      position: relative;
      ::before {
        content: '';
        position: absolute;
        left: 11px;
        top: 9px;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        border: 1px solid #efefef;
      }
      ::after {
        content: '';
        position: absolute;
        background: #efefef;
        width: 2px;
        height: calc(100% - 10px);
        left: 15px;
        top: 20px;
      }
    }
    &.node-level-3-title {
      font-size: 13px;
      color: #666;
      padding-left: 46px;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        background: #efefef;
        width: 2px;
        height: 100%;
        padding-bottom: 7px;
        left: 15px;
        top: 0;
      }
      .iconfont {
        position: absolute;
        display: block;
        background-color: #f9f9f9;
        left: 10px;
        top: 6px;
        z-index: 10;
        font-size: 12px;
        line-height: 18px;
        color: #efefef;
        transition: color 0.4s;
      }
      .active {
        color: $color-active;
      }
    }
    .node-into {
      flex: 1;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
