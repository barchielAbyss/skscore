<template>
  <div
    v-show="node.visible"
    ref="node"
    :class="[
      `tree-node-level-${node.level}`,
      {
        'is-expanded': expanded,
        'is-current': tree.store.currentNode === node,
        'is-hidden': !node.visible,
        'is-focusable': !node.disabled,
        'is-checked': !node.disabled && node.checked,
      },
    ]"
    :aria-expanded="expanded"
    :aria-disabled="node.disabled"
    :aria-checked="node.checked"
    :draggable="tree.draggable"
    role="treeitem"
    tabindex="-1"
    class="tree-node"
    @click.stop="handleClick"
    @dragstart.stop="handleDragStart"
    @dragover.stop="handleDragOver"
    @dragend.stop="handleDragEnd"
    @drop.stop="handleDrop"
    @contextmenu="handleContextMenu($event)"
  >
    <div
      :style="{ 'padding-left': (node.level - 1) * tree.indent + 'px' }"
      class="tree-node-content"
    >
      <ElCheckbox
        v-if="showCheckbox"
        :checked="node.checked"
        :indeterminate="node.indeterminate"
        :disabled="!!node.disabled"
        @click.native.stop
        @change="handleCheckChange"
      />
      <span
        v-if="node.loading"
        class="tree-node-loading el-tree-node__loading-icon el-icon-loading"
      />

      <span class="tree-node-label-wrap">
        <NodeContent :node="node" />
      </span>
    </div>
    <CollapseTransition>
      <div
        v-if="!renderAfterExpand || childNodeRendered"
        v-show="expanded"
        :aria-expanded="expanded"
        class="tree-node-children"
        role="group"
      >
        <TreeNode
          v-for="child in node.childNodes"
          :key="getNodeKey(child)"
          :render-content="renderContent"
          :render-after-expand="renderAfterExpand"
          :node="child"
          @node-expand="handleChildNodeExpand"
        />
      </div>
    </CollapseTransition>
  </div>
</template>

<script>
import CollapseTransition from '@/components/collapse-transition'
import { getNodeKey } from './model/util'

export default {
  name: 'TreeNode',

  componentName: 'UiTreeNode',

  components: {
    CollapseTransition,
    NodeContent: {
      props: {
        node: {
          required: true,
        },
      },
      render(h) {
        const parent = this.$parent
        const tree = parent.tree
        const node = this.node
        const { data, store } = node
        return parent.renderContent ? (
          parent.renderContent.call(parent._renderProxy, h, {
            _self: tree.$vnode.context,
            node,
            data,
            store,
          })
        ) : tree.$scopedSlots.default ? (
          tree.$scopedSlots.default({ node, data })
        ) : (
          <span class="tree-node-label">{node.label}</span>
        )
      },
    },
  },

  props: {
    node: {
      type: null,
      default() {
        return {}
      },
    },
    keymap: {
      type: null,
    },
    renderContent: Function,
    renderAfterExpand: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      tree: null,
      expanded: false,
      childNodeRendered: false,
      showCheckbox: false,
      oldChecked: null,
      oldIndeterminate: null,
    }
  },

  watch: {
    'node.indeterminate'(val) {
      this.handleSelectChange(this.node.checked, val)
    },

    'node.checked'(val) {
      this.handleSelectChange(val, this.node.indeterminate)
    },

    'node.expanded'(val) {
      this.$nextTick(() => (this.expanded = val))
      if (val) {
        this.childNodeRendered = true
      }
    },
  },

  created() {
    const parent = this.$parent

    if (parent.isTree) {
      this.tree = parent
    } else {
      this.tree = parent.tree
    }

    const tree = this.tree
    if (!tree) {
      console.warn("Can not find node's tree.")
    }

    const keymap = tree.keymap || {}
    const childrenKey = keymap.children || 'children'

    this.$watch(`node.data.${childrenKey}`, () => {
      this.node.updateChildren()
    })

    this.showCheckbox = tree.showCheckbox

    if (this.node.expanded) {
      this.expanded = true
      this.childNodeRendered = true
    }

    if (this.tree.accordion) {
      this.$on('tree-node-expand', node => {
        if (this.node !== node) {
          this.node.collapse()
        }
      })
    }
  },

  methods: {
    getNodeKey(node) {
      return getNodeKey(this.tree.nodeKey, node.data)
    },

    handleSelectChange(checked, indeterminate) {
      if (
        this.oldChecked !== checked &&
        this.oldIndeterminate !== indeterminate
      ) {
        this.tree.$emit('check-change', this.node.data, checked, indeterminate)
      }
      this.oldChecked = checked
      this.indeterminate = indeterminate
    },

    handleClick() {
      const store = this.tree.store
      store.setCurrentNode(this.node)
      this.tree.$emit(
        'current-change',
        store.currentNode ? store.currentNode.data : null,
        store.currentNode
      )
      this.tree.currentNode = this
      if (this.tree.expandOnClickNode) {
        this.handleExpandIconClick()
      }

      if (this.tree.checkOnClickNode && !this.node.disabled) {
        this.handleCheckChange({
          target: { checked: !this.node.checked },
        })
      }

      this.tree.$emit('node-click', this.node.data, this.node, this)
    },

    handleContextMenu(event) {
      if (
        this.tree._events['node-contextmenu'] &&
        this.tree._events['node-contextmenu'].length > 0
      ) {
        event.stopPropagation()
        event.preventDefault()
      }
      this.tree.$emit(
        'node-contextmenu',
        event,
        this.node.data,
        this.node,
        this
      )
    },

    handleExpandIconClick() {
      if (this.node.isLeaf) {
        return
      }
      if (this.expanded) {
        this.tree.$emit('node-collapse', this.node.data, this.node, this)
        this.node.collapse()
      } else {
        this.node.expand()
        this.$emit('node-expand', this.node.data, this.node, this)
      }
    },

    handleCheckChange(event) {
      const store = this.tree.store

      const beforeChecked = {
        beforeCheckedNodes: store.getCheckedNodes(),
        beforeCheckedKeys: store.getCheckedKeys(),
        beforeHalfCheckedNodes: store.getHalfCheckedNodes(),
        beforeHalfCheckedKeys: store.getHalfCheckedKeys(),
      }

      if (this.tree.multiple || this.showCheckbox) {
        this.node.setChecked(event.target.checked, !this.tree.checkStrictly)
      } else {
        this.tree.store.setCheckedNodes([this.node.data])
      }

      this.$nextTick(() => {
        this.tree.$emit('check', this.node, {
          ...beforeChecked,
          checkedNodes: store.getCheckedNodes(),
          checkedKeys: store.getCheckedKeys(),
          halfCheckedNodes: store.getHalfCheckedNodes(),
          halfCheckedKeys: store.getHalfCheckedKeys(),
        })
      })
    },

    handleChildNodeExpand(nodeData, node, instance) {
      if (this.tree.accordion) {
        this.node.childNodes.forEach(childNode => {
          if (node !== childNode) {
            childNode.collapse()
          }
        })
      }

      this.tree.$emit('node-expand', nodeData, node, instance)
    },

    handleDragStart(event) {
      if (!this.tree.draggable) {
        return
      }
      this.tree.$emit('tree-node-drag-start', event, this)
    },

    handleDragOver(event) {
      if (!this.tree.draggable) {
        return
      }
      this.tree.$emit('tree-node-drag-over', event, this)
      event.preventDefault()
    },

    handleDrop(event) {
      event.preventDefault()
    },

    handleDragEnd(event) {
      if (!this.tree.draggable) {
        return
      }
      this.tree.$emit('tree-node-drag-end', event, this)
    },
  },
}
</script>

<style lang="scss">
.tree-node-content {
  display: flex;
  align-items: center;
  cursor: pointer;
  .tree-node-label-wrap {
    flex: 1;
  }
  .tree-node-loading {
    margin-left: -22px;
  }
}
</style>
