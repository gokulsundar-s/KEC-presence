import { CardsUserIcon } from "../Assets/Icons";
import { getGenericCodeNameByValue } from "./GenericCodeServices";

export const formatDateTime = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  const formatted =
    String(date.getDate()).padStart(2, "0") +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    date.getFullYear() +
    " " +
    date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return formatted;
};

export const formateDuration = (durationInMinutes) => {
  if (durationInMinutes == null) return "-";

  if (typeof durationInMinutes === "string") {
    const startTime = new Date(durationInMinutes);
    if (isNaN(startTime.getTime())) return "-";

    const now = new Date();
    const diffInMs = now - startTime;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours}H ${minutes}M`;
  }

  if (isNaN(durationInMinutes)) return "-";
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  return `${hours}h ${minutes}m`;
};

export const formatTags = (tagValue) => {
  if (!tagValue) return "-";
  const color = {
    Active: "#005a3e",
    Inactive: "#b20000",
    Student: "#004085",
    "Class Advisor": "#065f4b",
    "Year Incharge": "#b5590e",
    "Head of Department": "#8a198f",
    Admin: "#a61b1b",
  };

  const backgroundColor = {
    Active: "#d1fae5",
    Inactive: "#f8d7da",
    Student: "#cce5ff",
    "Class Advisor": "#d1fae5",
    "Year Incharge": "#fef3c7",
    "Head of Department": "#fae8ff",
    Admin: "#fee2e2",
  };

  return (
    <div
      className="tag-badge"
      style={{
        color: color[tagValue] || "var(--secondary-color)",
        backgroundColor: backgroundColor[tagValue] || "var(--primary--color)",
      }}
    >
      {tagValue}
    </div>
  );
};

export const dashboardCountFormatter = (dashboardData, type) => {
  if (!dashboardData) return [];

  return Object.entries(dashboardData)
    .filter(([key]) => key !== "ADMIN")
    .map(([key, value]) => ({
      icon: type === "USERS" ? <CardsUserIcon /> : null,
      count: value,
      headingText: getGenericCodeNameByValue(key),
    }));
};
