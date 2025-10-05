// ScrollToTop.jsx
import { useEffect } from "react";
import { useNavigation, useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navigation = useNavigation();

  useEffect(() => {
    if (navigation.state === "idle") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [pathname, navigation.state]);

  return null;
}
