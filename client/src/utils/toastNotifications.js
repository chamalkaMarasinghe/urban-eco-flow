import { toast } from 'react-toastify';

const showToast = (type, message) => {
  switch (type) {
    case 'success':
      toast.success(message, {
        style: { fontSize: '14px', backgroundColor: "white" }
      });
      break;
    case 'error':
      toast.error(message, {
        style:{ fontSize: '14px', backgroundColor: "white" }
      });
      break;
    case 'info':
      toast.info(message,{
        style: { fontSize: '14px', backgroundColor: "white" }
      });
      break;
    case 'warning':
      toast.warning(message, {
        style: { fontSize: '14px', backgroundColor: "white" }
      });
      break;
    case 'caution':
      toast.warning(message, {
        style: { fontSize: '14px', backgroundColor: "white" },
        // autoClose: 30000
      });
      break;
    default:
      toast(message, {
        style: { fontSize: '14px', backgroundColor: "white" }
      });
      break;
  }
};

export default showToast;
