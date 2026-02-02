import { useEffect, useRef } from "react";
import { useNavigation } from "react-router-dom";
import { useGlobalLoading } from "~/providers/GlobalLoading/GlobalLoadingContext";

const MIN_DURATION = 2500;

export function RouterNavigationLoading() {
  const navigation = useNavigation();
  const { showLoading, hideLoading } = useGlobalLoading();

  const wasLoading = useRef(false);
  const startTimeRef = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const isNavigating = navigation.state !== "idle";
    if (isNavigating && !wasLoading.current) {
      wasLoading.current = true;
      startTimeRef.current = Date.now();
      return;
    }

    if (!isNavigating && wasLoading.current) {
      wasLoading.current = false;

      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, MIN_DURATION - elapsed);

      timeoutRef.current = setTimeout(() => {
        hideLoading();
        timeoutRef.current = null;
      }, remaining);
    }
  }, [navigation.state, showLoading, hideLoading]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return null;
}
