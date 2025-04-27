import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { FaCheck, FaTimes, FaSpinner } from "react-icons/fa";

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface AnswerPickerProps {
  answers: Answer[];
  onPick: (isCorrect: boolean) => void;
}

export default function AnswerPicker({ answers, onPick }: AnswerPickerProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setSelectedIdx(null);
    setShowResult(false);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [answers]);

  const handleClick = (idx: number) => {
    if (showResult || isLoading) return;
    setSelectedIdx(idx);
    setShowResult(true);
    onPick(answers[idx].isCorrect);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <FaSpinner className="animate-spin text-blue-400 text-5xl" />
      </div>
    );
  }

  return (
    <Transition
      as="div"
      appear
      show
      enter="transition-all duration-500"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
    >
      <div className="flex flex-col gap-4">
        {answers.map((answer, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            className={`w-full px-4 py-3 rounded-lg font-medium transition hover:cursor-pointer text-left shadow
              ${
                showResult
                  ? answer.isCorrect
                    ? "bg-green-600 text-white"
                    : selectedIdx === idx
                      ? "bg-red-600 text-white"
                      : "bg-gray-700 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span>{answer.text}</span>
              {showResult && answer.isCorrect && (
                <FaCheck className="text-green-300 ml-3" />
              )}
              {showResult && selectedIdx === idx && !answer.isCorrect && (
                <FaTimes className="text-red-300 ml-3" />
              )}
            </div>
          </button>
        ))}
      </div>
    </Transition>
  );
}
