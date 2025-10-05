import { orderStatus } from "../constants/commonConstants";

export const getOrderStatusColor = (status) => {
  if ([orderStatus.ORDER_IN_PROGRESS].includes(status)) {
    return "#219653";
  } else if ([orderStatus.ORDER_DELIVERED].includes(status)) {
    return "#6A1B9A";
  } else if (
    [orderStatus.IN_REVISION, orderStatus.COMPLAINT_RAISED].includes(status)
  ) {
    return "#F2C94C ";
  } else if ([orderStatus.COMPLETED].includes(status)) {
    return "#2F80ED";
  } else if ([orderStatus.ISSUE_RESOLVED].includes(status)) {
    return "#27AE60";
  } else {
    return "#219653";
  }
};
