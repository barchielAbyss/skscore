<template>
  <div class="team-squad">
    <h2 class="team-squad-title">阵容简介</h2>

    <table class="team-squad-list">
      <thead>
        <tr>
          <th
            v-for="item of columns"
            :key="item.key"
            :style="{ width: `${item.width}px` }"
            v-text="item.title"
          />
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) of teamLineup" :key="index">
          <td
            v-for="column of columns"
            :key="column.key"
            v-text="item[column.key] || '-'"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
const USER_COLUMNS = [
  { title: '号码', key: 'number', width: 50 },
  { title: '球员', key: 'name', width: 250 },
  { title: '生日', key: 'birthday', width: 100 },
  { title: '身高', key: 'height', width: 70 },
  { title: '体重', key: 'weight', width: 60 },
  { title: '位置', key: 'position', width: 70 },
  { title: '国籍', key: 'country', width: 200 },
  { title: '预计身价', key: 'value', width: 80 },
  { title: '合同截止', key: 'contract_time', width: 100 },
]

export default {
  props: {
    teamLineup: Array,
  },
  data() {
    return {
      columns: USER_COLUMNS,
    }
  },
}
</script>

<style lang="scss" scoped>
.team-squad {
  margin-bottom: 40px;
  &-title {
    font-weight: bold;
    font-size: 14px;
    padding-bottom: 11px;
  }
  &-list {
    border: 1px solid #efefef;
    thead {
      line-height: 45px;
      tr {
        background-color: #f5f5f5;
        th {
          font-weight: normal;
        }
      }
    }
    tbody {
      font-size: $font-size-small;
      text-align: center;
      line-height: 36px;
      tr {
        &:nth-of-type(even) {
          background-color: #f5f5f5;
        }
        &:nth-of-type(odd) {
          background-color: $color-white;
        }
      }
      td {
        border: 1px solid #efefef;
      }
    }
  }
}
</style>
