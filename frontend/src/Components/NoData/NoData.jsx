import { NoDataIcon } from "../../Assets/Icons";
import "./NoData.css";

export default function NoData() {
  return (
    <div className="no-data-container">
      <div className="no-data-icon">
        <NoDataIcon />
      </div>
      <p className="no-data-text">No Records Found</p>
    </div>
  );
}
