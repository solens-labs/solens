import { useHistory } from "react-router-dom";
import { useEffect } from "react";

/*
 * Registers a history listener on mount which
 * scrolls to the top of the page on route change
 */
const useScrollTop = () => {
  const history = useHistory();
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return unlisten;
  }, [history]);
};

export default useScrollTop;
