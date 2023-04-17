import { useState } from "react";

const useHover = () => {
  const [isHover, setIsHover] = useState(false);

  const onMouseOver = () => setIsHover(true);
  const onMouseOut = () => setIsHover(false);

  return { isHover, hoverProps: { onMouseOver, onMouseOut } };
};

export default useHover;
