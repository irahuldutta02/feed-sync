import { useEffect, useRef, useCallback } from "react";

// eslint-disable-next-line no-unused-vars
type AnyFunction = (..._args: unknown[]) => unknown;

export const useDebounce = <T extends AnyFunction>(
  callback: T,
  delay: number
): T => {
  const timeoutIdRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
      }
      timeoutIdRef.current = window.setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback as T;
};
