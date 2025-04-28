import { useEffect, useState } from "react";

export function useTimer(onTimeUp: () => void, defaultDuration = 10) {
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerDuration, setTimerDuration] = useState(defaultDuration);
  const [timeLeft, setTimeLeft] = useState(defaultDuration);

  useEffect(() => {
    if (!timerEnabled) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          onTimeUp();
          return timerDuration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerEnabled, timerDuration, onTimeUp]);

  useEffect(() => {
    setTimeLeft(timerDuration);
  }, [timerDuration]);

  return {
    timerEnabled,
    setTimerEnabled,
    timerDuration,
    setTimerDuration,
    timeLeft,
    setTimeLeft,
  };
}
