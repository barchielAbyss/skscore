<template>
  <div ref="mainSection" class="main-section card">
    <div v-if="list.length">
      <div class="news-list">
        <ul>
          <li v-for="item of list" :key="item.id" class="list-item">
            <NuxtLink
              :to="{
                name: 'intelligence-news-detail-id',
                params: {
                  id: item.id,
                },
              }"
            >
              <div class="top-part">
                <p
                  :class="[
                    'type-label',
                    item.tag === '足球' ? 'color-blue' : 'color-red',
                  ]"
                >
                  {{ item.tag }}
                </p>
                <h1 class="news-title">{{ item.title }}</h1>
                <p class="time-box">
                  {{ item.create_time | formatDataTime }}
                </p>
              </div>

              <div class="set-ctx">{{ item.content }}</div>
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div class="placeholder-pagination" />

      <ElPagination
        class="pagination-style"
        background
        :current-page="curPage"
        :page-size="numSize"
        layout="prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>

    <div v-else class="empty-news">暂无数据</div>
  </div>
</template>

<script>
// 接接口时用 xss
import xss from 'xss'
import dayjs from 'dayjs'
export default {
  filters: {
    formatDataTime(value) {
      const timeObj = dayjs.unix(Number(value))
      return `${timeObj.format('YYYY-MM-DD')}`
    },
  },
  props: {
    newsList: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      list: [],
      total: 0,
      numSize: 5,
      curPage: Number(this.$route.params.id) || 1,
    }
  },
  watch: {
    newsList: {
      immediate: true,
      handler: function(value) {
        this.list = this.xssFormat(value.list)
        this.total = Number(value.total)
      },
    },
  },
  methods: {
    // 当前页改变
    handleCurrentChange(value) {
      this.$router.push({
        name: 'intelligence-news-main-id',
        params: { id: value },
      })
    },
    xssFormat(arr) {
      return arr.map(item => {
        item.content = xss(item.content)
        item.title = xss(item.title)
        return item
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.main-section {
  font-size: $font-size-small;
  font-family: $font-family-no-number;
  color: #333;
  position: relative;

  .empty-news {
    font-size: 16px;
    text-align: center;
    font-weight: bold;
    margin-top: 40%;
  }

  .pagination-style {
    text-align: center;
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
  }

  .placeholder-pagination {
    padding-top: 30px;
    padding-bottom: 10px;
    height: 26px;
  }

  .pagination-style /deep/ .el-pager li {
    font-size: $font-size-small;
    font-family: $font-family-no-number;
    font-weight: normal;
    background-color: $color-white;
    border: 1px #efefef solid;
    min-width: 22px;
    height: 22px;
    line-height: 22px;
    margin: 0 6px;
  }

  .pagination-style /deep/ .el-pager li.btn-quickprev,
  .pagination-style /deep/ .el-pager li.btn-quicknext {
    pointer-events: none;
    border: none;
  }

  .pagination-style /deep/ .el-icon-d-arrow-right::before,
  .pagination-style /deep/ .el-icon-d-arrow-left::before {
    content: '\E794';
  }

  .pagination-style /deep/ .btn-next,
  .pagination-style /deep/ .btn-prev {
    background-color: $color-white;
    padding: 0 6px;
    border: 1px #efefef solid;
    min-width: 22px;
    height: 22px;
    padding: 0;
    line-height: 22px;
  }

  .pagination-style /deep/ .btn-next {
    width: 3em;
    margin-left: 11px;
    border: none;
  }

  .pagination-style /deep/ .btn-next i.el-icon-arrow-right::before {
    content: '下一页';
  }

  .pagination-style /deep/ .btn-prev {
    width: 3em;
    margin-right: 11px;
    border: none;
  }

  .pagination-style /deep/ .btn-prev i.el-icon-arrow-left::before {
    content: '上一页';
  }

  .list-item {
    padding-bottom: 12px;
    border-bottom: 1px #efefef solid;
    margin-bottom: 12px;
  }

  .list-item:last-of-type {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }

  .top-part {
    height: 22px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
  }

  .time-box {
    position: absolute;
    right: 0;
    top: 0;
  }

  .news-title {
    font-weight: bold;
    font-size: $font-size-large;
    line-height: $font-size-large;
    margin-left: 8px;
  }

  .type-label {
    border-radius: 4px;
    height: 18px;
    width: 44px;
    box-sizing: border-box;
    text-align: center;
    line-height: 16px;
  }

  .color-blue {
    color: $color-active;
    border: 1px $color-active solid;
  }

  .color-red {
    color: $color-away;
    border: 1px $color-away solid;
  }

  .set-ctx {
    color: #333;
    margin-top: 12px;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
