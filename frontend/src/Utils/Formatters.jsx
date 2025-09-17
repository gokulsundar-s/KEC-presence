export const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  const date = dateString.split(",")[0];
  const time = dateString.split(",")[1].trim().split(" ")[0];
  const meridiem = dateString.split(",")[1].trim().split(" ")[1].toUpperCase();
  return `${date} ${time} ${meridiem}`;
};
