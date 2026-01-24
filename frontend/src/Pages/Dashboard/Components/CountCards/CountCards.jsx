import "./CountCards.css";

export default function CountCards({ dashboardCountData }) {
  return (
    <>
      {dashboardCountData.map((dataItem, index) => (
        <div key={index} className="dashboard-count-card">
          {dataItem.icon}
          <p
            className="dashboard-count-card-count-text"
          >
            {dataItem?.count < 10 ? `0${dataItem.count}` : dataItem.count || 0}
          </p>
          <p
            className="dashboard-count-card-heading-text"
          >
            {dataItem.headingText}
          </p>
        </div>
      ))}
    </>
  );
}
