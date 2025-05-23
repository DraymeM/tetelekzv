import { Suspense, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "./Navbar";
import TimerControls from "./common/TimerControls";
import { useTimer } from "../hooks/useTimer";
import Spinner from "./Spinner";
import { fetchRandomFlashcard } from "../api/repo";
import type { Flashcard } from "../api/types";
import React from "react";
import PageTransition from "../components/common/PageTransition";
import OfflinePlaceholder from "./OfflinePlaceholder";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
const FlashCard = React.lazy(() => import("./common/FlashCard"));

export default function FlashCardsPage() {
  const queryClient = useQueryClient();
  const {
    data: flashcard,
    isLoading,
    error,
  } = useQuery<Flashcard, Error>({
    queryKey: ["randomFlashcard"],
    queryFn: fetchRandomFlashcard,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const pickRandom = () => {
    queryClient.invalidateQueries({ queryKey: ["randomFlashcard"] });
  };
  const isOnline = useOnlineStatus();
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
    if (flashcard && !isLoading) {
      queryClient.invalidateQueries({ queryKey: ["randomFlashcard"] });
    }
  }, []);
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

  if (!flashcard || "error" in flashcard) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center text-muted">
          No flashcards available.
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageTransition>
        <Suspense>
          <main className="flex flex-col items-center justify-center min-h-screen max-w-4xl mx-auto p-8 text-center">
            <h1 className="text-3xl font-bold mb-6">Villámkérdések</h1>

            <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
              <FlashCard
                question={flashcard.question}
                answer={flashcard.answer}
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
          </main>
        </Suspense>
      </PageTransition>
    </>
  );
}
