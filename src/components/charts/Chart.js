import React, { useState, useEffect, memo } from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart2 = ({ source, loading }) => {
  const [chartData, setChartData] = useState({
    series: [{ name: "Count", data: [] }],
    options: {
      chart: {
        height: 350,
        type: "bar",
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val;
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["white"],
        },
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: "#adb5bd",
          },
        },

        position: "top",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
        },
      },
      title: {
        text: "Top 12 News Sources",
        floating: true,
        offsetY: 330,
        align: "center",
        style: {
          color: "#444",
        },
      },
    },
  });

  useEffect(() => {
    const top12Sources =
      source &&
      Object.entries(source)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 12);

    const [categories, data] = top12Sources.reduce(
      (acc, [source, count]) => {
        acc[0].push(source);
        acc[1].push(count);
        return acc;
      },
      [[], []]
    );

    setChartData((prevData) => ({
      ...prevData,
      series: [{ name: "Count", data }],
      options: {
        ...prevData.options,
        xaxis: {
          ...prevData.options.xaxis,
          categories,
        },
      },
    }));
  }, [source]);
  if (loading) {
    return <div className="skeleton  rounded-[4px]"></div>;
  }
  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={320}
        />
      </div>
    </div>
  );
};

export default memo(ApexChart2);
