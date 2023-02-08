class AreaChartConfig {
  basicConfig(height, spacing = [0, 0, 0, 0]) {
    return {
      type: "area",
      height,
      spacing
    };
  }
  titleConfig() {
    return {
      text: undefined
    };
  }
  xAxisConfig(categories) {
    return {
      gridLineWidth: 0,
      categories,
      startOnTick: true,

      crosshair: {
        width: 1,
        color: "#dddddd"
      },
      labels: {
        formatter: function() {
          return this.value.xAxis;
        },
        align: "center",
        overflow: "allow",
        style: {
          fontFamily: "Arial",
          fontSize: "12px",
          fontWeight: "normal",
          color: "#7E7E7E",
          lineHeight: "12px"
        }
      }
    };
  }
  yAxisConfig(formatter = null) {
    return {
      allowDecimals: false,
      title: {
        text: undefined
      },
      lineWidth: 0,
      gridLineWidth: 1,
      gridLineColor: "#e2e1e1"
    };
  }

  tooltipConfig() {
    return {
      crosshairs: true,
      borderRadius: 4,
      className: "tooltip",
      borderColor: "#a9a9a9",
      padding: 12,
      style: {
        fontFamily:
          "'Arial', 'MsJhengHeiBold', '微軟正黑體', 'Microsoft JhengHei'",
        fontSize: "12px",
        lineHeight: "20px"
      },
      headerFormat: "<b>{point.x.tooltip}</b><br/>",
      pointFormatter() {
        let AllSeries = this.series.chart.series;
        let thisSeriesIndex = this.series.index;
        let pointIndex = this.index;
        let tmp = "";
        AllSeries.forEach(singleSeries => {
          if (!singleSeries.visible) return;

          let color = singleSeries.color;
          let name = singleSeries.name;
          let pointData = singleSeries.yData[pointIndex];

          if (singleSeries.index === thisSeriesIndex) {
            tmp += `<span style="color: ${color}">\u25CF</span><b> ${name}: ${pointData}</b><br/>`;
          } else {
            tmp += `<span style="color: ${color}">\u25CF</span><span> ${name}: ${pointData}</span><br/>`;
          }
          singleSeries.setState("hover");
        });
        return tmp;
      }
    };
  }

  plotOptions() {
    return {
      series: {
        marker: {
          enabled: false,
          symbol: "circle"
        },
        dataLabels: {
          enabled: false,
          align: "left",
          verticalAlign: "middle",
          style: {
            fontFamily:
              "'Arial', 'MsJhengHeiBold', '微軟正黑體', 'Microsoft JhengHei'",
            fontSize: "12px",
            fontWeight: "normal",
            color: "#99cef0",
            textOutline: "none"
          },
          allowOverlap: true,
          crop: false,
          overflow: "allow",
          formatter() {
            return this.series.name;
          }
        }
      }
    };
  }
  legendConfig() {
    return {
      enabled: false
    };
  }
  series(series) {
    return series;
  }
}

const areaChartConfig = new AreaChartConfig();

export default areaChartConfig;
