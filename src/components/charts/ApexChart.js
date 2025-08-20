import React from "react";
import ReactApexChart from "react-apexcharts";

class ApexChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        chart: {
          height: 350,
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
              colors: "#444"
            }
          }
        },
        tooltip: {
          x: {
            format: "dd/MM/yy HH:mm",
          },
        },
      },
      series: [], 
    };
  }


  componentDidUpdate(prevProps) {
    const { newsCountByDate } = this.props;

    if (newsCountByDate !== prevProps.newsCountByDate) {
      const categories = Object.keys(newsCountByDate);
      const dataValues = Object.values(newsCountByDate);

      this.setState({
        series: [
          {
            name: "Daily news count",
            data: dataValues,
          },
        ],
        options: {
          ...this.state.options,
          xaxis: {
            categories: categories,
          },
        },
      });
    }
  }

  render() {
    const { loading } = this.props;

    return (
      <div id="chart">
        {loading ? (
          <div className="skeleton  rounded-[4px]"></div>
        ) : (
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="area"
            height={300}
          />
        )}
      </div>
    );
  }
}

export default ApexChart;
