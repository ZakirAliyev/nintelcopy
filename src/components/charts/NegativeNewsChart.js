import React from "react";
import ReactApexChart from "react-apexcharts";

const NegativeNewsChart = ({ countsData }) => {
    if (!countsData || Object.keys(countsData.positive).length === 0) {
        return null;
      }
  const chartData = {
    series: [
      {
        name: "Negative news count",
        data: countsData && Object.values(countsData.negative),
      },
    ],
    options: {
      chart: {
        type: "area",
        height: 340,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: countsData && Object.keys(countsData.negative),
        
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
      colors: ["#ef3b42"], 
    },
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="area"
        height={340}
      />
    </div>
  );
};

export default NegativeNewsChart;
