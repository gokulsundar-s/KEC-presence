import ApexChart from "react-apexcharts";
import "./LineGraph.css";

export default function LineGraph() {
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
      categories: [
        "12 AM",
        "1 AM",
        "2 AM",
        "3 AM",
        "4 AM",
        "5 AM",
        "6 AM",
        "7 AM",
        "8 AM",
        "9 AM",
        "10 AM",
        "11 AM",
        "12 PM",
        "1 PM",
        "2 PM",
        "3 PM",
        "4 PM",
        "5 PM",
        "6 PM",
        "7 PM",
        "8 PM",
        "9 PM",
        "10 PM",
        "11 PM",
        "12 AM",
      ],
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
      data: [
        12, 8, 5, 3, 2, 5, 15, 35, 58, 78, 92, 105, 118, 134, 142, 128, 110, 95,
        78, 65, 48, 35, 25, 18,
      ],
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
