import { formatDistanceToNow } from "date-fns";

const capitalizeText = (text) => {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

const TimeAgo = ({ date }) => {
  if (!date) return ""; // Handle missing date   

  const parsedDate = new Date(date); // Convert string to Date object
  if (isNaN(parsedDate)) return ""; // Handle invalid date

  const timeAgo = formatDistanceToNow(parsedDate, { addSuffix: true });

  return <span>{capitalizeText(timeAgo)}</span>;
};

export default TimeAgo;
