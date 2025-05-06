import { Suspense, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import Navbar from "./Navbar";
import AnswerPicker from "../components/common/AnswerPicker";
import Spinner from "./Spinner";
import TimerControls from "../components/common/TimerControls";
import { useTimer } from "../hooks/useTimer";
import {
  FaRedo,
  FaPlus,
  FaCheckCircle,
  FaClipboardList,
  FaTrophy,
} from "react-icons/fa";
import { fetchRandomMultiQuestion } from "../api/repo";

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
      <Suspense fallback={<Spinner />}>
        <Navbar />
        <main className="flex flex-col items-center justify-center  mt-25 max-w-4xl mx-auto p-4 text-center">
          <h1 className="text-3xl font-bold mb-3">Felelet Választás</h1>
          <p className="mb-6 text-secondary-foreground">
            Csak egy válaszlehetőség jó!
          </p>

          {/* Scoreboard */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>
                Helyes válaszok: <span className="font-semibold">{score}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaClipboardList className="text-blue-500" />
              <span>
                Megválaszolt kérdések:{" "}
                <span className="font-semibold">{questionsAnswered}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaTrophy className="text-yellow-500" />
              <span>
                Sorozat: <span className="font-semibold">{streak}</span>
              </span>
            </div>
          </div>

          {/* Current Question */}
          <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
            <div className="p-4 sm:p-6 rounded-lg bg-secondary text-foreground w-full overflow-auto max-h-[80vh]">
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
              className="mt-8 px-6 py-3 rounded bg-red-600 hover:bg-red-700 text-white transition-all transform hover:scale-105 flex items-center gap-2"
              onClick={handleReset}
            >
              <FaRedo />
              Újrakezdés
            </button>
          </div>

          {/* Add Question Link */}
          <Link
            to="/pmchq"
            className="fixed bottom-7 right-7 p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all transform hover:scale-105 flex items-center justify-center"
            title="Adj hozzá saját kérdést"
          >
            <FaPlus size={20} />
          </Link>
        </main>
      </Suspense>
    </>
  );
}
