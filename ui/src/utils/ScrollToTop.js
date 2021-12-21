import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/collections") {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  }, [pathname]);

  return null;
}
