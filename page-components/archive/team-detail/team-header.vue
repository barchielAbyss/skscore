<template>
  <div class="team-header">
    <div class="team-icon">
      <img v-lazy="teamInfo.icon" class="team-icon-image" />
      <p class="team-icon-name" v-text="teamInfo.name_j" />
    </div>

    <ul class="team-info">
      <li v-for="item of infoKeys" :key="item.key" class="team-info-item">
        <span class="label" v-text="item.label" />
        <span class="value" v-text="teamInfo[item.key] || '-'" />
      </li>
    </ul>
  </div>
</template>

<script>
const INFO_KEYS = [
  { label: '英文名', key: 'name_e' },
  { label: '平均年龄', key: 'old' },
  { label: '成立时间', key: 'found_date' },
  { label: '球队价值', key: 'odd' },
  { label: '所在城市', key: 'city' },
  { label: '球队主场', key: 'court' },
]

export default {
  props: {
    teamInfo: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      infoKeys: INFO_KEYS,
    }
  },
}
</script>

<style lang="scss" scoped>
.team-header {
  display: flex;
  &.card {
    padding: 34px 0 24px;
    margin-top: 12px;
    margin-bottom: 12px;
  }
  .team-icon {
    width: 220px;
    text-align: center;
    .team-icon-image {
      width: 76px;
    }
    .team-icon-name {
      margin-top: 4px;
      font-size: 12px;
      font-weight: bold;
    }
  }
  .team-info {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    .team-info-item {
      display: flex;
      width: 280px;
      line-height: 28px;
      font-size: 12px;
      border: 1px solid #efefef;
      border-radius: 4px;
      margin-bottom: 10px;
      margin-right: 40px;
      .label {
        width: 80px;
        text-align: center;
        background-color: #f5f5f5;
        color: #666;
      }
      .value {
        padding: 0 20px;
      }
    }
  }
}
</style>
