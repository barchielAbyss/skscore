<template>
  <div class="integral-wrap">
    <div v-if="false" class="top-part">
      <div class="btn-group">
        <button
          v-for="item of btnGroup"
          :key="item"
          :class="['btn-default', { 'btn-active': item === btnActive }]"
          @click="handleClick(item)"
        >
          {{ item }}
        </button>
      </div>
    </div>

    <keep-alive>
      <component
        :is="component"
        :types="btnActive"
        :event-id="eventId"
        :year-id="yearId"
      />
    </keep-alive>
  </div>
</template>

<script>
import AllIntegral from '@/page-components/archive/football/all-integral'
import Select from '@/components/popover-select'

export default {
  components: { Select, AllIntegral },
  props: {
    yearId: {
      type: [Number, String],
    },
    eventId: {
      type: [Number, String],
    },
  },
  data() {
    return {
      value: 0,
      component: 'AllIntegral',
      btnActive: '总积分',
      btnGroup: ['总积分', '主场积分', '客场积分'],
      opts: [
        { label: '总积分榜', value: 0 },
        { label: '第1轮', value: 1 },
        { label: '第2轮', value: 2 },
        { label: '第3轮', value: 3 },
        { label: '第4轮', value: 4 },
      ],
    }
  },
  methods: {
    handleClick(item) {
      this.btnActive = item
    },
  },
}
</script>

<style lang="scss" scoped>
.integral-wrap {
  padding: 18px 18px 12px;

  .top-part {
    padding: 10px 0;
    margin-bottom: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .btn-group {
      .btn-default {
        padding: 7px 16px;
        cursor: pointer;
        border: none;
        outline: none;
        background: #f3f4fb;
        border-radius: 2px;
        font-size: $font-size-middle;
        color: $font-title-color;
        font-family: $font-family-no-number;
        margin-right: 10px;
      }

      button.btn-active {
        color: $color-active;
        background: #e5f1ff;
        font-weight: bold;
      }
    }
  }
}
</style>
