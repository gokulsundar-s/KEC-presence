import ApexChart from "react-apexcharts";
import "./BarGraph.css";

export default function BarGraph() {
  const chartOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 5,
      },
    },
    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
    colors: ["#1f2937", "#5e6a78", "#9197a2"],
  };

  const chartSeries = [
    {
      name: "Class Advisor",
      data: [25, 28, 26, 27, 29, 28, 30, 29, 31, 32, 30, 31],
    },
    {
      name: "Incharge",
      data: [18, 20, 19, 21, 22, 21, 23, 22, 24, 25, 23, 24],
    },
    {
      name: "Students",
      data: [150, 165, 160, 172, 180, 175, 185, 182, 190, 195, 188, 192],
    },
  ];

  return (
    <div className="bar-graph-container">
      <ApexChart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={350}
      />
    </div>
  );
}
