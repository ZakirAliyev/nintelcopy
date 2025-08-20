import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const DoughnutChartCompare = ({ countsData }) => {
  const [chartSeries, setChartSeries] = useState([0, 0, 0]);

  useEffect(() => {
    if (!countsData) {
      return;
    }

    const { positive, neutral, negative } = countsData;

    const totalPositive = Object.values(positive).reduce(
      (acc, cur) => acc + cur,
      0
    );
    const totalNeutral = Object.values(neutral).reduce(
      (acc, cur) => acc + cur,
      0
    );
    const totalNegative = Object.values(negative).reduce(
      (acc, cur) => acc + cur,
      0
    );

    setChartSeries([totalPositive, totalNeutral, totalNegative]);
  }, [countsData]);

  if (!countsData) {
    return null;
  }

  const chartOptions = {
    chart: {
      width: 380,
      type: "pie",
    },
    labels: ["Positive", "Neutral", "Negative"],
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    legend: {
      labels: {
        colors: ["#23b24b", "#e4aa1d", "#ef3b42"],
      },
    },
    colors: ["#23b24b", "#e4aa1d", "#ef3b42"],
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="pie"
        width={350}
      />
    </div>
  );
};

export default DoughnutChartCompare;
