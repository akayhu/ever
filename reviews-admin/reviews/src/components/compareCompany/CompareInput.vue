<template>
  <div class="compare-input py-6 pt-md-10 pb-md-12 bg-white paddingX-rwd">
    <div class="t2 font-weight-bold text-center">比較出最適合你的好公司</div>
    <div class="subTitle t4 text-center mt-2 mb-6">
      輸入兩間你想比較的公司，點擊比較按鈕後，機器人會為你生成詳細的比較表。
    </div>
    <div class="compare-input-area">
      <div
        class="d-flex align-items-center flex-wrap flex-md-nowrap compare-container mr-md-4 w-100"
      >
        <AcSearchInput
          class="input"
          :companyName.sync="compareName[0]"
          @update:companyCustno="updateCompareData('compareCustno', 0, $event)"
          :currentCompany="currentCompany[0]"
        />
        <div class="vs t2 font-weight-bold mx-4">VS</div>
        <AcSearchInput
          class="input"
          :companyName.sync="compareName[1]"
          @update:companyCustno="updateCompareData('compareCustno', 1, $event)"
          :currentCompany="currentCompany[1]"
        />
      </div>
      <div class="compare-submit-block mt-4 mt-md-0">
        <button
          :disabled="!enableSubmit"
          class="compare-btn btn-secondary t2 font-weight-bold text-center text-white rounded"
          data-gtm-btn="比較公司"
          @click.prevent="getCompareResult"
        >
          比較公司
        </button>
      </div>
    </div>
    <transition name="drop">
      <CompareInputFixed
        v-show="fixBarActive"
        ref="fixBar"
        :currentCompany="currentCompany"
        :compareName="compareName"
        :compareCustno="compareCustno"
        @update:compareName="$set(compareName, $event[1], $event[0])"
        @update:compareCustno="
          updateCompareData('compareCustno', $event[1], $event[0], true)
        "
      />
    </transition>
  </div>
</template>

<script>
import AcSearchInput from "@/components/AcSearchInput.vue";
import CompareInputFixed from "./CompareInputFixed";
export default {
  name: "CompareInput",
  components: {
    AcSearchInput,
    CompareInputFixed
  },
  props: {
    currentCompany: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      fixBarActive: false,
      compareName: [null, null],
      compareCustno: [null, null]
    };
  },
  computed: {
    enableSubmit() {
      return this.compareCustno.every(custno => custno);
    },
    compareParam() {
      return this.compareCustno.join("-vs-");
    },
    comparingItemChangeStatus() {
      if (!this.currentCompany.length) return;
      return this.compareCustno.map(
        (custno, idx) => custno === this.currentCompany[idx].custno
      );
    },
    itemHasChanged() {
      if (!this.currentCompany.length) return;
      return this.comparingItemChangeStatus.some((item, idx) => {
        return this.compareCustno[idx] !== null && !item;
      });
    }
  },
  mounted() {
    window.addEventListener("scroll", this.scrollHandler);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.scrollHandler);
  },
  watch: {
    currentCompany(current, prev) {
      if (this.currentCompany.length) {
        this.compareName = current.map(c => c.companyName);
        this.compareCustno = current.map(c => c.custno);
      } else {
        // reset
        this.compareName = [null, null];
        this.compareCustno = [null, null];
      }
    },
    comparingItemChangeStatus(value) {
      if (value) {
        this.$emit("showPanelHandler", value);
      }
    }
  },
  methods: {
    getCompareResult() {
      if (!this.itemHasChanged && this.currentCompany.length) return;
      this.$router
        .push({
          name: "compare",
          params: { compare: this.compareParam }
        })
        .catch(err => ({}));
    },
    scrollHandler() {
      if (!this.$route.params.compare) return;
      const offset = document.querySelector(".compare-result").offsetTop - 44;
      if (window.pageYOffset >= offset) {
        this.fixBarActive = true;
      } else {
        this.fixBarActive = false;
      }
    },
    updateCompareData(category, idx, value, getResultImmed = false) {
      this.$set(this[category], idx, value);
      if (getResultImmed && this.itemHasChanged) {
        this.getCompareResult();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.compare-input {
  color: get-color(text);
  @include device-up(md) {
    background-image: url("~@/assets/compare.png");
    background-repeat: no-repeat;
    background-size: 141px;
    background-position: left bottom;
  }
  @include device-up(lg) {
    background-position: 121px bottom;
  }
  @include device-up(xl) {
    background-position: 180px bottom;
  }
  .input {
    max-width: calc((100% - 55px) / 2);
    flex-basis: calc((100% - 55px) / 2);
    flex-shrink: 0;
    flex-grow: 0;
    @include device-down(md) {
      max-width: 100%;
      flex-basis: 100%;
    }
  }

  .subTitle {
    color: get-color(text-info);
  }

  .vs {
    text-align: center;
    // font-family: MicrosoftJhengHei, sans-serif;
    @include device-down(md) {
      margin: 8px 0;
      flex-basis: 100%;
    }
  }
}
.compare-input-area {
  position: static;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  @include device-up(md) {
    flex-wrap: nowrap;
  }
}
.compare-submit-block {
  flex-basis: 100%;
  max-width: 615px;
  margin: 0 auto;
  @include device-up(md) {
    flex-basis: 104px;
    max-width: 104px;
    margin: 0;
  }
  @include device-up(lg) {
    flex-basis: 154px;
    max-width: 154px;
  }
}
.compare-btn {
  width: 100%;
  height: 44px;
  padding: 10px 0;
  cursor: pointer;
  &[disabled] {
    cursor: not-allowed;
    background-color: get-color(disable);
  }
}

button {
  border: none;
  outline: none;
  box-shadow: none;
  &:focus,
  &:active,
  &.focus {
    outline: none;
    box-shadow: none;
  }
}
</style>
