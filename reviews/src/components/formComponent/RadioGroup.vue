<template>
  <div class="radio-option-lists">
    <el-radio-group
      :key="i"
      v-for="(company, i) in companyLists"
      @input="handleChange(company.name, company.custno, company.hasReview)"
    >
      <el-radio :label="company.name">{{ company.name }}</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedValue: null
    };
  },
  props: {
    companyLists: {
      type: Array,
      required: true
    },
    value: {
      type: String,
      default: null
    },
    validation: {
      type: Object,
      default: null
    }
  },
  mounted() {
    this.setDataGtm();
  },
  methods: {
    setDataGtm() {
      const allRadioInput = document.querySelectorAll(
        ".companyLayer .el-radio__original"
      );
      allRadioInput.forEach(radio => {
        radio.setAttribute("data-gtm-form", "選取多筆公司");
      });
    },
    handleChange(compantyName, custno, hasReview) {
      if (this.validation) this.validation.$touch();
      this.selectedValue = compantyName;
      this.$emit("value-changed", compantyName, custno, hasReview);
    }
  },
  computed: {
    // selectedValue() {
    //   return this.value;
    // }
  }
};
</script>

<style lang="scss">
.radio-option-lists {
  .el-radio-group {
    width: 100%;
    font-weight: 400;
  }
}
</style>
