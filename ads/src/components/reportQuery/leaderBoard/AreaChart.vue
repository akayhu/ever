<template>
  <highcharts
    ref="lineChart"
    :options="chartOptions"
    :updateArgs="[true, true, true]"
  ></highcharts>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: undefined
    },
    chartTitle: {
      type: String,
      default: undefined
    },
    basicConfig: {
      type: Object,
      default: () => {}
    },
    titleConfig: {
      type: Object,
      default: () => {}
    },
    tooltipConfig: {
      type: Object,
      default: () => {}
    },
    xAxisConfig: {
      type: Object,
      default: () => {}
    },
    categories: {
      type: Array,
      default: () => []
    },
    yAxisConfig: {
      type: Object,
      default: () => {}
    },
    plotOptions: {
      type: Object,
      default: () => {}
    },
    legendConfig: {
      type: Object,
      default: () => {}
    },
    series: {
      type: Array,
      required: true
    }
  },

  watch: {
    // series: {
    //   handler: function name(value) {
    //     const lineChart = this.$refs.lineChart.chart;
    //     const { data } = value[0];
    //     const diff = value.length - lineChart.series.length;
    //     if (diff === 0 && data === this.seriesData) return;
    //     while (lineChart.series.length > 0) {
    //       lineChart.series[0].remove(true);
    //     }
    //     for (let i = 0; i < value.length; i++) {
    //       lineChart.addSeries(value[i]);
    //     }
    //     this.seriesData = data;
    //   },
    //   deep: true
    // }
  },
  data() {
    return {
      // seriesData: this.series[0].data,
      chartOptions: {
        chart: {
          ...this.basicConfig
        },
        title: {
          ...this.titleConfig
        },
        legend: {
          ...this.legendConfig
        },
        tooltip: {
          ...this.tooltipConfig
        },
        xAxis: {
          ...this.xAxisConfig
        },
        yAxis: [
          {
            labels: {
              format: "{value}"
            },
            title: {
              text: undefined
            },
            ...this.yAxisConfig
          },
          {
            labels: {
              format: "{value}"
            },
            title: {
              text: undefined
            },
            opposite: true,
            ...this.yAxisConfig
          }
        ],
        credits: {
          enabled: false
        },
        plotOptions: {
          series: {},
          ...this.plotOptions
        },
        series: [
          {
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6],
            name: "加總",
            lineColor: "#7e7e7e",
            color: "#7e7e7e",
            fillColor: "rgba(238, 238, 238, 0.5)",
            yAxis: 1
          },
          {
            data: [29.9, 21.5, 6.4, 29.2, 14.0, 16.0, 15.6],
            lineColor: "#ea84b4",
            color: "#ea84b4",
            fillColor: "transparent"
          }
        ]
      }
    };
  }
};
</script>

<style lang="scss">
#line-chart {
  .highcharts-legend-item .highcharts-graph {
    display: none;
  }
}

.highcharts-container {
  margin: 0 auto;
}
</style>
