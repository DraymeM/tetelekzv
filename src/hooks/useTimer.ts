import { useEffect, useState, useCallback } from "react";

export function useTimer(onTimeUp: () => void, defaultDuration = 10) {
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerDuration, setTimerDuration] = useState(defaultDuration);
  const [timeLeft, setTimeLeft] = useState(defaultDuration);
  const [isFiring, setIsFiring] = useState(false);
  const resetTimer = useCallback(() => {
    setTimeLeft(timerDuration);
  }, [timerDuration]);

  useEffect(() => {
    if (!timerEnabled || timeLeft <= 0) return;

    const timeout = setTimeout(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          if (!isFiring) {
            setIsFiring(true);

            onTimeUp();
            setTimeout(() => setIsFiring(false), 100); // Unlock after 100ms
            return timerDuration;
          }
          return prev; // Prevent reset if blocked
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [timerEnabled, timeLeft, onTimeUp, timerDuration, isFiring]);

  useEffect(() => {
    resetTimer();
  }, [timerDuration, resetTimer]);

  return {
    timerEnabled,
    setTimerEnabled,
    timerDuration,
    setTimerDuration,
    timeLeft,
    setTimeLeft,
  };
}
