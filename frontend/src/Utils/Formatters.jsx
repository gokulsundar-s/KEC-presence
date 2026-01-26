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

export const formatDate = (dateString) => {
  if (!dateString) return "-";
  return dateString.split("T")[0].split("-").reverse().join("-");
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
    ACTIVE: "#005a3e",
    INACTIVE: "#b20000",
    STUDENT: "#004085",
    ADVISOR: "#065f4b",
    INCHARGE: "#b5590e",
    HOD: "#8a198f",
    ADMIN: "#a61b1b",
    OD: "#055160",
    PENDING: "#856404",
    LEAVE: "#ff5500",
  };

  const backgroundColor = {
    ACTIVE: "#d1fae5",
    INACTIVE: "#f8d7da",
    STUDENT: "#cce5ff",
    ADVISOR: "#d1fae5",
    INCHARGE: "#fef3c7",
    HOD: "#fae8ff",
    ADMIN: "#fee2e2",
    OD: "#e0f2fe",
    PENDING: "#fff3cd",
    LEAVE: "#fff0e1",
  };

  return (
    <div
      className="tag-badge"
      style={{
        color: color[tagValue] || "var(--secondary-color)",
        backgroundColor: backgroundColor[tagValue] || "var(--primary--color)",
      }}
    >
      {getGenericCodeNameByValue(tagValue)}
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
