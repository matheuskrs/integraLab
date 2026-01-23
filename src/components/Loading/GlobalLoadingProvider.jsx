import { useRef, useState } from "react";
import GlobalLoadingOverlay from "./GlobalLoadingOverlay";
import "./globalLoading.css";
import { GlobalLoadingContext } from "./GlobalLoadingContext";

export function GlobalLoadingProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState("");

  const countRef = useRef(0);
  const intervalRef = useRef(null);
  const baseTextRef = useRef("");

  const showLoading = (loadingText = "") => {
    countRef.current++;
    setVisible(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!loadingText) {
      baseTextRef.current = "";
      setText("");
      return;
    }

    baseTextRef.current = loadingText;
    let dots = 0;
    setText(baseTextRef.current);

    intervalRef.current = setInterval(() => {
      dots = (dots + 1) % 4;
      setText(baseTextRef.current + ".".repeat(dots));
    }, 400);
  };

  const hideLoading = () => {
    if (countRef.current === 0) return;
    countRef.current--;
    if (countRef.current > 0) return;

    setVisible(false);
    setText("");

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <GlobalLoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      <GlobalLoadingOverlay visible={visible} text={text} />
    </GlobalLoadingContext.Provider>
  );
}
