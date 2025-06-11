import { Suspense, useState, Fragment, useCallback } from "react";
import { Transition } from "@headlessui/react";
import { Link, useParams, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  fetchQuestionsByTetelId,
  fetchMultiQuestionDetails,
} from "../../api/repo";
import Spinner from "../Spinner";
import PageTransition from "../common/PageTransition";
import { FaArrowLeft, FaRedo } from "react-icons/fa";
import OfflinePlaceholder from "../OfflinePlaceholder";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { useTimer } from "../../hooks/useTimer";
import AnswerPicker from "../common/AnswerPicker";
import TimerControls from "../common/TimerControls";
import ResultDialog from "../common/QuizGame/ResultDialog";
import ScoreBoard from "../common/QuizGame/ScoreBoard";
import { useDebouncedCallback } from "use-debounce";
import { useEffect } from "react";

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

  const {
    data: questionList,
    isLoading: isListLoading,
    error: listError,
  } = useQuery<{ data: IQuestion[]; total: number }, Error>({
    queryKey: ["tetelQuestions", tetelId],
    queryFn: () => fetchQuestionsByTetelId({ tetelId, page: 1, limit: 1000 }),
    enabled: !isNaN(tetelId) && tetelId > 0,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const questions = questionList?.data ?? [];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleNext = useDebouncedCallback(
    () => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setHasAnswered(false);
      } else {
        setIsDialogOpen(true);
        setTimerEnabled(false);
      }
      if (currentIndex == questions.length - 1) {
        setTimerEnabled(false);
      }
    },
    100,
    { leading: true, trailing: false }
  );
  const {
    timerEnabled,
    setTimerEnabled,
    timerDuration,
    setTimerDuration,
    timeLeft,
    setTimeLeft,
  } = useTimer(handleNext);

  useEffect(() => {
    if (timerEnabled && currentIndex === questions.length - 1) {
      const timeout = setTimeout(() => {
        setTimerEnabled(false);
        setIsDialogOpen(true);
      }, timerDuration * 1000);
      return () => clearTimeout(timeout);
    }
  }, [
    currentIndex,
    questions.length,
    timerDuration,
    timerEnabled,
    setTimerEnabled,
  ]);

  const {
    data: currentQuestion,
    isLoading: isDetailLoading,
    error: detailError,
  } = useQuery<IMultiQuestion, Error>({
    queryKey: ["multiQuestionDetails", questionList?.data[currentIndex]?.id],
    queryFn: () =>
      fetchMultiQuestionDetails(questionList!.data[currentIndex].id),
    enabled:
      !!questionList?.data[currentIndex]?.id &&
      !isDialogOpen &&
      !(isLastQuestion && !hasAnswered && timeLeft === 0),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const handleAnswerPick = useCallback(
    (isCorrect: boolean) => {
      if (!hasAnswered) {
        setQuestionsAnswered((prev) => prev + 1);
        if (isCorrect) {
          setScore((prev) => prev + 1);
          setStreak((prev) => prev + 1);
        } else {
          setStreak(0);
        }
        setHasAnswered(true);
        if (isLastQuestion) {
          setIsDialogOpen(true);
          setTimerEnabled(false);
        }
      }
    },
    [
      hasAnswered,
      isLastQuestion,
      setQuestionsAnswered,
      setScore,
      setStreak,
      setIsDialogOpen,
      setTimerEnabled,
    ]
  );

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setQuestionsAnswered(0);
    setStreak(0);
    setHasAnswered(false);
    setTimeLeft(timerDuration);
    setIsDialogOpen(false);
    setTimerEnabled(true);
  }, [timerDuration, setTimerEnabled, setTimeLeft]);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    navigate({
      to: "/tetelek/$id/questions",
      params: { id: tetelId.toString() },
    });
  }, [navigate, tetelId]);

  if (!isOnline) {
    return <OfflinePlaceholder />;
  }

  if (isListLoading || isDetailLoading) {
    return (
      <div className="p-10 text-center">
        <Spinner />
      </div>
    );
  }

  if (listError || detailError) {
    return (
      <div className="p-10 text-center text-red-500">
        Error: {(listError || detailError)?.message}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        No questions available for this tetel.
      </div>
    );
  }

  return (
    <Suspense fallback={<Spinner />}>
      <PageTransition>
        <div className="text-center">
          <div className="flex items-center justify-between mb-1 px-4">
            <Link
              to="/tetelek/$id"
              params={{ id: tetelId.toString() }}
              className="inline-flex items-center px-3 py-2 border border-border rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Vissza
            </Link>
            <div className="text-foreground bg-secondary px-2 rounded-md text-md font-medium">
              <span className="text-primary font-bold">{currentIndex + 1}</span>{" "}
              / {questions.length}
            </div>
          </div>

          <main className="flex flex-col items-center justify-center max-w-4xl mx-auto p-4 text-center">
            <p className="mb-6 text-secondary-foreground">
              Csak egy válaszlehetőség jó!
            </p>

            <ScoreBoard
              score={score}
              questionsAnswered={questionsAnswered}
              streak={streak}
            />

            <Transition
              as={Fragment}
              show={!!currentQuestion}
              enter="transition ease-out duration-500 transform"
              enterFrom="opacity-0 translate-x-4"
              enterTo="opacity-100 translate-x-0"
            >
              <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
                <div className="p-6 rounded-lg bg-secondary text-foreground w-full shadow-md">
                  <h2 className="text-xl font-semibold mb-4">
                    {currentQuestion?.question}
                  </h2>

                  <AnswerPicker
                    answers={currentQuestion?.answers ?? []}
                    onPick={handleAnswerPick}
                  />
                </div>

                <TimerControls
                  onNext={handleNext}
                  timerEnabled={timerEnabled}
                  setTimerEnabled={setTimerEnabled}
                  timerDuration={timerDuration}
                  setTimerDuration={(duration) => {
                    setTimerDuration(duration);
                    setTimeLeft(duration);
                  }}
                />

                {timerEnabled && !isDialogOpen && (
                  <div className="fixed text-foreground top-20 md:right-5.5 right-4.5 px-3 rounded-md w-16 bg-secondary shadow-lg mt-4 flex gap-1">
                    <span className="text-rose-400 text-right font-mono text-md font-bold">
                      {timeLeft}
                    </span>
                    sec
                  </div>
                )}

                <button
                  className="px-2 py-2 rounded-md mb-10 bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white transition-all flex items-center gap-2"
                  onClick={handleReset}
                >
                  <FaRedo />
                  Újrakezdés
                </button>
              </div>
            </Transition>

            <ResultDialog
              isOpen={isDialogOpen}
              score={score}
              total={questions.length}
              onClose={handleDialogClose}
            />
          </main>
        </div>
      </PageTransition>
    </Suspense>
  );
}
