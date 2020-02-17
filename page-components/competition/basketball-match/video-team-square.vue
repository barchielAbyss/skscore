<template>
  <div class="video-team-square">
    <div class="home-team team-section">
      <p class="font-default title">
        {{ team.home_name }} {{ team.type ? '（首发球员）' : '（后备球员）' }}
      </p>
      <div
        v-for="item of team.home_team"
        :key="item[0]"
        :class="['font-default', 'style-list']"
      >
        <p class="width-default ml-17">{{ item[1] }}</p>
        <p class="width-default ml-20">{{ item[2] | positionOfStaff }}</p>
        <p class="width-flex ml-20">{{ item[0] }}</p>
      </div>
    </div>

    <div class="home-team team-section">
      <p class="font-default title">
        {{ team.guest_name }} {{ team.type ? '（首发球员）' : '（后备球员）' }}
      </p>
      <div
        v-for="item of team.guest_team"
        :key="item[0]"
        :class="['font-default', 'style-list', 'none-border-left']"
      >
        <p class="width-default ml-17">{{ item[1] }}</p>
        <p class="width-default ml-20">{{ item[2] | positionOfStaff }}</p>
        <p class="width-flex ml-20">{{ item[0] }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    positionOfStaff: function(value) {
      if (value === 'F') {
        return '前锋'
      } else if (value === 'G') {
        return '后卫'
      } else if (value === 'C') {
        return '中锋'
      }
    },
  },
  props: {
    teamGroup: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      team: this.teamGroup,
    }
  },
  watch: {
    teamGroup(value) {
      this.team = value
    },
  },
}
</script>

<style lang="scss" scoped>
.video-team-square {
  margin-top: 12px;
  display: flex;

  .team-section {
    width: 50%;
  }

  .font-default {
    color: #666;
    font-size: $font-size-small;
    font-family: $font-family-no-number;
  }

  .style-list {
    box-sizing: border-box;
    border: 1px #efefef solid;
    border-top: none;
    height: 24px;
    line-height: 24px;
    display: flex;
  }

  .none-border-left {
    border-left: none;
  }

  .title {
    height: 24px;
    line-height: 24px;
    font-weight: bold;
    background-color: #f5f5f5;
    text-indent: 17px;
  }

  .width-default {
    width: 48px;
  }

  .width-flex {
    flex: 1;
  }

  .ml-20 {
    margin-left: 20px;
  }

  .ml-17 {
    margin-left: 17px;
  }
}
</style>
