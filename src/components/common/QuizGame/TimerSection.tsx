import TimerControls from "../TimerControls";

interface TimerSectionProps {
  timerEnabled: boolean;
  setTimerEnabled: (enabled: boolean) => void;
  timerDuration: number;
  setTimerDuration: (duration: number) => void;
  timeLeft: number;
  onNext: () => void;
}

export default function TimerSection({
  timerEnabled,
  setTimerEnabled,
  timerDuration,
  setTimerDuration,
  timeLeft,
  onNext,
}: TimerSectionProps) {
  return (
    <div className="flex flex-col items-center">
      <TimerControls
        onNext={onNext}
        timerEnabled={timerEnabled}
        setTimerEnabled={setTimerEnabled}
        timerDuration={timerDuration}
        setTimerDuration={setTimerDuration}
      />
      {timerEnabled && (
        <div className="text-gray-400 text-sm mt-4">
          Következő kérdés {timeLeft} másodperc múlva
        </div>
      )}
    </div>
  );
}
