import { useState } from "react";
import { useIsomorphicLayoutEffect, useWindowSize } from "react-use";

const useIsDesktop = (desktopSize = 1024): boolean => {
  const { width } = useWindowSize();
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useIsomorphicLayoutEffect(() => {
    setIsDesktop(width >= desktopSize);
  }, [width]);

  return isDesktop;
};

export default useIsDesktop;
