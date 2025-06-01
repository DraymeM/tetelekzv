import { Suspense, useEffect, useState, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import Navbar from "./Navbar";
import AnswerPicker from "../components/common/AnswerPicker";
import Spinner from "./Spinner";
import TimerControls from "../components/common/TimerControls";
import { useTimer } from "../hooks/useTimer";
import {
  FaRedo,
  FaCheckCircle,
  FaClipboardList,
  FaTrophy,
  FaArrowLeft,
} from "react-icons/fa";
import { fetchRandomMultiQuestion } from "../api/repo";
import PageTransition from "../components/common/PageTransition";
import OfflinePlaceholder from "./OfflinePlaceholder";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function MultiChoicePage() {
  const queryClient = useQueryClient();
  const {
    data: currentQuestion,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["randomMultiQuestion"],
    queryFn: fetchRandomMultiQuestion,
    retry: 2,
    refetchOnWindowFocus: false,
  });
  const isOnline = useOnlineStatus();
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);

  const {
    timerEnabled,
    setTimerEnabled,
    timerDuration,
    setTimerDuration,
    timeLeft,
    setTimeLeft,
  } = useTimer(pickRandom, 10);

  function pickRandom() {
    queryClient.invalidateQueries({ queryKey: ["randomMultiQuestion"] });
    setTimeLeft(timerDuration);
    setHasAnswered(false);
  }

  useEffect(() => {
    if (!currentQuestion && !isLoading) {
      pickRandom();
    }
  }, [currentQuestion, isLoading]);

  const handleAnswerPick = (isCorrect: boolean) => {
    if (!hasAnswered) {
      setQuestionsAnswered((prev) => prev + 1);
      if (isCorrect) {
        setScore((prev) => prev + 1);
        setStreak((prev) => prev + 1);
      } else {
        setStreak(0);
      }
      setHasAnswered(true);
    }
  };

  const handleReset = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setStreak(0);
    setHasAnswered(false);
    pickRandom();
  };
  if (!isOnline) {
    return (
      <>
        <OfflinePlaceholder />
      </>
    );
  }
  if (isLoading)
    return (
      <>
        <Navbar />
        <div className="p-10 text-center">
          <Spinner />
        </div>
      </>
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  if (!currentQuestion || "error" in currentQuestion) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center text-muted-foreground">
          No questions available.
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageTransition>
        <Suspense fallback={<Spinner />}>
          <Link
            to="/tetelek"
            className="inline-flex items-center px-3 py-2 border border-border mt-20 md:ml-10 ml-1 rounded-md
                               text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground
                               focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Vissza a tételekhez
          </Link>
          <main className="flex flex-col items-center justify-center max-w-4xl mx-auto p-4 text-center">
            <h1 className="text-3xl font-bold mb-3">Felelet Választás</h1>

            <p className="mb-6 text-secondary-foreground">
              Csak egy válaszlehetőség jó!
            </p>

            {/* Scoreboard with fade-in transition */}
            <Transition
              as={Fragment}
              show={true}
              appear={true}
              enter="transition ease-out duration-500"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-300"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
            >
              <div className="flex flex-row gap-6 mb-6 text-muted-foreground text-sm justify-center">
                {/* Score */}
                <div className="flex items-center md:gap-2 bg-green-100/20 px-4 py-2 rounded-md shadow-sm">
                  <FaCheckCircle className="text-green-500" />
                  <span className="text-foreground">
                    Válaszok:{" "}
                    <span className="font-semibold text-green-500">
                      {score}
                    </span>
                  </span>
                </div>

                {/* Questions answered */}
                <div className="flex items-center md:gap-2 bg-blue-100/20 px-4 py-2 rounded-md shadow-sm">
                  <FaClipboardList className="text-blue-500" />
                  <span className="text-foreground">
                    Kérdések:{" "}
                    <span className="font-semibold text-blue-500">
                      {questionsAnswered}
                    </span>
                  </span>
                </div>

                {/* Streak */}
                <div className="flex items-center md:gap-2 bg-yellow-100/20 px-4 py-2 rounded-md shadow-sm">
                  <FaTrophy className="text-yellow-500" />
                  <span className="text-foreground">
                    Sorozat:{" "}
                    <span className="font-semibold text-yellow-500">
                      {streak}
                    </span>
                  </span>
                </div>
              </div>
            </Transition>

            {/* Current Question with slide and fade */}
            <Transition
              as={Fragment}
              show={!!currentQuestion}
              enter="transition ease-out duration-500 transform"
              enterFrom="opacity-0 translate-x-4"
              enterTo="opacity-100 translate-x-0"
              leave="transition ease-in duration-300 transform"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-0 translate-x-4"
            >
              <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
                <div className="p-6 rounded-lg bg-secondary text-foreground w-full overflow-auto max-h-[80vh] shadow-md">
                  <h2 className="text-xl font-semibold mb-4">
                    {currentQuestion.question}
                  </h2>
                  <AnswerPicker
                    answers={currentQuestion.answers}
                    onPick={handleAnswerPick}
                  />
                </div>

                <TimerControls
                  onNext={pickRandom}
                  timerEnabled={timerEnabled}
                  setTimerEnabled={setTimerEnabled}
                  timerDuration={timerDuration}
                  setTimerDuration={(duration) => {
                    setTimerDuration(duration);
                    setTimeLeft(duration);
                  }}
                />

                {timerEnabled && (
                  <div className="text-gray-400 text-sm mt-4">
                    Következő kérdés {timeLeft} másodperc múlva
                  </div>
                )}

                <button
                  className="mt-1 px-6 py-3 rounded bg-red-600 hover:bg-red-700 text-white transition-all transform hover:cursor-pointer flex items-center gap-2"
                  onClick={handleReset}
                >
                  <FaRedo />
                  Újrakezdés
                </button>
              </div>
            </Transition>
          </main>
        </Suspense>
      </PageTransition>
    </>
  );
}
