import { useCallback, useState } from "react";

export const useConfirmation = () => {
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    options: {},
    resolve: null,
  });

  const requestConfirmation = useCallback((options = {}) => {
    return new Promise((resolve) => {
      setConfirmation({ isOpen: true, options, resolve });
    });
  }, []);

  const confirm = () => {
    if (confirmation.resolve) confirmation.resolve(true);
    setConfirmation({ isOpen: false, options: {}, resolve: null });
  };

  const cancel = () => {
    if (confirmation.resolve) confirmation.resolve(false);
    setConfirmation({ isOpen: false, options: {}, resolve: null });
  };

  return {
    requestConfirmation,
    confirmation,
    confirm,
    cancel,
  };
};
