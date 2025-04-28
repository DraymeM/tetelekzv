import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "./Navbar";
import FlashCard from "./common/FlashCard";
import TimerControls from "./common/TimerControls";
import { useTimer } from "../hooks/useTimer";
import { fetchQuestionsAll } from "../api/repo";

export default function FlashCardsPage() {
  const {
    data: questions,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allQuestions"],
    queryFn: fetchQuestionsAll,
  });

  const [currentIdx, setCurrentIdx] = useState<number | null>(null);

  const pickRandom = () => {
    if (!questions || questions.length === 0) return;
    let idx = currentIdx;
    while (idx === currentIdx) {
      idx = Math.floor(Math.random() * questions.length);
    }
    setCurrentIdx(idx);
  };

  const {
    timerEnabled,
    setTimerEnabled,
    timerDuration,
    setTimerDuration,
    timeLeft,
    setTimeLeft,
  } = useTimer(() => {
    pickRandom();
  });

  useEffect(() => {
    if (questions && currentIdx === null) {
      pickRandom();
    }
  }, [questions]);

  if (isLoading) return <div className="p-10 text-center">Loading…</div>;
  if (error instanceof Error)
    return (
      <div className="p-10 text-center text-red-500">
        Error: {error.message}
      </div>
    );

  const currentQuestion = currentIdx !== null ? questions?.[currentIdx] : null;

  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Villámkérdések</h1>

        {currentQuestion && (
          <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
            <FlashCard
              question={currentQuestion.question}
              answer={currentQuestion.answer}
            />

            <TimerControls
              onNext={pickRandom}
              timerEnabled={timerEnabled}
              setTimerEnabled={setTimerEnabled}
              timerDuration={timerDuration}
              setTimerDuration={(seconds) => {
                setTimerDuration(seconds);
                setTimeLeft(seconds);
              }}
            />

            {timerEnabled && (
              <div className="text-gray-400 text-sm mt-4">
                Következő kérdés {timeLeft} másodperc múlva
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
