import { ProfileIcon, NotificationIcon } from "../../../../Assets/Icons";
import "./Header.css";
export default function Header() {
  var userName = "Gokulsundar S";
  return (
    <div className="header-container">
      <div className="header-right-container"></div>
      <div className="header-left-container">
        <div className="header-notification-container">
          <NotificationIcon />
        </div>
        <button className="header-profile-container">
          <ProfileIcon />
          <p>{userName}</p>
        </button>
      </div>
    </div>
  );
}
