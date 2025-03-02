import { useEffect } from "react";

export const useScrollLock = () => {
  const enableBodyScroll = () => {
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "0";
  };

  const disableBodyScroll = () => {
    document.body.style.overflow = "hidden";
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  };

  useEffect(() => {
    return () => {
      enableBodyScroll();
    };
  }, []);

  return { enableBodyScroll, disableBodyScroll };
};
