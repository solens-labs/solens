import { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const { name } = useParams();

  useEffect(() => {
    if (pathname !== "/collections" || pathname !== `/nfts/${name}`) {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  }, [pathname]);

  return null;
}
