<template>
  <div class="hot-compare paddingX-rwd rounded bg-white mt-4 py-4 py-md-8">
    <h3 class="mb-4 hot-compare__title">熱門的比較組合</h3>
    <div class="d-flex flex-wrap justify-content-between">
      <div
        v-for="(compare, idx) in comparisonList"
        :key="`compare-${idx}`"
        class="compare-combination d-flex rounded"
        :class="{ 'mb-md-6': idx < 2 }"
      >
        <div
          class="d-block p-4 p-md-6 compare-company"
          v-for="company in compare"
          :key="company.custno"
        >
          <CompanyHeader
            class="d-flex align-items-center mb-1 mb-md-5"
            :src="company.companyLogo"
            :link="company.link"
            :name="company.companyName"
            logoClass="mr-3"
          />
          <div class="d-flex align-items-center font-weight-bold">
            <div class="score mr-3 mr-md-4">
              {{ company.scoreOverall | decimal }}
            </div>
            <praise-img
              :score="getScoreStampNum(+company.scoreOverall)"
              class="mb-1"
            />
          </div>
        </div>
        <a
          class="clickable-mask"
          :href="
            `https://reviews.104.com.tw/top/compare/${getCompareParam(compare)}`
          "
          :data-gtm-btn="`熱門比較組合${idx + 1}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ compare[0].companyName }} VS {{ compare[1].companyName }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import CompanyHeader from "@/components/CompanyHeader.vue";
import PraiseImg from "@/components/Praise.vue";
import { formatDecimalNum, encodeCustno } from "@/utils/index";
export default {
  name: "HotCompare",
  components: {
    CompanyHeader,
    PraiseImg
  },
  props: {
    comparisonList: {
      type: Array,
      required: true
    }
  },
  filters: {
    decimal: formatDecimalNum
  },
  methods: {
    getCompareParam(comparison) {
      return comparison.map(company => company.custno).join("-vs-");
    },
    getScoreStampNum(score) {
      return score ? +score.toFixed(1) : 0;
    },
    encodeCustno: encodeCustno
  }
};
</script>

<style lang="scss" scoped>
.hot-compare {
  color: get-color(text);
  .hot-compare__title {
    font-weight: 700;
    color: get-color(text);
  }
  .compare-combination {
    position: relative;
    box-shadow: 0 4px 8px 0 rgba(41, 41, 41, 0.2);
    cursor: pointer;
    flex-basis: calc(50% - 12px);
    max-width: calc(50% - 12px);
    transition: box-shadow 0.2s ease-out;
    &:hover {
      box-shadow: 0 6px 16px 0 rgba(41, 41, 41, 0.2);
    }
    @include device-down(md) {
      flex-basis: 100%;
      max-width: 100%;
      &:not(:last-child) {
        margin-bottom: 16px;
      }
    }
    .clickable-mask {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      font-size: 0;
      line-height: 0;
      color: transparent;
    }
  }
  .compare-company {
    width: 50%;
    &:not(:last-of-type) {
      border-right: 1px solid get-color(border);
    }
    .score {
      color: get-color(text);
      font-size: 32px;
      line-height: 40px;
      @include device-down(md) {
        font-size: 16px;
        line-height: 1.43;
      }
    }
  }
}
::v-deep .company-header {
  position: relative;
  z-index: 1;
  .company-link {
    @include truncate-text();
  }
  @include device-up(md) {
    .company-link {
      white-space: initial;
      @include truncate-text(2);
    }
  }
  @include device-down(md) {
    .logo {
      display: none;
    }
  }
}
</style>
