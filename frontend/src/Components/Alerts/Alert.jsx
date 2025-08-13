import { ErrorAlertIcon, SuccessAlertIcon } from "../../Assets/Icons";

import { toast } from "react-toastify";

export const showErrorToast = (message) => {
  toast.error(message, {
    style: {
      fontFamily: "Poppins",
      color: "#fff",
      backgroundColor: "#e74d3c",
      border: "1px solid #e74d3c",
      lineHeight: "1.5",
    },
    icon: <ErrorAlertIcon />,
  });
};

export const showSuccessToast = (message) => {
  toast.success(message, {
    style: {
      fontFamily: "Poppins",
      color: "#fff",
      backgroundColor: "#00593f",
      border: "1px solid #00593f",
      lineHeight: "1.5",
    },
    icon: <SuccessAlertIcon />,
  });
};
