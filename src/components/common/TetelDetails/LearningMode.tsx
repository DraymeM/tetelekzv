import React, { useState } from "react";
import { Transition } from "@headlessui/react";
import FlashCard from "../FlashCard";
import { FaArrowLeft, FaRegHandPointer } from "react-icons/fa";
import { IoArrowRedoSharp } from "react-icons/io5";

export interface LearningModeProps {
  questions: { question: string; answer: string }[];
  onExit: () => void;
}

export const LearningMode: React.FC<LearningModeProps> = ({
  questions,
  onExit,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null);

  const selectCard = (idx: number) => setSelectedIdx(idx);

  const putBackToDeck = () => {
    setSelectedIdx(null);
    setFocusedIdx(null);
  };

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
      <div className="flex flex-col items-center gap-6">
        {/* Deck is always visible */}
        <div className="w-full md:max-w-[450px] overflow-x-auto scrollbar-hide touch-pan-x">
          <div className="flex flex-row items-center space-x-[-30px] px-2 py-6 select-none">
            {questions.map((card, idx) => {
              const midpoint = Math.floor(questions.length / 2);
              const isRightHalf = idx > midpoint;
              const isFocused = focusedIdx === idx;

              const handleCardClick = () => {
                if (isFocused) {
                  selectCard(idx); // second tap selects
                } else {
                  setFocusedIdx(idx); // first tap focuses
                }
              };

              const translateX = isFocused
                ? isRightHalf
                  ? "-translate-x-8"
                  : "translate-x-8"
                : "";

              const hoverTranslate = !isFocused
                ? isRightHalf
                  ? "hover:-translate-x-8"
                  : "hover:translate-x-8"
                : "";

              return (
                <div
                  key={card.question}
                  onClick={handleCardClick}
                  className={`relative w-48 h-32 bg-secondary border border-border rounded-md shadow-md flex items-center justify-center p-4
                    text-center font-semibold text-foreground cursor-pointer transition-transform duration-300 ease-in-out
                    ${isFocused ? `z-50 ${translateX} scale-125 border-primary text-primary shadow-lg bg-muted` : ""}
                    ${hoverTranslate} hover:z-50 hover:scale-125 hover:shadow-lg hover:border-primary hover:text-primary`}
                  style={{ transform: "skewY(-10deg)" }}
                  title={`Card ${idx + 1}`}
                >
                  <div className="relative text-lg font-bold">
                    {idx + 1}
                    {isFocused && (
                      <FaRegHandPointer className="absolute -top-6 left-1/2 -translate-x-1/2 text-primary text-xl" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedIdx !== null && (
          <>
            <button
              onClick={putBackToDeck}
              className="inline-flex items-center hover:cursor-pointer px-3 py-2 border border-border rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              aria-label="Put card back to deck"
              title="Put card back to deck"
            >
              <IoArrowRedoSharp
                className="mr-2"
                style={{ transform: "rotate(-90deg)" }}
              />
              Vissza rak
            </button>

            <FlashCard
              question={questions[selectedIdx]?.question ?? ""}
              answer={questions[selectedIdx]?.answer ?? ""}
            />
            <div className="flex gap-4 mt-1">
              <button
                onClick={onExit}
                className="inline-flex items-center hover:cursor-pointer px-3 py-2 border border-border rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                aria-label="Vissza a tételekhez"
                title="Vissza a tételhez"
              >
                <FaArrowLeft className="mr-2" />
                Tételhez
              </button>
              <button
                onClick={() => {
                  setSelectedIdx((prev) => {
                    const next =
                      prev !== null && prev < questions.length - 1
                        ? prev + 1
                        : 0;
                    setFocusedIdx(next);
                    return next;
                  });
                }}
                className="px-6 py-2 bg-amber-700 text-white rounded-lg hover:cursor-pointer hover:bg-amber-600 transition-colors flex items-center"
              >
                <FaArrowLeft
                  className="mr-2"
                  style={{ transform: "rotate(180deg)" }}
                />
                Következő
              </button>
            </div>
          </>
        )}
      </div>
    </Transition>
  );
};

export default LearningMode;
