import { FaRegClock, FaCheck, FaArrowRight } from "react-icons/fa";
import { Menu, Transition } from "@headlessui/react";
import { useDebouncedCallback } from "use-debounce";

type TimerControlsProps = {
  onNext: () => void;
  timerEnabled: boolean;
  setTimerEnabled: (enabled: boolean) => void;
  timerDuration: number;
  setTimerDuration: (duration: number) => void;
};

export default function TimerControls({
  onNext,
  timerEnabled,
  setTimerEnabled,
  timerDuration,
  setTimerDuration,
}: TimerControlsProps) {
  // Debounced callbacks with 300ms wait
  const debouncedOnNext = useDebouncedCallback(onNext, 300);
  const debouncedToggleTimer = useDebouncedCallback(
    () => setTimerEnabled(!timerEnabled),
    300
  );
  const debouncedSetDuration = useDebouncedCallback(
    (seconds: number) => setTimerDuration(seconds),
    300
  );

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {/* Next Question Button */}
      <button
        onClick={debouncedOnNext}
        className="inline-flex items-center px-4 py-2 bg-amber-700 hover:cursor-pointer text-sm hover:bg-amber-600 text-white font-bold rounded-md transition focus:outline-none"
      >
        <FaArrowRight className="mr-2" />
        Következő
      </button>

      {/* Toggle Timer Button */}
      <button
        onClick={debouncedToggleTimer}
        className={`inline-flex items-center md:px-4 px-2 py-2 rounded-md text-sm hover:cursor-pointer font-bold transition focus:outline-none ${
          timerEnabled
            ? "bg-red-700 hover:bg-red-600 text-white"
            : "bg-green-700 hover:bg-green-600 text-white"
        }`}
      >
        <FaRegClock className="mr-2" />
        {timerEnabled ? "kikapcsolás" : "bekapcsolás"}
      </button>

      {/* Timer Duration Dropdown */}
      <Menu as="div" className="relative">
        <div>
          <Menu.Button className="inline-flex items-center px-4 py-2 bg-muted hover:bg-secondary text-foreground rounded-md text-sm transition focus:outline-none focus:ring-2 focus:ring-primary hover:cursor-pointer">
            {timerDuration} mp
          </Menu.Button>
        </div>

        <Transition
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute bottom-full mb-2 w-40 sm:top-full sm:bottom-auto sm:mt-2 sm:mb-0 left-1/2 -translate-x-1/2 rounded-md bg-secondary shadow-lg ring-1 ring-border ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {[5, 10, 30].map((seconds) => (
                <Menu.Item key={seconds}>
                  {({ active }) => (
                    <button
                      onClick={() => debouncedSetDuration(seconds)}
                      className={`${
                        active
                          ? "bg-muted text-muted-foreground"
                          : "text-foreground"
                      } flex w-full items-center justify-between px-4 py-2 text-sm`}
                    >
                      <span>{seconds} mp</span>
                      {timerDuration === seconds && (
                        <FaCheck className="text-green-400 ml-2" />
                      )}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
