import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// NOTE: Example return - "Jul 31, 04:45 PM"
export const formatOrderCreatedDate = (dateString) => {
  if (!dateString || isNaN(new Date(dateString))) {
    return "-";
  }
  return dayjs.utc(dateString).tz(dayjs.tz.guess()).format("MMM D, hh:mm A");
};

// NOTE: Example return - "2025-07-31"
export const formatYYYY_MM_DD = (dateString) => {
  if (!dateString || isNaN(new Date(dateString))) {
    return "-";
  }
  return dayjs.utc(dateString).tz(dayjs.tz.guess()).format("YYYY-MM-DD");
};

// NOTE: Example return - "2025-Jul-31"
export const formatYYYY_MMM_DD = (dateString) => {
  if (!dateString || isNaN(new Date(dateString))) {
    return "-";
  }
  return dayjs.utc(dateString).tz(dayjs.tz.guess()).format("YYYY-MMM-DD");
};

// NOTE: Example return - "2025-07-31 04:45 PM"
export const formatYYYY_MM_DD_HH_MM_A = (dateString) => {
  if (!dateString || isNaN(new Date(dateString))) {
    return "-";
  }
  return dayjs.utc(dateString).tz(dayjs.tz.guess()).format("YYYY-MM-DD hh:mm A");
};

// NOTE: Example return - "04:45 PM"
export const formatHH_MM_SS = (dateString) => {
  if (!dateString || isNaN(new Date(dateString))) {
    return "-";
  }
  return dayjs.utc(dateString).tz(dayjs.tz.guess()).format("hh:mm A");
};

// NOTE: Example return - "July"
export const format_MMMM = (dateString) => {
  if (!dateString || isNaN(new Date(dateString))) {
    return "-";
  }
  return dayjs.utc(dateString).tz(dayjs.tz.guess()).format("MMMM");
};

// NOTE: // e.g. "August 10" 
export const format_MMMM_DD = (dateString) => {
  // checks for valid js dates
  if (!dateString || isNaN(new Date(dateString))) {
    return "-";
  }
  return dayjs.utc(dateString).tz(dayjs.tz.guess()).format("MMMM D");
};

// NOTE: Example return - "Jul 31, 2025"
export const format_MM_DD_YYYY = (dateString) => {
  if (!dateString || isNaN(new Date(dateString))) {
    return "-";
  }
  return dayjs.utc(dateString).tz(dayjs.tz.guess()).format("MMM D, YYYY");
};

// NOTE: Example return - "July 31, 2025, 4:45 PM"
export const formatPaymentDate = (dateString) => {
  if (!dateString || isNaN(new Date(dateString))) {
    return "-";
  }
  return dayjs.utc(dateString).tz(dayjs.tz.guess()).format("MMMM D, YYYY, h:mm A");
};

// NOTE: Example return - "Thursday"
export const getDayOfWeek = (dateString) => {
  if (!dateString || isNaN(new Date(dateString))) {
    return "-";
  }
  return dayjs.utc(dateString).tz(dayjs.tz.guess()).format("dddd");
};

// NOTE: Example return - "2025/07/31 04:45 PM"
export const formatIndicatorDate = (dateString) => {
  if (!dateString || isNaN(new Date(dateString))) {
    return "-";
  }
  return dayjs.utc(dateString).tz(dayjs.tz.guess()).format("YYYY/MM/DD hh:mm A");
};

// NOTE: Example return - "14:00"
export const formatHH_MM = (dateString) => {
  if (!dateString || isNaN(new Date(dateString))) {
    return "-";
  }
  return dayjs.utc(dateString).tz(dayjs.tz.guess()).format("HH:mm");
};

// NOTE: Example return - "Today" or "Yesterday" or "July 30, 2025"
export const formatChatDate = (dateString) => {
  if (!dateString || isNaN(new Date(dateString))) return "-";

  const messageDate = dayjs.utc(dateString).tz(dayjs.tz.guess());
  const now = dayjs();
  const startOfToday = now.startOf("day");
  const startOfYesterday = now.subtract(1, "day").startOf("day");

  if (messageDate.isAfter(startOfToday)) return "Today";
  if (messageDate.isAfter(startOfYesterday)) return "Yesterday";

  return messageDate.format("MMMM DD, YYYY");
};

// NOTE: Example return - 2.5 (hours)
export const getDurationInHours = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (!start.isValid() || !end.isValid()) return 0;

  const diffInHours = end.diff(start, 'hour', true);
  return Math.max(0, diffInHours);
};

// NOTE: Example return - "2h 30m"
export const getDurationLabel = (startDate, endDate) => {
  if (!startDate || !endDate) return "0h";

  const start = dayjs(startDate);
  const end = dayjs(endDate);

  if (!start.isValid() || !end.isValid()) return "0h";

  const totalMinutes = end.diff(start, 'minute');
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
};

// NOTE: Example return - true if eventEndDate is before current datetime, otherwise false
export const isEventExpired = (eventEndDate) => {
  if (!eventEndDate || isNaN(new Date(eventEndDate))) {
    return false;
  }

  const localEventEnd = dayjs.utc(eventEndDate).tz(dayjs.tz.guess());
  const now = dayjs();

  return localEventEnd.isBefore(now);
};
