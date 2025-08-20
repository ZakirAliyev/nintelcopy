import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

function SplineChart(props) {
  const [options, setOptions] = useState({
    chart: {
      height: 340,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "category",
      categories: [],
      labels: {
        style: {
          colors: "#fff",
        },
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  });
  const [series, setSeries] = useState([]);

  useEffect(() => {
    if (props.results) {
      const categories = Object.keys(props.results);
      const seriesData = Object.values(props.results).map(
        (result) => result.length
      );
      setOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: { ...prevOptions.xaxis, categories },
      }));
      setSeries(seriesData);
    }
  }, [props.results]);

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={[{ data: series }]}
          type="area"
          height={340}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
}

export default SplineChart;
