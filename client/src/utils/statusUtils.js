import { IGNORED_STATUSES } from "../constants/commonConstants"

export const overRideStatus = (orderData, role) => {

  if (!orderData || !orderData.orderProgress || orderData.orderProgress.length === 0) {
    return orderData?.status;
  }

  const ignoredStatuses = IGNORED_STATUSES[role];

  if (ignoredStatuses.includes(orderData?.status)) {
    const validStatus = orderData.orderProgress
      .slice()
      .reverse()
      .find((progress) => !ignoredStatuses.includes(progress?.progressStatus));

    return validStatus ? validStatus.progressStatus : orderData?.status;
  }

  return orderData?.status;
};
