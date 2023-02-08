<template>
  <ul :class="getClass">
    <li
      v-for="tab in tabsData"
      :key="tab.key"
      class="switch_tabs_element"
      :class="{
        focus: tab.key === value.key || tab.key === value,
        disabled: loading || tab.disabled
      }"
      @click="!tab.disabled ? selectTab(tab) : ''"
    >
      {{ tab.label }}
    </li>
  </ul>
</template>

<script>
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "SwitchTabs",
  props: {
    tabsData: {
      type: Array,
      required: true
    },
    value: {
      type: [String, Number, Object],
      required: true
    },
    styleType: {
      type: String,
      default: "primary"
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ["select-tab"],
  setup(props, { emit }) {
    const getClass = computed(() => {
      if (props.styleType === "secondary") return "switch_tabs_secondary";
      return "switch_tabs_primary";
    });

    const selectTab = tab => {
      emit("select-tab", tab);
    };

    return {
      getClass,
      selectTab
    };
  }
});
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

.switch_tabs_primary {
  display: flex;
  border-bottom: 1px solid #e2e1e1;
  margin-bottom: 24px;
  font-size: 20px;

  .switch_tabs_element {
    @include font-common(20px, $font-weight-normal, $gray-900);
    padding: 12px 24px 8px;
    border-bottom: 4px solid $white;
    cursor: pointer;
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;

    &:hover {
      background-color: $blue-lake-light;
      color: #02cbd6;
      border-bottom: 4px solid #e6f9fa;
    }

    &.focus {
      border-bottom: 4px solid $blue-lake;
      font-weight: bold;
      color: #00b2ba;

      &:hover {
        background-color: #fff;
      }
    }

    &.disabled {
      color: #a9a9a9;
      cursor: not-allowed;
    }
  }
}

.switch_tabs_secondary {
  margin-bottom: 16px;
  border-bottom: 1px solid $gray-500;

  .switch_tabs_element {
    @include font-common(18px, $font-weight-normal, $gray-900);
    border: solid 1px $gray-500;
    display: inline-block;
    position: relative;
    top: 1px;
    text-align: center;
    border-top-right-radius: 6px;
    border-top-left-radius: 6px;
    cursor: pointer;
    padding: 12px 20px;

    @for $i from 2 through 10 {
      &:nth-child(#{$i}) {
        left: calc(1px - #{$i}px);
      }
    }

    &:hover {
      background-color: $blue-lake-light;
      color: $blue-lake;
      border: 1px solid $primary-hover;
      border-bottom: 1px solid $blue-lake-light;
      z-index: 2;
    }

    &.focus {
      background: $white;
      font-weight: $font-weight-bold;
      color: $blue-turquoise;
      border-top: 4px solid $blue-turquoise;
      border-left: solid 1px $gray-500;
      border-right: solid 1px $gray-500;
      border-bottom: 1px solid $white;
      padding: 9px 20px 12px;
    }

    &.disabled {
      background-color: $white;
      color: $gray-600;
      cursor: not-allowed;
    }
  }
}
</style>
