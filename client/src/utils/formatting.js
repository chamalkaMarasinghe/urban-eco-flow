export const capitalize = (input) => {

  if (!input || input?.toString()?.trim()?.length < 0) return null;

  return input
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" ");
};

export const currencyFormatter = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "PLN",
});

export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) {
    return "0.00"; // Default to 0.00 for undefined or null
  }
  return amount.toString().includes(".") 
    ? amount 
    : `${amount}.00`; // Add .00 if no decimal is present
};