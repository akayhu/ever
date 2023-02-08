<template>
  <div class="cue_content">
    <div class="left_content">
      <!-- 可從Cue移除 -->
      <input
        v-if="item.removable"
        type="checkbox"
        v-model="item.checked"
        :id="`cue_item_${index}`"
        @change="changeChecked"
      />
      <label v-if="item.removable" :for="`cue_item_${index}`" class="mr-2">
        <span></span>
        {{ item.startDate }} ~ {{ item.endDate }}
      </label>
      <!-- 不可從Cue移除 -->
      <span v-if="!item.removable" class="ml-7 mr-2"
        >{{ item.startDate }} ~ {{ item.endDate }}</span
      >
      <span class="days"
        >( <span>{{ item.days }}</span> 天 )</span
      >
    </div>
    <div class="right_content">
      <div class="mr-10">小計(含稅)</div>
      <div>{{ item.priceIncludeTax.toLocaleString() }}</div>
      <div class="ml-6">元</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  item: {
    type: Object,
    required: true
  },
  offCheckedCancelNotPullCueCheckbox: {
    type: Function,
    default: () => {}
  }
});

const changeChecked = () => {
  props.offCheckedCancelNotPullCueCheckbox();
};
</script>

<style lang="scss" scoped>
.cue_content {
  display: flex;
  justify-content: space-between;
  letter-spacing: 1.38px;
  border-bottom: 1px solid #eee;
  padding: 24px 0;

  .left_content {
    .days {
      color: #7e7e7e;

      span {
        color: #33b3ba;
      }
    }
  }

  .right_content {
    display: flex;

    div {
      &:nth-child(2) {
        color: #19b9c0;
        font-weight: bold;
      }
    }
  }
}
</style>
