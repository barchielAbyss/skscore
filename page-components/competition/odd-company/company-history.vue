<template>
  <table class="company-history">
    <thead>
      <tr>
        <th
          v-for="column of columns"
          :key="column.key"
          :style="{
            width: `${column.width}px`,
          }"
          :class="{ 'has-border': column.border }"
          v-text="column.title"
        />
      </tr>
    </thead>

    <tbody>
      <template v-for="(item, index) of historyList">
        <tr v-show="fetchItemShowType(index)" :key="index">
          <td
            v-for="(column, columnIndex) of columns"
            :key="column.key"
            :class="[
              item.valueState ? item.valueState[column.key] : '',
              { 'has-border': column.border },
            ]"
          >
            <template v-if="column.key === 'kelly'">
              <!-- <div class="kelly-box">
                <span v-text="item.wKelly" />
                <span v-text="item.dKelly" />
                <span v-text="item.lKelly" />
              </div> -->
              -
            </template>

            <template v-else-if="column.key === 'basketballKelly'">
              <!-- <div class="kelly-box">
                <span v-text="item.hKelly" />
                <span v-text="item.gKelly" />
              </div> -->
              -
            </template>

            <template v-else>
              <div class="table-item">
                <template v-if="columnIndex === 0">
                  <i v-if="item.imminent" class="imminent" v-text="'临'" />

                  <i
                    v-if="index === historyList.length - 1"
                    class="imminent red-bg"
                    v-text="'初'"
                  />
                </template>

                <span class="table-item-text">
                  {{
                    ~column.key.indexOf('Rate')
                      ? `${item[column.key]}%`
                      : item[column.key]
                  }}
                </span>
              </div>
            </template>
          </td>
        </tr>

        <tr
          v-if="
            needHide && index - 1 === needShowIndex && bottomShowIndex === 10
          "
          :key="`k${index}`"
        >
          <td
            class="limit-btn"
            :colspan="columns.length"
            @click="needHide = false"
          >
            点击展示完整赔率 <i class="iconfont icon-spread" />
          </td>
        </tr>

        <tr
          v-if="
            !needHide &&
              bottomShowIndex === 10 &&
              historyList.length - index === bottomShowIndex
          "
          :key="`k${index}`"
        >
          <td
            class="limit-btn"
            :colspan="columns.length"
            @click="needHide = true"
          >
            点击隐藏赔率 <i class="iconfont icon-spread" />
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    historyList: Array,
    columns: Array,
  },
  data() {
    return {
      needHide: true,
    }
  },
  computed: {
    needShowIndex() {
      const showIndex = this.historyList.filter(item => item.imminent).length
      return showIndex > 10 ? showIndex : 10
    },
    bottomShowIndex() {
      const limit = this.historyList.length - this.needShowIndex
      return limit > 10 ? 10 : limit
    },
  },
  methods: {
    fetchItemShowType(index) {
      if (!this.needHide) {
        return true
      }
      return (
        index < this.needShowIndex ||
        this.historyList.length - index <= this.bottomShowIndex
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.company-history {
  text-align: center;
  thead {
    tr {
      background-color: #f5f5f5;
      line-height: 36px;
      th {
        font-weight: normal;
        color: #666;
      }
      .has-border {
        border-right: 1px solid #fff;
      }
    }
  }
  tbody {
    font-size: 12px;
    tr {
      line-height: 30px;
      &:nth-of-type(even) {
        background-color: #f5f5f5;
      }
      &:nth-of-type(odd) {
        background-color: $color-white;
      }
      .table-item {
        display: inline-block;
        .table-item-text {
          display: inline-block;
          min-width: 3em;
        }
      }
      .imminent {
        margin-left: -17px;
        background-color: #f95d22;
        border-radius: 2px;
        width: 17px;
        height: 17px;
        line-height: 17px;
        transform: scale(0.83);
        display: inline-block;
        text-align: center;
        font-style: normal;
        color: $color-white;
        &.red-bg {
          background-color: #e1243b;
        }
      }
      .limit-btn {
        cursor: pointer;
        background-color: #e7f1fe;
        color: $color-active;
        .iconfont {
          font-size: 14px;
        }
        &:hover {
          color: $color-hover;
        }
      }
      .kelly-box {
        display: flex;
        > span {
          flex: 1;
        }
      }
      .has-border {
        border-right: 1px solid #efefef;
      }
      .red {
        color: #e1243b;
      }
      .green {
        color: #00a54f;
      }
    }
  }
}
</style>
