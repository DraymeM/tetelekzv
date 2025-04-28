import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "./Navbar";
import { fetchMultiQuestionsAll } from "../api/repo";
import AnswerPicker from "../components/common/AnswerPicker";
import Spinner from "./Spinner";
import TimerControls from "../components/common/TimerControls";
import { useTimer } from "../hooks/useTimer";
import { FaRedo } from "react-icons/fa";
import { FaCheckCircle, FaClipboardList, FaTrophy } from "react-icons/fa";

function shuffleArray<T>(array: T[]): T[] {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function MultiChoicePage() {
  const {
    data: questions,
    isLoading,
    error,
  } = useQuery<
    { question: string; answers: { text: string; isCorrect: boolean }[] }[]
  >({
    queryKey: ["multiQuestions"],
    queryFn: fetchMultiQuestionsAll,
  });

  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const [shuffledAnswers, setShuffledAnswers] = useState<
    { text: string; isCorrect: boolean }[]
  >([]);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [streak, setStreak] = useState(0);

  const pickRandom = () => {
    if (!questions || questions.length === 0) return;

    let availableIndices = questions.map((_, index) => index);

    if (currentIdx !== null && questions.length > 1) {
      availableIndices = availableIndices.filter((i) => i !== currentIdx);
    }

    const randomIdx =
      availableIndices[Math.floor(Math.random() * availableIndices.length)];

    setCurrentIdx(randomIdx);
    setTimeLeft(timerDuration);
    const shuffled = shuffleArray(questions[randomIdx].answers);
    setShuffledAnswers(shuffled);
  };

  const {
    timerEnabled,
    setTimerEnabled,
    timerDuration,
    setTimerDuration,
    timeLeft,
    setTimeLeft,
  } = useTimer(pickRandom, 10);

  useEffect(() => {
    if (questions && currentIdx === null) {
      pickRandom();
    }
  }, [questions]);

  if (isLoading) return <Spinner />;
  if (error instanceof Error)
    return (
      <div className="p-10 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  const currentQuestion =
    currentIdx !== null ? (questions ?? [])[currentIdx] : null;

  const handleAnswerPick = (isCorrect: boolean) => {
    setQuestionsAnswered((prev) => prev + 1);
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleReset = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setStreak(0);
    pickRandom();
  };

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen mt-5 max-w-4xl mx-auto p-4 text-center overflow-auto">
        <h1 className="text-3xl font-bold mb-3">Felelet Választás</h1>
        <p className="mb-6 text-gray-300">Csak egy válaszlehetőség jó!</p>

        {/* Progress Info */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 text-gray-400 text-sm">
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

        {/* Progress Bar */}
        {questions && (
          <div className="w-full bg-gray-700 rounded-full h-3 mb-6">
            <div
              className="bg-green-500 h-3 rounded-full"
              style={{
                width: `${(questionsAnswered / questions.length) * 100}%`,
              }}
            />
          </div>
        )}

        {currentQuestion && (
          <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
            <div className="p-4 sm:p-6 rounded-lg bg-gray-800 text-white w-full overflow-auto max-h-[80vh]">
              <h2 className="text-xl font-semibold mb-4">
                {currentQuestion.question}
              </h2>

              <AnswerPicker
                answers={shuffledAnswers}
                onPick={handleAnswerPick}
              />
            </div>

            {/* Timer Controls */}
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

            {/* Timer Text */}
            {timerEnabled && (
              <div className="text-gray-400 text-sm mt-4">
                Következő kérdés {timeLeft} másodperc múlva
              </div>
            )}

            {/* Reset Button */}
            <button
              className="mt-8 px-6 py-3 rounded bg-red-600 hover:bg-red-700 transition-all transform hover:scale-105 flex items-center gap-2"
              onClick={handleReset}
            >
              <FaRedo />
              Újrakezdés
            </button>
          </div>
        )}
      </main>
    </>
  );
}
