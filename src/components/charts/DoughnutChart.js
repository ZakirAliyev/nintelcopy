import React, { useEffect, useState, memo } from "react";
import ReactApexChart from "react-apexcharts";
const DoughnutChart = ({ sentiment }) => {
  const chartSentiment = sentiment;
  const [chartSeries, setChartSeries] = useState([0, 0, 0]);
  useEffect(() => {
    if (!chartSentiment) {
      return;
    }
    const seriesData = [
      chartSentiment.positive || 0,
      chartSentiment.neutral || 0,
      chartSentiment.negative || 0,
    ];
    setChartSeries(seriesData);
  }, [chartSentiment]);

  if (!sentiment || Object.values(sentiment).every((value) => value === 0)) {
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

export default memo(DoughnutChart);
