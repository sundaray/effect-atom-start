import { useEffect, useRef, useState } from "react";

export interface SpinDelayOptions {
  /**
   * The delay in milliseconds before the spinner is displayed.
   * @default 500
   */
  delay?: number;
  /**
   * The minimum duration in milliseconds the spinner is displayed.
   * @default 200
   */
  minDuration?: number;
}

export const defaultOptions: Required<SpinDelayOptions> = {
  delay: 500,
  minDuration: 200,
};

type State = "IDLE" | "DELAY" | "DISPLAY" | "EXPIRE";

export function useSpinDelay(
  loading: boolean,
  options?: SpinDelayOptions,
): boolean {
  const { delay, minDuration } = { ...defaultOptions, ...options };
  const [state, setState] = useState<State>("IDLE");
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (loading && state === "IDLE") {
      if (timeout.current) clearTimeout(timeout.current);

      timeout.current = setTimeout(() => {
        if (!loading) {
          return setState("IDLE");
        }

        timeout.current = setTimeout(() => {
          setState("EXPIRE");
        }, minDuration);

        setState("DISPLAY");
      }, delay);

      setState("DELAY");
    }

    if (!loading && state !== "DISPLAY") {
      if (timeout.current) clearTimeout(timeout.current);
      setState("IDLE");
    }
  }, [loading, state, delay, minDuration]);

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  return state === "DISPLAY" || state === "EXPIRE";
}
