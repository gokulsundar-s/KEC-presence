import { EmptyIcon } from "../../../../Assets/Icons";
import "./NotificationDropdown.css";

export default function NotificationDropdown({ notifications }) {
  return (
    <div className="notification-dropdown">
      {notifications.length ? (
        <p>No new notifications</p>
      ) : (
        <div className="notification-dropdown-no-notifications">
          <EmptyIcon />
          <p>No new notifications</p>
        </div>
      )}
    </div>
  );
}
