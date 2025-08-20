import React, { useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsAccessibility from "highcharts/modules/accessibility";

HighchartsMore(Highcharts);
HighchartsExporting(Highcharts);
HighchartsAccessibility(Highcharts);

function BubbleChart({ t, onSourceClick }) {
  useEffect(() => {
    if (t && Object.keys(t).length > 0) {
      const seriesData = Object.entries(t).map(([name, value]) => ({
        name,
        value,
        color: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
          Math.random() * 256
        )}, ${Math.floor(Math.random() * 256)}, 0.7)`,
      }));

      Highcharts.chart("container", {
        chart: {
          type: "packedbubble",
          height: "80%",
        },
        title: {
          text: "Themes",
        },
        tooltip: {
          useHTML: true,
          pointFormat: "<b>{point.name}:</b> {point.value}",
        },
        plotOptions: {
          packedbubble: {
            minSize: "55%",
            maxSize: "100%",
            zMin: 0,
            zMax: 1000,
            layoutAlgorithm: {
              splitSeries: false,
              gravitationalConstant: 0.02,
            },
            dataLabels: {
              enabled: true,
              format: "{point.name}",
              filter: {
                property: "y",
                operator: ">",
                value: 0.1,
              },
              style: {
                color: "black",
                textOutline: "none",
                fontWeight: "bold",
                fontSize: "14px",
              },
              inside: false,
              crop: false,
              overflow: "none",
            },
          },
        },
        series: [
          {
            name: "Data",
            color: "#FF6B00",
            data: seriesData,
            point: {
              events: {
                click: function () {
                  const clickedSource = this.name;
                  onSourceClick(clickedSource);
                },
              },
            },
          },
        ],
      });
    }
  }, [t, onSourceClick]);
  return (
    <div
      id="container"
      style={{
        minWidth: "300px",
        maxWidth: "5000px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
      }}
    ></div>
  );
}

export default BubbleChart;
