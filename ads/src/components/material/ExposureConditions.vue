<template>
  <section class="exposure_conditions_wrapper">
    <div class="exposure_conditions_main d-flex align-items-center">
      <div class="first_content">
        <h2>曝光對象</h2>
        <icon
          v-tooltip="{
            placement: 'right',
            offset: 5,
            content: '曝光對象為受眾對象',
            trigger: 'hover'
          }"
          iconName="ic-help-outline"
          size="16"
        />
      </div>
      <div class="intermediate_content">
        <span v-if="isActive">不指定條件</span>
      </div>
      <div class="last_content">
        <icon v-if="!isActive" iconName="icon-arrow-down-disable" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "ExposureConditions",
  props: {
    isActive: {
      type: Boolean
    }
  }
};
</script>

<style lang="scss" scoped>
section {
  &.exposure_conditions_wrapper {
    width: 100%;

    .exposure_conditions_main {
      display: flex;
      align-items: center;

      .first_content {
        width: 306px;

        h2 {
          float: left;
          margin-right: 8px;
        }
      }

      .intermediate_content {
        flex: 1 1 auto;
        font-size: 16px;
        font-weight: bold;
        line-height: 1.38;
        letter-spacing: 1px;
        color: #2d2d2d;
      }

      .last_content {
        text-align: right;
        min-width: 28px;
        padding-right: 4px;

        img {
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>
