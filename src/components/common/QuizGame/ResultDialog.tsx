import { Fragment, useState, useEffect, useRef, type JSX } from "react";
import { Transition, Dialog } from "@headlessui/react";
import {
  FaArrowLeft,
  FaTrophy,
  FaCertificate,
  FaStar,
  FaMinusCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useCountUp } from "react-countup";

interface ResultDialogProps {
  isOpen: boolean;
  score: number;
  total: number;
  onClose: () => void;
}

interface Grade {
  threshold: number;
  icon: JSX.Element;
  message: string;
}

const grades: Grade[] = [
  {
    threshold: 85,
    icon: <FaTrophy className="text-4xl text-green-600" />,
    message: "Fantasztikus munka! Igazi bajnok vagy!",
  },
  {
    threshold: 75,
    icon: <FaCertificate className="text-4xl text-lime-600" />,
    message: "Nagyszerű eredmény! Csak így tovább!",
  },
  {
    threshold: 60,
    icon: <FaStar className="text-4xl text-amber-500" />,
    message: "Szép munka, már majdnem tökéletes!",
  },
  {
    threshold: 50,
    icon: <FaMinusCircle className="text-4xl text-orange-600" />,
    message: "Jó kezdet! Gyakorolj még egy kicsit!",
  },
  {
    threshold: 0,
    icon: <FaTimesCircle className="text-4xl text-rose-600" />,
    message: "Ne csüggedj, legközelebb jobb lesz!",
  },
];

export default function ResultDialog({
  isOpen,
  score,
  total,
  onClose,
}: ResultDialogProps) {
  const finalPercentage = total > 0 ? (score / total) * 100 : 0;
  const [currentPercentage, setCurrentPercentage] = useState(0);
  const [showGrade, setShowGrade] = useState(false);
  const countUpRef = useRef<HTMLElement>(null!);

  const { start: startCountUp } = useCountUp({
    ref: countUpRef,
    start: 0,
    end: finalPercentage,
    duration: 3,
    startOnMount: false,
    useEasing: true,
  });

  useEffect(() => {
    if (isOpen) {
      setCurrentPercentage(0);
      setShowGrade(false);

      requestAnimationFrame(() => {
        setCurrentPercentage(finalPercentage);
      });

      // Slight delay ensures the modal renders before starting countUp
      const countUpTimer = setTimeout(() => {
        startCountUp();
      }, 100);

      const gradeTimer = setTimeout(() => {
        setShowGrade(true);
      }, 3000);

      return () => {
        clearTimeout(countUpTimer);
        clearTimeout(gradeTimer);
      };
    }
  }, [isOpen, finalPercentage, startCountUp]);

  const { icon, message } =
    grades.find((grade) => finalPercentage >= grade.threshold) ??
    grades[grades.length - 1];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md border-border border-2 transform overflow-hidden rounded-xl bg-secondary p-6 text-center align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl leading-6 text-foreground font-bold mb-4"
                >
                  Teszt Eredmények
                </Dialog.Title>

                <p className="text-sm text-foreground mb-2">
                  Helyes válaszok:{" "}
                  <span className="font-semibold text-green-500">{score}</span>/
                  {total}
                </p>

                <div className="flex flex-col space-y-3 w-full items-center">
                  <span
                    ref={countUpRef}
                    className="text-2xl font-bold text-primary"
                  ></span>

                  <div className="w-full max-w-xs h-4 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1500 ease-in-out"
                      style={{
                        width: `${currentPercentage}%`,
                        backgroundColor: "var(--primary)",
                      }}
                      role="progressbar"
                      aria-valuenow={currentPercentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Teszt eredmény előrehaladás"
                    />
                  </div>
                </div>

                {showGrade && (
                  <div className="mt-4 flex flex-col items-center space-y-2">
                    <span aria-hidden="true">{icon}</span>
                    <p className="text-sm text-foreground">{message}</p>
                  </div>
                )}

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-border hover:cursor-pointer rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    onClick={onClose}
                    aria-label="Vissza a kérdésekhez"
                    title="Vissza a kérdésekhez"
                  >
                    <FaArrowLeft className="mr-2" aria-hidden="true" />
                    Vissza a kérdésekhez
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
