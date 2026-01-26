import ApexChart from "react-apexcharts";
import "./BarGraph.css";

export default function BarGraph({ data }) {
  const departments = data ? Object.keys(data) : [];

  const advisorData = departments.map((dept) => data[dept].ADVISOR || 0);
  const inchargeData = departments.map((dept) => data[dept].INCHARGE || 0);
  const studentData = departments.map((dept) => data[dept].STUDENT || 0);
  const hodData = departments.map((dept) => data[dept].HOD || 0);

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
      categories: departments,
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
    colors: ["#1f2937", "#5e6a78", "#9197a2", "#b8bdc4"],
  };

  const chartSeries = [
    {
      name: "Students",
      data: studentData,
    },
    {
      name: "Advisor",
      data: advisorData,
    },
    {
      name: "Incharge",
      data: inchargeData,
    },
    {
      name: "HOD",
      data: hodData,
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
