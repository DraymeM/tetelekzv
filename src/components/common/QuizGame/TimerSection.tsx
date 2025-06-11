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
        <div className="fixed text-foreground top-20  md:right-5.5 right-4.5  px-3 rounded-md w-16 bg-secondary shadow-lf mt-4 flex gap-1">
          <span className="text-rose-400 text-right font-mono text-md font-bold">
            {timeLeft}
          </span>
          sec
        </div>
      )}
    </div>
  );
}
