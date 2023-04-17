import { useState } from "react";

export const useVisible = (initialState = false) => {
  const [visible, setVisible] = useState(initialState);

  const openDialog = () => {
    setVisible(true);
  };

  const closeDialog = () => {
    setVisible(false);
  };

  return { visible, openDialog, closeDialog };
};
