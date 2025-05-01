// src/components/common/LearningMode.tsx
import React from "react";
import { Transition } from "@headlessui/react";
import FlashCard from "../FlashCard";
import { FaSyncAlt } from "react-icons/fa";

export interface LearningModeProps {
  questions: { question: string; answer: string }[];
  currentIdx: number;
  onNext: () => void;
  onExit: () => void;
}

export const LearningMode: React.FC<LearningModeProps> = ({
  questions,
  currentIdx,
  onNext,
  onExit,
}) => {
  const hasQuestions = questions.length > 0;
  const canRandomize = questions.length > 1;

  return (
    <Transition
      show={true}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      as="div"
    >
      <div className="flex flex-col items-center gap-6 mt-10">
        {hasQuestions && (
          <>
            <FlashCard
              question={questions[currentIdx]?.question ?? ""}
              answer={questions[currentIdx]?.answer ?? ""}
            />
            <div className="flex gap-4">
              {canRandomize && (
                <button
                  onClick={onNext}
                  className="px-6 py-3 bg-orange-400 text-white rounded-lg
                             hover:bg-orange-600 transition-colors flex items-center"
                >
                  <FaSyncAlt className="mr-2 animate-spin" />
                  Következő kérdés
                </button>
              )}
              <button
                onClick={onExit}
                className="px-6 py-3 border border-gray-400 text-gray-300
                             rounded-lg hover:bg-gray-700 transition-colors"
              >
                Vissza
              </button>
            </div>
          </>
        )}
      </div>
    </Transition>
  );
};

export default LearningMode;
