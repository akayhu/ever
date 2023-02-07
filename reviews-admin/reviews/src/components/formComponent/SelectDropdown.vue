<template>
  <el-select
    :disabled="disabled"
    :title="showTitleAttr ? '請先確認公司名稱，才能填寫此欄位唷！' : null"
    :value="selectedValue"
    :name="dataName"
    placement="bottom-end"
    :class="{ 'invalid-field': invalidField }"
    :placeholder="placeholder"
    :data-name="dataName"
    :validation="validation"
    :popper-append-to-body="false"
    @change="handleChange($event, dataName)"
    @click.native="handleClick"
  >
    <el-option
      class="d-flex select-dropdown-option"
      v-for="(item, i) in options"
      :key="item.value + item.label + i"
      :label="item.label"
      :value="item.value"
    >
      <template v-if="!isCompanyLists">
        <span>{{ item.label }}</span>
      </template>
      <template v-if="isCompanyLists && i + 1 != optionsLength">
        <span>{{ item.label }}</span>
      </template>
      <template v-if="isCompanyLists && i + 1 === optionsLength">
        <a
          @click="goToMy104"
          data-gtm-form="前往履歷表新增"
          class="goTo-my104 font-weight-bold"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="font-weight-normal">以上都不是你想評論的公司嗎？</span>
          前往履歷表新增
        </a>
      </template>
    </el-option>
  </el-select>
</template>

<script>
import { commonMixins } from "@/mixins/commonMixins";

export default {
  props: {
    disabled: {
      type: Boolean,
      required: true
    },
    placeholder: {
      type: String,
      required: true
    },
    dataName: {
      type: String,
      default: ""
    },
    options: {
      type: Array,
      required: true
    },
    value: {
      type: [Number, String],
      default: null
    },
    validation: {
      type: Object,
      default: null
    },
    handlePropsClick: {
      type: Function,
      default: null
    },
    invalidField: {
      type: Boolean,
      default: false
    }
  },
  mixins: [commonMixins],
  mounted() {
    this.setDataGtm();
  },
  data() {
    return {};
  },
  computed: {
    selectedValue() {
      return this.value;
    },
    showTitleAttr() {
      const { disabled, dataName } = this;
      return disabled && dataName !== "companyLists" ? true : false;
    },
    isCompanyLists() {
      return this.dataName === "companyLists" ? true : false;
    },
    optionsLength() {
      return this.options.length;
    }
  },
  methods: {
    handleChange(val, dataName) {
      if (!val && val !== 0) return;
      this.$emit("value-changed", val, dataName);
      if (this.validation) this.validation.$touch();
    },
    handleClick() {
      if (!this.handlePropsClick) return;
      this.handlePropsClick();
    },
    setDataGtm() {
      if (this.isCompanyLists) {
        const allCompanyLiTag = document.querySelectorAll(
          ".el-select-dropdown__item option"
        );
        allCompanyLiTag.forEach(companyLiTag => {
          companyLiTag.setAttribute("data-gtm-form", "選擇履歷公司");
        });
      }
    }
  }
};
</script>

<style lang="scss">
.select-dropdown-option {
  .goTo-my104 {
    font-size: 14px;
    @include device-up(md) {
      font-size: 16px;
    }
  }
}
</style>
