// helper function to generate query params for API requests
export const generateQueryParams = (params, additionalParams = {}) => {
  const queryParts = [];

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParts.push(`${key}=${value}`);
    }
  });

  Object.entries(additionalParams || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParts.push(`${key}=${value}`);
    }
  });

  return queryParts.length > 0 ? `&${queryParts.join("&")}` : "";
};
