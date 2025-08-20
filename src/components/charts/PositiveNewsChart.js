import React from "react";
import ReactApexChart from "react-apexcharts";

const PositiveNewsChart = ({ countsData }) => {
  if (!countsData || Object.keys(countsData.positive).length === 0) {
    return null;
  }

  const chartData = {
    series: [
      {
        name: "Positive news count",
        data: countsData && Object.values(countsData.positive),
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
        categories: countsData && Object.keys(countsData.positive),
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
      colors: ["#23b24b"],
    },
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={chartData && chartData.options}
        series={chartData && chartData.series}
        type="area"
        height={340}
      />
    </div>
  );
};

export default PositiveNewsChart;
