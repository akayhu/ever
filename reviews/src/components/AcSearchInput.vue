<template>
  <div class="ac-compare">
    <el-autocomplete
      ref="elAutocomplete"
      class="d-block t3"
      popper-class="p-0 m-0 ac-dropdown"
      placeholder="請輸入公司名稱"
      :class="{ 'invalid-field': invalidField }"
      :value="companyName"
      :disabled="false"
      :debounce="500"
      :hide-loading="false"
      :fetch-suggestions="acSearch"
      :trigger-on-focus="false"
      :popper-append-to-body="false"
      @input="getQueryCompany"
      @select="getCompanyNo"
      @blur="clearInput"
      @focus="focusHandler"
    />
  </div>
</template>

<script>
import { commonMixins } from "@/mixins/commonMixins";
import { apiGetCompaniesAutocomplete } from "@/apis/company";
export default {
  name: "AcSearchInput",
  props: {
    companyName: {
      type: String,
      default: ""
    },
    companyCustno: {
      type: [String, Number]
    },
    currentCompany: {
      type: Object,
      defualt: () => {
        return {};
      }
    }
  },
  mixins: [commonMixins],
  data() {
    return {
      invalidField: null,
      companyLists: []
    };
  },
  mounted() {
    // 在.ac-dropdown上設置tabindex屬性，使其成為可以聚焦的元素
    // 才可以取得event.relatedTarget
    this.$refs.elAutocomplete.$refs.suggestions.$el.setAttribute("tabindex", 0);
  },
  methods: {
    getQueryCompany(str) {
      this.invalidField = null;
      // 需濾掉除了中英/空白/數字/_ 之外的字 \u4E00-\u9FFF 為 unicode 中文範圍
      this.$emit(
        "update:companyName",
        str.replace(/[^\w\s\u4E00-\u9FFF]/gi, "")
      );
    },
    getCompanyNo(selectedCompany) {
      const { custno, name } = selectedCompany;
      this.$emit("update:companyName", name);
      this.$emit("update:companyCustno", this.encodeCustno(custno));
    },
    focusHandler(e) {
      this.$emit("focusing");
      this.$emit("update:companyName", null);
      this.$emit("update:companyCustno", null);
    },
    clearInput(e) {
      this.$emit("unfocus");
      // 如果觸發blur的對象是.ac-dropdown就返回
      // 此處特別加上ie判斷 -> ie似乎不支援FocusEvent的relatedTarget
      const triggerEl = this.checkIE()
        ? document.activeElement
        : e.relatedTarget;
      if (
        triggerEl &&
        [...triggerEl.classList].some(className =>
          className.includes("el-autocomplete-suggestion")
        )
      ) {
        return;
      }
      if (!this.companyCustno) {
        this.invalidField = null;
        this.$emit(
          "update:companyName",
          this.currentCompany ? this.currentCompany.companyName : null
        );
        this.$emit(
          "update:companyCustno",
          this.currentCompany ? this.currentCompany.custno : null
        );
        // 如果為無效選擇就清空suggestion的array並取消active狀態
        this.$refs.elAutocomplete.activated = false;
        this.$refs.elAutocomplete.suggestions.length = 0;
      }
    },
    acSearch(queryString, cb) {
      const payload = { keyword: queryString };
      apiGetCompaniesAutocomplete(payload).then(res => {
        this.companyLists = res.data.response
          .map(item => ({ value: item.name, ...item }))
          .filter(item => this.companyName.indexOf(item.name) === -1);
        if (!this.companyLists.length) this.invalidField = true;
        cb(this.companyLists);
        this.$nextTick(() => {
          const suggestionList = [
            ...this.$refs.elAutocomplete.$el.querySelector(
              ".el-autocomplete-suggestion__list"
            ).children
          ];
          suggestionList.forEach(el => {
            el.setAttribute("data-gtm-search", "AC");
          });
        });
      });
    },
    checkIE() {
      const ua = window.navigator.userAgent;
      return /MSIE|Trident/.test(ua);
    }
  }
};
</script>
<style lang="scss" scoped>
.ac-compare {
  .invalid-field:after {
    content: "很抱歉，公司名稱不夠精準，請重新輸入";
    position: absolute;
    top: 45px;
    left: 12px;
    width: 100%;
    font-size: 12px;
    line-height: 18px;
    color: get-color(danger) !important;
  }
}
</style>
