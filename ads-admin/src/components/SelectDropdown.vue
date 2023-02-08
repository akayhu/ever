<template>
  <el-select
    @change="handleChange"
    @clear="handleClear"
    @focus="handleFocus"
    :model-value="value"
    :filterable="filterable"
    :placeholder="placeholder"
    :disabled="disabled"
    :remote="remote"
    :remote-method="remoteMethod"
    :loading="loading"
    :no-data-text="noDataText"
    :no-match-text="noMatchText"
    :clearable="clearable"
    loading-text="查詢中..."
    popper-class="test"
  >
    <el-option
      v-for="(item, index) in options"
      :key="index"
      :label="item.label"
      :value="optionsAllData ? item : item.value"
      :disabled="item.disabled ? item.disabled : false"
    >
    </el-option>
  </el-select>
</template>

<script>
import { ref, defineComponent } from "vue";

export default defineComponent({
  props: {
    value: {
      type: [String, Number],
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: ""
    },
    filterable: {
      type: Boolean,
      default: false
    },
    remote: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    asncSearchCb: {
      type: Function,
      default: () => null
    },
    optionsAllData: {
      type: Boolean,
      default: false
    },
    itemIndex: {
      type: Number,
      default: 0
    },
    noDataText: {
      type: String,
      default: "無資料"
    },
    noMatchText: {
      type: String,
      default: "查無資料"
    },
    clearable: {
      type: Boolean,
      default: false
    },
    handleFocus: {
      type: Function,
      default: () => null
    }
  },
  emits: ["value-changed", "value-clear"],
  setup(props, { emit }) {
    let loading = ref(false);

    const handleChange = val => {
      emit("value-changed", val);
    };

    const handleClear = () => {
      emit("value-clear");
    };

    // 為了非同步進行搜索設計, asncSearchCb 以 Promise 方式傳入
    const remoteMethod = query => {
      loading.value = true;
      props.asncSearchCb(query, props.itemIndex).then(() => {
        loading.value = false;
      });
    };

    return {
      loading,
      handleChange,
      handleClear,
      remoteMethod
    };
  }
});
</script>

<style lang="scss">
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

.el-input {
  background: #f3f3f3;
  border-radius: 4px;

  > input[type="text"] {
    cursor: text;
  }
  .el-input__inner {
    height: 44px;
    padding-left: 12px;
    border: 1px solid $gray-400;
    color: $gray-900;
    background: #f3f3f3;
    transition: 0s;
    font-size: 16px;

    &::placeholder {
      font-weight: bold !important;
      color: $gray-600;
      opacity: 1;
    }

    &:hover {
      border: 0;
    }
  }
}

.el-select {
  width: 100%;

  &:hover {
    border: 0;
  }

  .el-input__inner {
    border: 0;
  }
}

.el-select-dropdown {
  border: 1px solid $primary !important;
}

.el-select-dropdown__item {
  padding: 0 0 0 12px !important;

  &.selected {
    color: $primary !important;
  }
  &.hover {
    background: #e6f9fa !important;
  }
}

// .el-icon-arrow-up {
//   color: $gray-700 !important;
//   font-weight: $font-weight-bold;
// }

.el-input__icon {
  color: $gray-700 !important;
  font-weight: $font-weight-bold;
}

.el-popper {
  &[x-placement^="top"] {
    margin-bottom: -2px !important;
  }
  &[x-placement^="bottom"] {
    margin-top: -2px !important;
  }

  .popper__arrow {
    &::after {
      display: none !important;
    }

    display: none !important;
  }
}
</style>
