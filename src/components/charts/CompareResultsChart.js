import React, { useEffect, useState, useRef } from "react";
import ReactApexChart from "react-apexcharts";

const CompareResultsChart = ({ countsData }) => {
  const [chartSeries, setChartSeries] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const chartRef = useRef(null);

  useEffect(() => {
    if (!countsData) {
      return;
    }

    const keywords = Object.keys(countsData.positive);
    const seriesData = [];

    keywords.forEach((keyword) => {
      const totalPositive = countsData.positive[keyword] || 0;
      const totalNeutral = countsData.neutral[keyword] || 0;
      const totalNegative = countsData.negative[keyword] || 0;
      const total = totalPositive + totalNeutral + totalNegative;
      seriesData.push(total);
    });

    const getRandomColor = () => {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    const colors = keywords.map(() => getRandomColor());

    const optionsData = {
      chart: {
        type: "pie",
      },
      labels: keywords,
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
          colors: colors,
        },
      },
      colors: colors,
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    };

    setChartSeries(seriesData);
    setChartOptions(optionsData);

    const handleResize = () => {
      if (chartRef.current && chartRef.current.chart) {
        const chart = chartRef.current.chart;
        chart.updateOptions({
          chart: {
            width: chartRef.current.clientWidth,
            height: chartRef.current.clientHeight,
          },
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [countsData]);

  if (!countsData) {
    return null;
  }

  return (
    <div ref={chartRef} >
      <ReactApexChart options={chartOptions}       width={380} series={chartSeries} type="pie" />
    </div>
  );
};

export default CompareResultsChart;
