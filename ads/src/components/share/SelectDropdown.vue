<template>
  <el-select
    id="input"
    @change="handleChange"
    @focus="handleFocus"
    @visible-change="handleVisibleChange"
    @click.native="handleClick"
    @keyup.native="handleKeyup"
    ref="input"
    :value="value"
    :filterable="filterable"
    :placeholder="placeholder"
    :disabled="disabled"
    :remote="remote"
    :remote-method="remoteMethod"
    :loading="loading"
    :class="{ has_icon: hasIcon }"
    :clearable="clearable"
    no-match-text="查無資料"
    no-data-text="無資料"
    loading-text="查詢中..."
  >
    <el-option
      :class="{ wrap }"
      v-for="(item, index) in options"
      :key="index"
      :label="item.label"
      :value="optionsAllData ? item : item.value"
      :disabled="item.disabled ? item.disabled : false"
    >
      <template v-if="isHistoryMode && filterable && remote">
        <span>{{ item.label }}</span>
        <span class="float-right pr-2" @click.stop="deleteRecord(item, index)"
          ><icon iconName="icon-delete-big" size="16"
        /></span>
      </template>
      <template v-else-if="wrap">
        <span class="wrap">{{ item.label }}</span>
      </template>
      <template v-else>
        <span>{{ item.label }}</span>
      </template>
    </el-option>
  </el-select>
</template>

<script>
import { EventBus } from "@/utils/eventBus.js";
import localStorageService from "@/utils/localStorageData.js";

export default {
  props: {
    value: {
      type: [String, Number],
      default: ""
    },
    options: {
      type: Array,
      default: () => []
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
    hasIcon: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    atCalendar: {
      type: Boolean,
      default: false
    },
    focusAction: {
      type: Function,
      default: () => null
    },
    type: {
      // 因應儲存歷史記錄的功能，需帶入action name才能存取相對應的localstorage資料
      Type: String,
      default: ""
    },
    wrap: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      keyword: ""
    };
  },
  computed: {
    isHistoryMode() {
      if (!this.type || (this.options.length > 0 && this.keyword.length >= 2))
        return false;
      return true;
    }
  },
  created() {
    EventBus.$on("focusAutoComplete", () => {
      if (this.atCalendar) {
        this.$refs.input.focus();
      }
    });
  },
  methods: {
    handleChange(val) {
      this.addHistoryRecord(val);
      this.$emit("value-changed", val);
    },
    // 為了非同步進行搜索設計, asncSearchCb 以 Promise 方式傳入
    remoteMethod(query) {
      if (query.length >= 2) this.keyword = query;

      const { asncSearchCb, itemIndex } = this;
      this.loading = true;
      asncSearchCb(query, itemIndex).then(res => {
        this.loading = false;
      });
    },
    handleFocus() {
      const localData =
        localStorageService.handleLocalStorage("getItem", this.type) || [];
      if (this.filterable && this.remote && this.isHistoryMode)
        this.$emit("set-history-record", localData);

      if (this.focusAction) this.focusAction();
    },
    addHistoryRecord(val) {
      if (val && this.type && this.filterable && this.remote) {
        let localData =
          localStorageService.handleLocalStorage("getItem", this.type) || [];

        if (
          localData.some(
            item => item?.value === val || item?.value === val.value
          )
        )
          return;

        const item = this.options.find(
          item => item.value === val || item.value === val.value
        );
        if (!item) return;

        localData.unshift(item);
        localData.length = Math.min(localData.length, 8);
        localStorageService.handleLocalStorage("setItem", this.type, localData);
      }
    },
    deleteRecord(item, index) {
      if (!this.type) return;

      let localData = localStorageService.handleLocalStorage(
        "getItem",
        this.type
      );
      localData.splice(index, 1);

      localStorageService.handleLocalStorage("setItem", this.type, localData);
      this.options = localData;
      this.$emit("set-history-record", this.options);
    },
    handleVisibleChange(isOn) {
      if (!this.type) return;
      if (!isOn) {
        // 選單關閉時，若查無資料則將輸入框內容清除
        const { options, value, handleChange } = this;
        if (options.length === 0 && value) {
          handleChange("");
          this.keyword = "";
        }
      }
    },
    handleClick(el) {
      // 爲了能複製輸入框內容，如果是加在focus事件的話會被套件內的visible change事件處理蓋掉，所以另外加此事件
      if (el.target.nodeName.toUpperCase() === "INPUT") {
        el.target.value = this.value;
        el.target.select();
      }
    },
    handleKeyup(el) {
      if (
        this.type &&
        (el.key === "Delete" || el.key === "Backspace") &&
        el.target.value === ""
      ) {
        this.handleChange("");
        const localData =
          localStorageService.handleLocalStorage("getItem", this.type) || [];
        this.$emit("set-history-record", localData);
        this.keyword = "";
      }
    }
  }
};
</script>

<style>
input[class="el-input__inner"],
input[class="el-input__inner error_message_border"] {
  border: solid 1px #eee;
  background-color: #f3f3f3;
  font-size: 16px !important;
  line-height: 1.38 !important;
  letter-spacing: 1px;
  color: #292929;
  padding-left: 12px;
  height: 38px !important;
}
input[class="el-input__inner"]:focus,
input[class="el-input__inner error_message_border"]:focus {
  border: solid 1px #00afb8 !important;
}
input[class="el-input__inner error_pj"]:focus {
  font-size: 16px !important;
  border: solid 1px #ea475b !important;
}
.el-input {
  width: initial !important;
}
.el-input.is-disabled .el-input__inner {
  color: #a9a9a9 !important;
  background-color: rgba(243, 243, 243, 0.5) !important;
}
.el-popper[x-placement^="bottom"] {
  margin-top: 0 !important;
}
.el-input--suffix input[class="el-input__inner"],
.el-input--suffix input[class="el-input__inner error_message_border"] {
  margin-left: 0 !important;
}
.el-popper .popper__arrow,
.el-popper .popper__arrow::after {
  display: none !important;
}
.el-autocomplete-suggestion {
  border: 1px solid #00afb8 !important;
}
.el-autocomplete-suggestion li:hover {
  background-color: #e6f9fa !important;
}
.el-autocomplete-suggestion__wrap {
  padding: 0 !important;
}
.el-autocomplete-suggestion li {
  padding: 8px 12px !important;
  line-height: 22px !important;
  font-size: 16px;
  color: #333;
}
</style>

<style lang="scss">
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

.el-input {
  background: #f3f3f3;
  border-radius: 4px;

  &.is-disabled {
    background-color: #f9f9f9;
  }

  > input[type="text"] {
    cursor: text;
  }

  .el-input__inner {
    height: 44px;
    padding-left: 12px;
    border: 1px solid $gray-400 !important;
    color: $gray-900;
    background: #f3f3f3;
    transition: 0s;

    &::placeholder {
      font-weight: normal !important;
      color: $gray-600;
      opacity: 1;
    }
  }
}

.el-select {
  width: 100%;
  &.has_icon {
    .el-input {
      &:before {
        content: "";
        display: inline-block;
        background-color: $gray-600;
        position: absolute;
        width: 8px;
        height: 2px;
        top: 18px;
        right: 18px;
        transform: rotate(45deg);
        z-index: 999;
      }

      &:after {
        content: "";
        display: inline-block;
        background-color: $gray-600;
        position: absolute;
        width: 8px;
        height: 2px;
        top: 18px;
        right: 13px;
        transform: rotate(135deg);
        z-index: 999;
      }
    }
  }
}

.el-select-dropdown {
  border: 1px solid $primary !important;

  .el-select-dropdown__wrap {
    max-height: 300px;
  }
}

.el-select-dropdown__item {
  font-size: 16px !important;
  padding: 0 0 0 12px !important;

  &.selected {
    color: $primary !important;
  }

  &.hover {
    background: #e6f9fa !important;
  }

  &.wrap {
    width: 343px;
    height: 100%;
    line-height: 1.38;
    padding: 6px 0 6px 12px !important;

    &:not(:last-child) {
      margin-bottom: 10px;
    }

    span.wrap {
      white-space: pre-wrap;
    }
  }
}

.el-icon-arrow-up {
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
}
</style>
