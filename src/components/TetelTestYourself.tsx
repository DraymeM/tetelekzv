import { Suspense, useState } from "react";
import { Link, useParams, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  fetchQuestionsByTetelId,
  fetchMultiQuestionDetails,
} from "../api/repo";
import Spinner from "./Spinner";
import PageTransition from "../components/common/PageTransition";
import { FaArrowLeft } from "react-icons/fa";
import OfflinePlaceholder from "./OfflinePlaceholder";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { useTimer } from "../hooks/useTimer";
import React from "react";
const ResultDialog = React.lazy(
  () => import("../components/common/QuizGame/ResultDialog")
);
const TimerSection = React.lazy(
  () => import("../components/common/QuizGame/TimerSection")
);
const ResetButton = React.lazy(
  () => import("../components/common/QuizGame/ResetButton")
);
const Scoreboard = React.lazy(() => import("./common/QuizGame/ScoreBoard"));
const QuestionCard = React.lazy(() => import("./common/QuizGame/QuestionCard"));

interface IQuestion {
  id: number;
  question: string;
}

interface IMultiQuestion {
  id: number;
  question: string;
  answers: { text: string; isCorrect: boolean }[];
}

export default function TetelTestYourself() {
  const { id } = useParams({ strict: false });
  const tetelId = Number(id);
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch question IDs
  const {
    data: questionList,
    isLoading: isListLoading,
    error: listError,
  } = useQuery<{ data: IQuestion[]; total: number }, Error>({
    queryKey: ["tetelQuestions", tetelId],
    queryFn: () => fetchQuestionsByTetelId({ tetelId, page: 1, limit: 1000 }),
    enabled: !isNaN(tetelId) && tetelId > 0,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Fetch current question details
  const {
    data: currentQuestion,
    isLoading: isDetailLoading,
    error: detailError,
  } = useQuery<IMultiQuestion, Error>({
    queryKey: ["multiQuestionDetails", questionList?.data[currentIndex]?.id],
    queryFn: () =>
      fetchMultiQuestionDetails(questionList!.data[currentIndex].id),
    enabled: !!questionList?.data[currentIndex]?.id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const questions = questionList?.data ?? [];

  const {
    timerEnabled,
    setTimerEnabled,
    timerDuration,
    setTimerDuration,
    timeLeft,
    setTimeLeft,
  } = useTimer(() => {
    if (currentIndex < questions.length - 1 && !hasAnswered) {
      setCurrentIndex((prev) => prev + 1);
      setHasAnswered(false);
      setTimeLeft(timerDuration);
    }
  }, 10);

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
      if (currentIndex === questions.length - 1) {
        setIsDialogOpen(true);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setHasAnswered(false);
      setTimeLeft(timerDuration);
    } else {
      setIsDialogOpen(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setScore(0);
    setQuestionsAnswered(0);
    setStreak(0);
    setHasAnswered(false);
    setTimeLeft(timerDuration);
    setIsDialogOpen(false);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    navigate({
      to: "/tetelek/$id/questions",
      params: { id: tetelId.toString() },
    });
  };

  if (isListLoading || isDetailLoading) {
    return (
      <>
        <div className="p-10 text-center">
          <Spinner />
        </div>
      </>
    );
  }

  if (listError || detailError) {
    if (!isOnline) {
      return <OfflinePlaceholder />;
    }
    return (
      <>
        <div className="text-center mt-10 text-red-500">
          Hiba: {(listError || detailError)?.message}
        </div>
      </>
    );
  }

  return (
    <Suspense>
      <PageTransition>
        <div className="text-center pt-20">
          <div className="flex items-center justify-between mb-8 px-4">
            <Link
              to="/tetelek/$id"
              params={{ id: tetelId.toString() }}
              className="inline-flex items-center px-3 py-2 border border-border rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              aria-label="Vissza a tételhez"
              title="Vissza a tételhez"
            >
              <FaArrowLeft className="mr-2" aria-hidden="true" />
              Vissza
            </Link>
            <h2 className="text-3xl font-bold">Teszteld Magad</h2>
            <div className="w-[100px]"></div>
          </div>

          {questions.length === 0 ? (
            <p className="p-4 bg-secondary shadow-md rounded-md transition text-foreground duration-300 border-transparent hover:border-muted-foreground border-2 cursor-pointer transform">
              Nincsenek kérdések ehhez a tételhez.
            </p>
          ) : (
            <main className="flex flex-col items-center justify-center max-w-4xl mx-auto p-4 text-center">
              <p className="mb-6 text-secondary-foreground">
                Csak egy válaszlehetőség jó!
              </p>

              <Scoreboard
                score={score}
                questionsAnswered={questionsAnswered}
                streak={streak}
              />

              <QuestionCard
                question={currentQuestion?.question}
                answers={currentQuestion?.answers ?? []}
                onPick={handleAnswerPick}
              />

              <TimerSection
                timerEnabled={timerEnabled}
                setTimerEnabled={setTimerEnabled}
                timerDuration={timerDuration}
                setTimerDuration={(duration) => {
                  setTimerDuration(duration);
                  setTimeLeft(duration);
                }}
                timeLeft={timeLeft}
                onNext={handleNext}
              />

              <ResetButton onClick={handleReset} />
            </main>
          )}

          <ResultDialog
            isOpen={isDialogOpen}
            score={score}
            total={questions.length}
            onClose={handleDialogClose}
          />
        </div>
      </PageTransition>
    </Suspense>
  );
}
