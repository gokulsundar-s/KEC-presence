import ApexChart from "react-apexcharts";
import "./LineGraph.css";

export default function LineGraph({ data }) {
  console.log("data", data);

  const chartOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: data && Object.keys(data),
    },
    yaxis: {
      decimalsInFloat: 1,
    },

    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
    colors: ["var(--primary-color)"],
    markers: {
      size: 3,
      hover: {
        size: 5,
      },
    },
  };

  const chartSeries = [
    {
      name: "Login Count",
      data: data && Object.values(data),
    },
  ];

  return (
    <div className="line-graph-container">
      <ApexChart
        options={chartOptions}
        series={chartSeries}
        type="area"
        height={350}
      />
    </div>
  );
}
