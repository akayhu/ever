<template>
  <div>
    <div class="compare_type_nav d-flex">
      <div
        class="d-flex justify-content-center"
        :class="{ nav_checked: type === currentDataType }"
        v-for="type in dataType"
        :key="type"
        @click="changeDataType(type)"
      >
        {{ type }}
      </div>
    </div>
    <div class="data_total_summary">
      <span>{{ currentDataType }}</span>
      <span class="number ml-2">{{ 11111 | numberCommaFormat }}</span>
      <span class="ml-1">次</span>
    </div>
    <div
      class="data_legend_group d-flex justify-content-end mt-4 "
      :class="{ 'justify-content-between': currentCompareLists.length > 0 }"
    >
      <div class="company_legend d-flex">
        <div
          class="single_legend"
          v-for="(data, index) in currentCompareLists"
          :key="data.id"
        >
          <span class="legend_icon mr-1" :class="`legend_${index + 1}`"></span>
          <span>{{ data.companyName }} </span>
        </div>
      </div>
      <div class="total_summary_legend ">
        <span class="legend_icon mr-1"></span>
        <span>加總</span>
      </div>
    </div>
    <div class="line_chart_container overflow-hidden mt-5">
      <area-chart
        :basicConfig="areaChartConfig.basicConfig(250, [10, 0, 10, 10])"
        :titleConfig="areaChartConfig.titleConfig()"
        :xAxisConfig="areaChartConfig.xAxisConfig(formatCate(chartCategories))"
        :yAxisConfig="areaChartConfig.yAxisConfig()"
        :tooltipConfig="areaChartConfig.tooltipConfig()"
        :legendConfig="areaChartConfig.legendConfig(false)"
        :plotOptions="areaChartConfig.plotOptions()"
        :series="areaChartConfig.series([])"
      />
    </div>
  </div>
</template>

<script>
import AreaChart from "@/components/reportQuery/leaderBoard/AreaChart";
import areaChartConfig from "@/utils/report/leaderBoard/areaChartConfig";
import { createNamespacedHelpers } from "vuex";
const { mapGetters } = createNamespacedHelpers("report/leaderBoard");
export default {
  props: {
    currentCompareLists: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      dataType: ["IMP", "Click", "CTR"],
      currentDataType: "IMP",
      areaChartConfig
    };
  },
  components: {
    AreaChart
  },
  computed: {
    ...mapGetters(["chartCategories"])
  },
  methods: {
    changeDataType(type) {
      this.currentDataType = type;
    },
    formatCate(categories) {
      const formatCate = categories.map(cate => {
        let cateYear = cate.year;
        let cateMonth = cate.month;
        let cateDay = cate.day;
        return {
          xAxis: cateYear + "<br/>" + cateMonth + cateDay
        };
      });
      return formatCate;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~scss/component/variables";
@import "~scss/mixin/mixin";

// data type nav 切換
.compare_type_nav {
  @include font-common(18px, $font-weight-bold, $gray-900);
  border-bottom: solid 1px #e2e1e1;

  > div {
    width: 162px;
    cursor: pointer;
  }

  .nav_checked {
    border-bottom: solid 4px $blue-turquoise;
  }
}
// 數字總結
.data_total_summary {
  margin-top: 30px;

  > span:nth-child(1) {
    @include font-common(24px, $font-weight-bold);
  }

  > span:nth-child(2) {
    @include font-common(18px, $font-weight-bold);
  }

  > span:nth-child(3) {
    @include font-common(14px, $font-weight-bold);
  }
}

// data legend 圖示
.data_legend_group {
  @include font-common(14px, $font-weight-bold, $black);

  $legendColors: #609af3, #50c0c5, #a7d32a, #ea84b4, #ffc627;

  @for $i from 1 through length($legendColors) {
    $color: nth($legendColors, $i);
    .legend_#{$i} {
      background: $color;
    }
  }

  .legend_icon {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .company_legend {
    .single_legend:not(:first-child) {
      margin-left: 16px;
    }
  }

  .total_summary_legend {
    .legend_icon {
      background: $gray-700;
    }
  }
}
</style>
