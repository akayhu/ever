<template>
  <div class="CompareCompany">
    <CompareInput
      :currentCompany="currentCompany"
      @showPanelHandler="showPanel = $event"
    />
    <CompareResult
      v-if="$route.params.compare"
      :compareData="compareData"
      :compareScoreResult="compareScoreResult"
      :showPanel="showPanel"
      :listedStockMap="listedStockMap"
      :reviewItemsMap="reviewItemsMap"
      :loading="loading"
    />
    <HotCompare :comparisonList="popularComparisons" />
  </div>
</template>

<script>
import CompareInput from "@/components/compareCompany/CompareInput.vue";
import CompareResult from "@/components/compareCompany/CompareResult.vue";
import HotCompare from "@/components/compareCompany/HotCompare.vue";
import popularComparisons from "@/assets/popularComparisons.js";
import { mapState } from "vuex";
import {
  encodeCustno,
  formatDecimalNum,
  companySalaryFormat
} from "@/utils/index";
export default {
  name: "CompareCompany",
  components: {
    CompareInput,
    CompareResult,
    HotCompare
  },
  data() {
    return {
      showPanel: [true, true],
      compareData: [],
      compareItem: {
        reviewItems: {},
        listedStock: {}
      },
      reviewItemsMap: [
        "薪資福利",
        "公司環境",
        "工作氣氛",
        "公司前景",
        "工作穩定",
        "兼顧生活",
        "升遷機會",
        "團隊合作",
        "主管友善",
        "教育訓練"
      ],
      listedStockMap: {
        overallAvgSalary: "全體平均",
        nonSupervisorAvg: "非主管平均",
        nonSupervisorMed: "非主管中位數",
        avgRaiseSalary: "平均加薪幅度"
      },
      popularComparisons
    };
  },
  computed: {
    currentCompany() {
      return this.compareResult.map(({ companyName, custno }) => {
        return {
          companyName,
          custno: encodeCustno(custno)
        };
      });
    },
    compareScoreResult() {
      return Object.entries(this.compareItem).reduce((acc, [key, items]) => {
        const compareResult = Object.entries(items).reduce((a, [k, v], idx) => {
          const reviewItemIncomparable =
            key === "reviewItems" && +Math.abs(v[0] - v[1]).toFixed(1) < 0.2;
          const hasEmptyValue = !v[0] || !v[1];
          const isEqual = v[0] === v[1];
          // 若有符合以下情況就不做比較
          if (reviewItemIncomparable || hasEmptyValue || isEqual) {
            a[k] = null;
          } else {
            if (v[0] > v[1]) {
              a[k] = 0;
            } else {
              a[k] = 1;
            }
          }
          return a;
        }, {});
        acc[key] = compareResult;
        return acc;
      }, {});
    },
    loading() {
      return !this.compareResult.length;
    },
    ...mapState("company", ["compareResult"])
  },
  watch: {
    compareResult: {
      handler(data, prevData) {
        if (!data.length) return;
        this.resetITemToCompare();
        this.compareData = this.arrangeData(data);
      },
      immediate: true
    }
  },
  beforeRouteUpdate(to, from, next) {
    // 若回到default頁就reset
    if (!to.params.compare) {
      this.compareData = [];
      this.compareItem = {
        reviewItems: {},
        listedStock: {}
      };
    }
    next();
  },
  methods: {
    arrangeData(rawData) {
      return rawData.map((company, idx) => {
        return Object.entries(company).reduce((acc, [key, value]) => {
          if ((key === "reviewItems" || key === "listedStock") && value) {
            value = this.sortItemBy(this[`${key}Map`], { key, value }, idx);
          }
          acc[key] = value;
          return acc;
        }, {});
      });
    },
    sortItemBy(ref, rawData, compareSide) {
      if (rawData.value instanceof Array) {
        return ref.map((name, idx) => {
          const targetItem = rawData.value.find(el => el.reviewItem === name);
          this.setItemToCompare(rawData.key, name, targetItem, compareSide);
          return targetItem;
        });
      } else {
        return Object.entries(ref).reduce((acc, [key, value], idx) => {
          const targetItem = rawData.value[key];
          acc[key] = targetItem;
          this.setItemToCompare(rawData.key, key, targetItem, compareSide);
          return acc;
        }, {});
      }
    },
    setItemToCompare(category, itemName, item, side) {
      if (!this.compareItem[category][itemName]) {
        this.compareItem[category][itemName] = [null, null];
      }
      if (item) {
        if (typeof item === "object") {
          this.compareItem[category][itemName][side] = +formatDecimalNum(
            item.score
          );
        } else {
          // 當資料欄位是平均加薪幅度時不做處理
          // 其餘就無條件捨去取值至萬位
          this.compareItem[category][itemName][side] =
            itemName === "avgRaiseSalary" ? item : companySalaryFormat(item);
        }
      }
    },
    resetITemToCompare(category) {
      this.compareItem.reviewItems = {};
      this.compareItem.listedStock = {};
    }
  }
};
</script>

<style lang="scss">
.CompareCompany {
  .el-input {
    // @include truncate-text();
    .el-input__inner {
      display: inline-block;
      @include truncate-text();
    }
  }
}
.compare-container {
  max-width: 615px;
  margin: 0 auto;
  @include device-up(md) {
    margin-left: calc(18% - 15px);
  }
  @include device-up(lg) {
    margin-left: 22.6%;
  }
}
</style>
