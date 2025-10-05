// FUNCTION: convert time from 12hr to 24hr format
const convertTo24HourFormat = (timeStr) => {
  if (!timeStr) return "";

  // Check if the time is already in 24-hour format (no AM/PM)
  if (
    !timeStr.toLowerCase().includes("am") &&
    !timeStr.toLowerCase().includes("pm")
  ) {
    return timeStr; // Already in 24-hour format
  }

  const isPM = timeStr.toLowerCase().includes("pm");
  const isAM = timeStr.toLowerCase().includes("am");

  // Remove AM/PM designation
  let time = timeStr
    .toLowerCase()
    .replace(/\s?(am|pm)/i, "")
    .trim();

  // Split hours and minutes
  let [hours, minutes] = time.split(/[.:]/);
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  // Convert to 24-hour format
  if (isPM && hours < 12) {
    hours += 12;
  } else if (isAM && hours === 12) {
    hours = 0;
  }

  // Format with leading zeros
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
};

export default convertTo24HourFormat;