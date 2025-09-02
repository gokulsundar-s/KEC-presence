import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";

export default function HolidayCalendar() {
  const localizer = momentLocalizer(moment);

  // Sample events with W, H, L as titles
  const events = [
    {
      title: "W", // e.g., Work from home
      start: new Date(2025, 8, 1), // September is month 8 (0-indexed)
      end: new Date(2025, 8, 1),
    },
    {
      title: "H", // e.g., Holiday
      start: new Date(2025, 8, 5),
      end: new Date(2025, 8, 5),
    },
    {
      title: "L", // e.g., Leave
      start: new Date(2025, 8, 12),
      end: new Date(2025, 8, 12),
    },
  ];

  return (
    <div className="page-container">
      <p className="page-header">Holiday Calendar</p>

      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["month"]}
        />
      </div>
    </div>
  );
}
