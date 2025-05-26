import React, { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaBook, FaClone, FaQuestion } from "react-icons/fa";
import CountUp from "react-countup";
import { fetchQuestions, fetchTetelek, fetchFlashcardCount } from "@/api/repo";
const StackedCards = React.lazy(() => import("./StackedCards"));
import Spinner from "@/components/Spinner";

const MAX_COUNT_TETELEK = 200;
const MAX_COUNT_QUESTION = 1800;
const MAX_COUNT_FLASHCARDS = 1000;

const StatCard = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-secondary border border-transparent hover:border-border rounded-xl px-6 py-4 shadow-md w-full">
    {children}
  </div>
);

const StatCircle = ({
  icon: Icon,
  label,
  value,
  color,
  maxCount,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  maxCount: number;
}) => {
  const percentage = Math.min((value / maxCount) * 100, 100);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex items-center space-x-2 text-primary text-xl font-bold">
        <Icon />
        <span>{label}</span>
      </div>
      <div className="relative w-24 h-24">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="var(--border)"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
          <CountUp
            end={value}
            duration={3}
            separator=" "
            className="text-2xl font-bold text-foreground"
          />
        </div>
      </div>
    </div>
  );
};

const StatProgressBar = ({
  icon: Icon,
  label,
  value,
  color,
  maxCount,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  maxCount: number;
}) => {
  const percentage = Math.min((value / maxCount) * 100, 100);

  return (
    <div className="flex flex-col space-y-3 w-full items-center">
      <div className="flex items-center space-x-2 text-primary text-xl font-bold">
        <Icon />
        <span>{label}</span>
      </div>
      <div className="flex items-center space-x-4 w-full max-w-xs">
        <CountUp
          end={value}
          duration={3}
          separator=" "
          className="text-2xl font-bold text-foreground w-20"
        />
      </div>
      <div className="w-full max-w-xs h-4 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1500"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

const DashboardOverview = () => {
  const { data: flashcardData, isLoading: loadingFlashcards } = useQuery({
    queryKey: ["flashcard-count"],
    queryFn: fetchFlashcardCount,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const { data: tetelData, isLoading: loadingTetelek } = useQuery({
    queryKey: ["tetel-count"],
    queryFn: () => fetchTetelek({ page: 1, limit: 1 }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const { data: questionData, isLoading: loadingQuestions } = useQuery({
    queryKey: ["question-count"],
    queryFn: () => fetchQuestions({ page: 1, limit: 1 }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const tetelCount = tetelData?.total ?? 0;
  const questionCount = questionData?.total ?? 0;
  const flashcardCount = flashcardData?.total ?? 0;

  return (
    <Suspense fallback={<Spinner />}>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 w-full mb-6">
        <StatCard>
          <div className="flex flex-col space-y-3 w-full items-center">
            <div className="flex items-center space-x-2 text-primary text-xl font-bold mb-2">
              <FaClone />
              <span>Flashcards</span>
            </div>
            {loadingFlashcards ? (
              <Spinner />
            ) : (
              <StackedCards
                count={flashcardCount}
                maxCount={MAX_COUNT_FLASHCARDS}
              />
            )}
          </div>
        </StatCard>

        <StatCard>
          <StatCircle
            icon={FaBook}
            label="Tételek"
            value={loadingTetelek ? 0 : tetelCount}
            color="var(--primary)"
            maxCount={MAX_COUNT_TETELEK}
          />
        </StatCard>

        <StatCard>
          <StatProgressBar
            icon={FaQuestion}
            label="Kérdések"
            value={loadingQuestions ? 0 : questionCount}
            color="var(--primary)"
            maxCount={MAX_COUNT_QUESTION}
          />
        </StatCard>
      </div>
    </Suspense>
  );
};

export default DashboardOverview;
